import React, { useEffect, useState } from "react";
import { useAccount, useEnsName, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { POAP_CONTRACT_ADDRESS, POAP_ABI, EVENT_CONTRACT_ADDRESS, EVENT_ABI } from "../config";
import { toast } from "react-toastify";

const ClaimPOAP = ({ onMintSuccess }) => {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);

  const { data: hasClaimed, refetch: refetchHasClaimed } = useReadContract({
    address: POAP_CONTRACT_ADDRESS,
    abi: POAP_ABI,
    functionName: "hasClaimed",
    args: [address],
    enabled: !!address,
  });

  const { writeContract: writeEvent } = useWriteContract();
  const { writeContract: writePoap } = useWriteContract();

  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isTxSuccess && txHash) {
      refetchHasClaimed();
      if (onMintSuccess) onMintSuccess();
      setStatus("✅ POAP claimed successfully!");
      toast.success("POAP minted successfully 🎉");
      setTxHash(null);
    }
  }, [isTxSuccess, txHash, refetchHasClaimed, onMintSuccess]);

  useEffect(() => {
    if (hasClaimed) setStatus("✅ You've already claimed your POAP!");
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

    setStatus("⏳ Preparing transaction...");
    toast.info("Please confirm the transaction in your wallet.");

    try {
      let hash;
      if (EVENT_CONTRACT_ADDRESS && EVENT_CONTRACT_ADDRESS !== "0xYourEventManagerAddressHere") {
        const ensToSend = ensName || "";
        setStatus("⏳ Confirming attendance...");
        hash = await writeEvent({
          address: EVENT_CONTRACT_ADDRESS,
          abi: EVENT_ABI,
          functionName: "confirmAttendance",
          args: [ensToSend],
        });
      } else {
        setStatus("⏳ Minting POAP...");
        hash = await writePoap({
          address: POAP_CONTRACT_ADDRESS,
          abi: POAP_ABI,
          functionName: "mintPOAP",
          args: [address],
        });
      }
      
      if (hash) {
        setTxHash(hash);
        setStatus("⏳ Transaction submitted. Waiting for confirmation...");
      }
    } catch (err) {
      console.error("ClaimPOAP error:", err);
      const msg = err?.message || String(err);
      setStatus("❌ Error: " + msg);
      toast.error("Transaction failed: " + msg);
    }
  };

  const isDisabled = Boolean(hasClaimed) || isTxPending;

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center max-w-2xl mx-auto"
      >
        <div className="text-5xl mb-4">🔌</div>
        <p className="text-gray-400">Connect your wallet to claim your POAP</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🎟️</div>
        <h3 className="text-2xl font-bold mb-2">Claim Your POAP</h3>
        {ensName && (
          <p className="text-purple-400 text-sm">
            ENS: <strong>{ensName}</strong>
          </p>
        )}
      </div>

      <motion.button
        whileHover={!isDisabled ? { scale: 1.02, boxShadow: "0 0 30px rgba(102, 126, 234, 0.6)" } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        onClick={handleClaim}
        disabled={isDisabled}
        className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-all ${
          hasClaimed
            ? "bg-green-600 cursor-not-allowed"
            : isTxPending
            ? "bg-yellow-600 cursor-wait"
            : "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        } text-white disabled:opacity-70`}
      >
        {hasClaimed ? (
          <span>✅ Already Claimed</span>
        ) : isTxPending ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Processing...
          </span>
        ) : (
          "🎉 Claim Attendance POAP"
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {status && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-black bg-opacity-30 rounded-lg text-center"
          >
            <p className="text-sm">{status}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {txHash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs text-gray-400 text-center break-all"
        >
          Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClaimPOAP;
