// src/components/ClaimPOAP.jsx
import React, { useEffect, useState } from "react";
import { useAccount, useEnsName, useReadContract, useWriteContract } from "wagmi";
import { POAP_CONTRACT_ADDRESS, POAP_ABI, EVENT_CONTRACT_ADDRESS, EVENT_ABI } from "../config";
import { toast } from "react-toastify";

const ClaimPOAP = ({ onMintSuccess }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // read hasClaimed from POAP contract
  const { data: hasClaimed, refetch: refetchHasClaimed } = useReadContract({
    address: POAP_CONTRACT_ADDRESS,
    abi: POAP_ABI,
    functionName: "hasClaimed",
    args: [address],
    enabled: !!address,
  });

  const { writeContract: writeEvent } = useWriteContract(); // for EventManager
  const { writeContract: writePoap } = useWriteContract(); // for direct mint fallback

  useEffect(() => {
    if (hasClaimed) setStatus("✅ You’ve already claimed your POAP!");
    else setStatus("");
  }, [hasClaimed]);

  useEffect(() => {
    const checkEns = async () => {
      import("ethers").then(async ({ ethers }) => {
        const provider = new ethers.InfuraProvider("sepolia");
        const name = await provider.lookupAddress("0x6ca0DCf87d8A0DE73c1CE0B92F41970aa6C6A427");
        console.log("ENS:", name);
      });
    };
    checkEns();
  }, []);

  const handleClaim = async () => {
    if (!isConnected || !address) {
      toast.error("Connect wallet first");
      return;
    }

    setIsProcessing(true);
    setStatus("⏳ Preparing transaction...");

    try {
      // PREFERRED: call EventManager.confirmAttendance(ens)
      if (EVENT_CONTRACT_ADDRESS && EVENT_CONTRACT_ADDRESS !== "0xYourEventManagerAddressHere") {
        const ensToSend = ensName || "";
        setStatus("⏳ Sending attendance confirmation to EventManager...");
        toast.info("Please confirm the transaction in your wallet.");
        const tx = await writeEvent({
          address: EVENT_CONTRACT_ADDRESS,
          abi: EVENT_ABI,
          functionName: "confirmAttendance",
          args: [ensToSend],
        });

        // Some wagmi helpers return tx object, some return a promise that resolves after mining.
        // If tx.wait exists, wait for mining.
        if (tx && typeof tx.wait === "function") {
          setStatus("⏳ Waiting for transaction to be mined...");
          await tx.wait();
        } else {
          // best-effort: small delay for networks that return hash only
          setStatus("⏳ Transaction submitted. Waiting briefly...");
          await new Promise(r => setTimeout(r, 8000));
        }

        setStatus("✅ Attendance confirmed. POAP should be minted by the EventManager.");
        toast.success("Attendance recorded. Check My POAPs in a moment.");

        // refresh POAP claimed status
        await refetchHasClaimed?.();

        if (onMintSuccess) onMintSuccess();
        setIsProcessing(false);
        return;
      }

      // FALLBACK: direct mint on POAP contract (requires your wallet to be POAP.owner)
      setStatus("⚠️ EventManager address not configured. Attempting direct POAP mint (owner only).");
      toast.info("Attempting direct POAP mint (owner only). Please confirm in MetaMask.");
      const tx2 = await writePoap({
        address: POAP_CONTRACT_ADDRESS,
        abi: POAP_ABI,
        functionName: "mintPOAP",
        args: [address],
      });

      if (tx2 && typeof tx2.wait === "function") {
        setStatus("⏳ Waiting for POAP mint to be mined...");
        await tx2.wait();
      } else {
        await new Promise(r => setTimeout(r, 8000));
      }

      setStatus("✅ POAP minted successfully (fallback).");
      toast.success("POAP minted successfully 🎉");
      await refetchHasClaimed?.();
      if (onMintSuccess) onMintSuccess();
    } catch (err) {
      console.error("ClaimPOAP error:", err);
      const msg = err?.message || String(err);
      setStatus("❌ Error: " + msg);
      toast.error("Mint failed: " + msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isConnected) return <p>🔌 Connect your wallet to claim POAP.</p>;

  return (
    <div className="claim-section">
      <p className="text-sm">
        ENS: <strong>{ensName ?? "— (not set)"}</strong>
      </p>

      <button
        onClick={handleClaim}
        disabled={Boolean(hasClaimed) || isProcessing}
        style={{
          backgroundColor: hasClaimed || isProcessing ? "#555" : "#1a1a1a",
          cursor: hasClaimed || isProcessing ? "not-allowed" : "pointer",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "12px",
        }}
      >
        {hasClaimed ? "Already Claimed ✅" : (isProcessing ? "Processing..." : "Claim Attendance NFT")}
      </button>

      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
      <p className="text-xs text-gray-400 mt-2">
        Note: Preferred flow calls <code>EventManager.confirmAttendance(ens)</code> which mints POAP on your behalf.
      </p>
    </div>
  );
};

export default ClaimPOAP;
