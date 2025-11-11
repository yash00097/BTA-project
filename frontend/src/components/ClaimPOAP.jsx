import React, { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config";

const ClaimPOAP = () => {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState("");

  // ✅ Check if wallet already claimed
  const { data: hasClaimed, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasClaimed",
    args: [address],
    enabled: !!address,
  });

  const { writeContract } = useWriteContract();

  const handleClaim = async () => {
    try {
      setStatus("⏳ Minting your POAP...");
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mintPOAP",
        args: [address],
      });
      setStatus("✅ POAP minted successfully!");
      refetch(); // Refresh claimed status
    } catch (error) {
      console.error(error);
      setStatus("❌ Error minting POAP. Maybe already claimed?");
    }
  };

  useEffect(() => {
    if (hasClaimed) {
      setStatus("✅ You’ve already claimed your POAP!");
    }
  }, [hasClaimed]);

  if (!isConnected) return <p>🔌 Connect your wallet to claim POAP.</p>;

  return (
    <div className="claim-section">
      <button
        onClick={handleClaim}
        disabled={hasClaimed}
        style={{
          backgroundColor: hasClaimed ? "#555" : "#1a1a1a",
          cursor: hasClaimed ? "not-allowed" : "pointer",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginTop: "15px",
        }}
      >
        {hasClaimed ? "Already Claimed ✅" : "Claim Attendance NFT"}
      </button>
      {status && <p style={{ marginTop: "10px" }}>{status}</p>}
    </div>
  );
};

export default ClaimPOAP;
