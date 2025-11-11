import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config";

const TotalAttendees = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const nextId = await contract.nextTokenId();
        setCount(Number(nextId));
      } catch (err) {
        console.error("TotalAttendees error", err);
      }
    };
    load();
  }, []); 

  return (
    <div className="my-4">
      <h3 className="text-lg">Total attendees</h3>
      <p className="text-2xl font-bold">{count ?? "Loading..."}</p>
    </div>
  );
};

export default TotalAttendees;
