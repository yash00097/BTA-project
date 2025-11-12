import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { EVENT_CONTRACT_ADDRESS, EVENT_ABI } from "../config";

const CertificateDetails = () => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

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
        }
      } catch (err) {
        console.error("Certificate fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, []);

  if (loading) return <p>Loading certificate...</p>;
  if (!certificate)
    return <p className="text-gray-400">No certificate found. Confirm attendance first.</p>;

  return (
    <div className="my-6 p-4 rounded-xl border border-gray-600 bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-2">🎓 On-Chain Certificate</h3>
      <p><strong>Event ID:</strong> {certificate.eventId}</p>
      <p><strong>ENS:</strong> {certificate.ens}</p>
      <p><strong>Issued On:</strong> {certificate.timestamp}</p>
    </div>
  );
};

export default CertificateDetails;
