// src/config.js
import POAPArtifact from "./abi/POAP.json";

// === SET YOUR DEPLOYED ADDRESSES BELOW ===
export const POAP_CONTRACT_ADDRESS = "0x752D845dAa0Aa41C991188e18c6fb3d80e4d0260"; 
export const EVENT_CONTRACT_ADDRESS = "0x10Bde70D0c3E8bffe33AdA50AFF5125aE2C9A19b"; 

// === POAP Contract ABI ===
export const POAP_ABI = POAPArtifact.abi;

// === EventManager Contract ABI ===
export const EVENT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "ens", "type": "string" }],
    "name": "confirmAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getCertificate",
    "outputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "string", "name": "ens", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
