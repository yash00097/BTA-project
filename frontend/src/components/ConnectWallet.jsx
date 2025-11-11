import React from "react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { toast } from "react-toastify";


const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const metaMaskConnector = connectors.find(c => c.name === "MetaMask");

  // resolve ENS (if available)
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
    <div className="text-center my-6">
      {isConnected ? (
        <>
          <p className="text-sm text-green-400">
            🟢 Connected: <strong>{address}</strong>
            {ensName ? <span className="ml-2 text-gray-300">({ensName})</span> : null}
          </p>
          <button className="mt-3 px-4 py-2 border rounded" onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          disabled={!metaMaskConnector || isPending}
          className="px-4 py-2 border rounded hover:bg-gray-800"
        >
          {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && <p className="text-red-500 mt-2">⚠️ {error.message}</p>}
    </div>
  );
};

export default ConnectWallet;
