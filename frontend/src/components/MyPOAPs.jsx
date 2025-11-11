import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config";
import { ethers } from "ethers";

function normalizeTokenURI(uri) {
  if (!uri) return null;
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (uri.startsWith("http")) return uri;
  return uri;
}

const MyPOAPs = () => {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setTokens([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const next = await contract.nextTokenId();
        const total = next.toNumber();

        // fetch ownerOf for each token; small loops ok for test/dev
        const checks = [];
        for (let id = 0; id < total; id++) {
          checks.push(contract.ownerOf(id).then(owner => ({ id, owner })).catch(() => null));
        }
        const owners = await Promise.all(checks);

        // filter owner matches address (checksum compare)
        const lowerAddr = address.toLowerCase();
        const myIds = owners.filter(Boolean).filter(o => o.owner && o.owner.toLowerCase() === lowerAddr).map(o => o.id);

        // fetch metadata for each
        const metaPromises = myIds.map(async (id) => {
          const uri = await contract.tokenURI(id);
          const url = normalizeTokenURI(uri);
          let metadata = { name: `Token #${id}`, image: null, description: "" };
          if (url) {
            try {
              const resp = await fetch(url);
              if (resp.ok) {
                metadata = await resp.json();
                // if metadata.image is ipfs:// normalize
                if (metadata.image) metadata.image = normalizeTokenURI(metadata.image);
              }
            } catch(e) {
              console.warn("Failed to fetch metadata for", id, url, e);
            }
          }
          return { id, metadata };
        });

        const metas = await Promise.all(metaPromises);
        if (!cancelled) setTokens(metas);
      } catch (err) {
        console.error("MyPOAPs error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isConnected, address]);

  if (!isConnected) return <p className="mt-4">🔌 Connect your wallet to see your POAPs.</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">My POAPs</h3>
      {loading ? <p>Loading your POAPs…</p> : null}
      {(!loading && tokens.length === 0) && <p className="mt-2 text-gray-400">You don’t have any POAPs yet.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {tokens.map(t => (
          <div key={t.id} className="p-4 bg-gray-800 border rounded">
            {t.metadata.image ? (
              // limit image size
              <img src={t.metadata.image} alt={t.metadata.name || `Token ${t.id}`} className="w-full h-40 object-cover rounded" />
            ) : (
              <div className="w-full h-40 bg-gray-700 rounded flex items-center justify-center text-sm">No image</div>
            )}
            <h4 className="mt-2 font-medium">{t.metadata.name || `Token #${t.id}`}</h4>
            {t.metadata.description && <p className="text-sm mt-1 text-gray-300">{t.metadata.description}</p>}
            <p className="text-xs text-gray-400 mt-2">Token ID: {t.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPOAPs;
