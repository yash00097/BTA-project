import React from "react";
import { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "@wagmi/core/chains";
import { metaMask } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ConnectWallet from "./components/ConnectWallet";
import ClaimPOAP from "./components/ClaimPOAP";
import TotalAttendees from "./components/TotalAttendees";
import MyPOAPs from "./components/MyPOAPs";
import CertificateDetails from "./components/CertificateDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const queryClient = new QueryClient();

const config = createConfig({
  chains: [sepolia], // 👈 explicitly tell wagmi to use Sepolia Testnet
  autoConnect: true,
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(), // 👈 http provider for Sepolia
  },
});

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold mb-6">🎟️ On-Chain Attendance (POAP)</h1>
          <ConnectWallet />
          <div className="mt-6">
            <TotalAttendees key={refreshKey}/>
            <ClaimPOAP onMintSuccess={() => setRefreshKey(k => k + 1)}/>
            <MyPOAPs />
            <h2 className="text-2xl font-semibold text-gray-300 mt-10 mb-4">
              🎓 Certificate Details
            </h2>
            <CertificateDetails key={refreshKey} />
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
