import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { POAP_CONTRACT_ADDRESS, POAP_ABI } from "../config";

const MyPOAPs = ({ refreshSignal }) => {
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
                const httpUrl = tokenURI.startsWith("ipfs://")
                  ? tokenURI.replace("ipfs://", "https://dweb.link/ipfs/")
                  : tokenURI;
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
  }, [refreshSignal]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center max-w-4xl mx-auto"
      >
        <div className="shimmer h-32 w-full rounded-lg"></div>
        <p className="text-gray-400 mt-4">Loading your POAPs...</p>
      </motion.div>
    );
  }

  if (tokens.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-4xl mx-auto"
      >
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No POAPs Yet</h3>
        <p className="text-gray-400">Claim your first attendance POAP to get started!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tokens.map((t, index) => (
            <motion.div
              key={t.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">🎟️</div>
                <span className="px-3 py-1 bg-purple-600 bg-opacity-50 rounded-full text-xs font-semibold">
                  #{t.tokenId}
                </span>
              </div>

              {t.metadata ? (
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {t.metadata.name || `POAP #${t.tokenId}`}
                  </h4>
                  {t.metadata.description && (
                    <p className="text-sm text-gray-400">{t.metadata.description}</p>
                  )}
                  {t.metadata.event && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Event:</span>
                      <span className="text-purple-400 font-semibold">{t.metadata.event}</span>
                    </div>
                  )}
                  {t.metadata.issuedOn && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📅</span>
                      <span>{t.metadata.issuedOn}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">POAP #{t.tokenId}</h4>
                  <p className="text-sm text-gray-500">Metadata not available</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MyPOAPs;
