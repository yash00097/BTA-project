import React, { useEffect } from "react";
import { useReadContract } from "wagmi";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

// Accept a refresh signal via props (incrementing value) to manually refetch.
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

  // When refreshSignal changes, trigger a refetch (e.g., after successful mint)
  useEffect(() => {
    if (refreshSignal !== undefined) {
      refetch?.();
    }
  }, [refreshSignal, refetch]);

  const count = Number(nextTokenId ?? 0);

  return (
    <div className="my-4 text-center">
      <p className="text-lg font-semibold text-gray-300">
        Total Attendees: <span className="text-2xl font-bold text-green-400 align-middle">{isLoading ? "…" : count}</span>
      </p>
    </div>
  );
};

export default TotalAttendees;
