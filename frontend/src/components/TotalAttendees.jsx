import React, { useEffect } from "react";
import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

const TotalAttendees = ({ refreshSignal }) => {
  const {
    data: nextTokenId,
    isLoading,
    refetch,
  } = useReadContract({
    address: POAP_CONTRACT_ADDRESS,
    abi: POAP_ABI,
    functionName: "nextTokenId",
  });

  useEffect(() => {
    if (refreshSignal !== undefined) {
      refetch?.();
    }
  }, [refreshSignal, refetch]);

  const count = Number(nextTokenId ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 text-center max-w-md mx-auto"
    >
      <div className="text-4xl mb-3">👥</div>
      <h3 className="text-lg text-gray-400 mb-2">Total Event Attendees</h3>
      <motion.div
        key={count}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-6xl font-black gradient-text"
      >
        {isLoading ? (
          <div className="shimmer h-16 w-32 mx-auto rounded-lg"></div>
        ) : (
          count
        )}
      </motion.div>
      <p className="text-sm text-gray-400 mt-4">POAPs minted on-chain</p>
    </motion.div>
  );
};

export default TotalAttendees;
