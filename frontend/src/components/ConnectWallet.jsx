import React from "react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(c => c.name === "MetaMask");
  const { data: ensName } = useEnsName({ address });

  const handleConnect = async () => {
    try {
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector });
        toast.success("Wallet connected successfully 🦊");
      }
    } catch (error) {
      toast.error("Connection failed: " + error.message);
    }
  };

  return (
    <div className="text-center">
      {isConnected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold text-green-400">Wallet Connected</span>
          </div>
          
          <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400 mb-1">Address</p>
            <p className="text-white font-mono text-sm break-all">{address}</p>
            {ensName && (
              <p className="text-purple-400 text-sm mt-2">ENS: {ensName}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => disconnect()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Disconnect Wallet
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 max-w-md mx-auto"
        >
          <div className="mb-6">
            <div className="text-5xl mb-4">🦊</div>
            <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 text-sm">
              Connect with MetaMask to claim your attendance POAP
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(102, 126, 234, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            disabled={!metaMaskConnector || isPending}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Connecting..." : "Connect MetaMask"}
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4 text-sm"
            >
              ⚠️ {error.message}
            </motion.p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ConnectWallet;
