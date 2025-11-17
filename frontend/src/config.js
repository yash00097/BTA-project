// src/config.js
import POAPArtifact from "./abi/POAP.json";

// === SET YOUR DEPLOYED ADDRESSES BELOW ===
export const POAP_CONTRACT_ADDRESS = "0x6BeE5606001D07Ae5815a908B7559273ddaa07EB"; 
export const EVENT_CONTRACT_ADDRESS = "0xD3D3f791088898DB3BD5eA6b198e529e6BE8bb23"; 

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
