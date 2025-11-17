import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

const MyPOAPs = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!window.ethereum) return;
        setLoading(true);

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contract = new Contract(POAP_CONTRACT_ADDRESS, POAP_ABI, provider);
        const total = await contract.nextTokenId();

        const owned = [];

        for (let i = 0; i < Number(total); i++) {
          try {
            const owner = await contract.ownerOf(i);

            if (owner.toLowerCase() === address.toLowerCase()) {
              let metadata = null;
              try {
                const tokenURI = await contract.tokenURI(i);
                console.log("Fetched tokenURI:", tokenURI);
                const httpUrl = tokenURI.startsWith("ipfs://")
                  ? tokenURI.replace("ipfs://", "https://dweb.link/ipfs/")
                  : tokenURI;
                console.log("Fetching metadata from:", httpUrl);
                const res = await fetch(httpUrl);
                metadata = await res.json();
              } catch (metaErr) {
                console.warn("Metadata fetch failed for token", i, metaErr);
              }

              owned.push({ tokenId: i, metadata });
            }
          } catch  {
            continue;
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
    <div className="my-6">
      <h3 className="text-lg font-semibold">My POAPs</h3>

      {loading ? (
        <p>Loading...</p>
      ) : tokens.length ? (
        tokens.map((t) => (
          <div key={t.tokenId} className="p-3 border rounded my-2">
            <strong>Token #{t.tokenId}</strong>

            {t.metadata ? (
              <div className="mt-2">
                <div><strong>Name:</strong> {t.metadata.name}</div>
                <div><strong>Description:</strong> {t.metadata.description}</div>
                <div><strong>Event:</strong> {t.metadata.event}</div>
                <div><strong>Issued On:</strong> {t.metadata.issuedOn || "N/A"}</div>
              </div>
            ) : (
              <div className="mt-2 text-gray-500">No metadata available</div>
            )}
          </div>
        ))
      ) : (
        <p>No POAPs yet</p>
      )}
    </div>
  );
};

export default MyPOAPs;
