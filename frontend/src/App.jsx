import React from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "@wagmi/core/chains";
import { metaMask } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectWallet from "./components/ConnectWallet";
import ClaimPOAP from "./components/ClaimPOAP";

const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            color: "#fff",
            backgroundColor: "#1a1a1a",
            minHeight: "100vh",
            padding: "2rem",
          }}
        >
          <h1>
            🎟️ <b>On-Chain Attendance (POAP)</b>
          </h1>
          <ConnectWallet />
          <ClaimPOAP />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
