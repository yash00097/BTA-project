import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

const MyPOAPs = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        setLoading(true);
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contract = new Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);
        const totalSupply = await contract.nextTokenId();

        const owned = [];

        for (let i = 0; i < totalSupply; i++) {
          try {
            const owner = await contract.ownerOf(i);
            if (owner.toLowerCase() === address.toLowerCase()) {
              owned.push(i);
            }
          } catch {
            continue; // skip if token doesn't exist
          }
        }

        setTokens(owned);
      } catch (err) {
        console.error("MyPOAPs error", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="my-6 text-center">
      <h3 className="text-lg font-semibold text-gray-300">My POAPs</h3>
      {loading ? (
        <p className="text-gray-400">Loading your POAPs...</p>
      ) : tokens.length > 0 ? (
        <ul className="mt-2">
          {tokens.map((id) => (
            <li key={id} className="text-green-400">
              🪪 Token #{id}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">You don’t have any POAPs yet.</p>
      )}
    </div>
  );
};

export default MyPOAPs;
