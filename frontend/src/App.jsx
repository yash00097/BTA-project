import React from "react";
import { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "@wagmi/core/chains";
import { metaMask } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ConnectWallet from "./components/ConnectWallet";
import ClaimPOAP from "./components/ClaimPOAP";
import TotalAttendees from "./components/TotalAttendees";
import MyPOAPs from "./components/MyPOAPs";
import CertificateDetails from "./components/CertificateDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia],
  autoConnect: true,
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
  },
});

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleMintSuccess = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header with gradient animation */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.h1
                className="text-6xl font-black mb-4 gradient-text"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                ✨ Event Attendance Platform
              </motion.h1>
              <p className="text-xl text-gray-300">
                Claim your Proof of Attendance NFT on Sepolia Testnet
              </p>
            </motion.div>

            {/* Connect Wallet Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ConnectWallet />
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <TotalAttendees refreshSignal={refreshKey} />
            </motion.div>

            {/* Claim Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8"
            >
              <ClaimPOAP onMintSuccess={handleMintSuccess} />
            </motion.div>

            {/* My POAPs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-bold text-center mb-6 gradient-text">
                🎨 My Collected POAPs
              </h2>
              <MyPOAPs refreshSignal={refreshKey} />
            </motion.div>

            {/* Certificate Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-bold text-center mb-6 gradient-text">
                🎓 Attendance Certificate
              </h2>
              <CertificateDetails refreshSignal={refreshKey} />
            </motion.div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
