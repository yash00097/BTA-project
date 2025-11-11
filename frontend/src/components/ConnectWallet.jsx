import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(
    (connector) => connector.name === "MetaMask"
  );

  // 🧩 Function to switch to Sepolia automatically
  const switchToSepolia = async () => {
    if (window.ethereum) {
      try {
        // Try switching first
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // 0xaa36a7 = 11155111 (Sepolia)
        });
      } catch (switchError) {
        // If not added, request to add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  rpcUrls: ["https://eth-sepolia.g.alchemy.com/v2/"], // optional custom RPC
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
                },
              ],
            });
          } catch (addError) {
            console.error("User rejected adding Sepolia:", addError);
          }
        }
      }
    }
  };

  // 🪙 Handle connection
  const handleConnect = async () => {
    await switchToSepolia();
    if (metaMaskConnector) connect({ connector: metaMaskConnector });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {isConnected ? (
        <>
          <p>
            🟢 Connected: <strong>{address}</strong>
          </p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={!metaMaskConnector || isPending}
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && <p style={{ color: "red" }}>⚠️ {error.message}</p>}
    </div>
  );
};

export default ConnectWallet;
