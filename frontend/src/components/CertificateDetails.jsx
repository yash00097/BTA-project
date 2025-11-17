import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { motion } from "framer-motion";
import { EVENT_CONTRACT_ADDRESS, EVENT_ABI } from "../config";

const CertificateDetails = ({ refreshSignal }) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        if (!window.ethereum) return;

        setLoading(true);
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contract = new Contract(EVENT_CONTRACT_ADDRESS, EVENT_ABI, provider);
        const [eventId, timestamp, ens] = await contract.getCertificate(address);

        if (Number(timestamp) > 0) {
          setCertificate({
            eventId: Number(eventId),
            timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
            ens: ens || "— (not set)",
          });
        } else {
          setCertificate(null);
        }
      } catch (err) {
        console.error("Certificate fetch error:", err);
        setCertificate(null);
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, [refreshSignal]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center max-w-2xl mx-auto"
      >
        <div className="shimmer h-32 w-full rounded-lg"></div>
        <p className="text-gray-400 mt-4">Loading certificate...</p>
      </motion.div>
    );
  }

  if (!certificate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-2xl mx-auto"
      >
        <div className="text-6xl mb-4">📜</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Certificate Yet</h3>
        <p className="text-gray-400">Claim your attendance POAP to receive your certificate</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-8 max-w-2xl mx-auto border-2 border-purple-500 border-opacity-30"
    >
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🎓</div>
        <h3 className="text-2xl font-bold gradient-text mb-2">Attendance Certificate</h3>
        <p className="text-sm text-gray-400">Verified on Blockchain</p>
      </div>

      <div className="space-y-4">
        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Event ID</p>
          <p className="text-2xl font-bold text-purple-400">#{certificate.eventId}</p>
        </div>

        {certificate.ens !== "— (not set)" && (
          <div className="bg-black bg-opacity-30 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">ENS Name</p>
            <p className="text-lg font-semibold text-white">{certificate.ens}</p>
          </div>
        )}

        <div className="bg-black bg-opacity-30 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">Issued On</p>
          <p className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📅</span>
            {certificate.timestamp}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          ✅ This certificate is permanently stored on Ethereum Sepolia
        </p>
      </div>
    </motion.div>
  );
};

export default CertificateDetails;
