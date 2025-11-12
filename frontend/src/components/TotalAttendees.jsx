import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

const TotalAttendees = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);
        const nextId = await contract.nextTokenId();
        setCount(Number(nextId));
      } catch (err) {
        console.error("TotalAttendees error", err);
      }
    };
    load();
  }, []); 

  return (
    <div className="my-4 text-center">
      <h3 className="text-lg font-semibold text-gray-300">Total Attendees</h3>
      <p className="text-2xl font-bold text-green-400">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default TotalAttendees;
