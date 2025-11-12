// src/config.js
import POAPArtifact from "./abi/POAP.json";

// === SET YOUR DEPLOYED ADDRESSES BELOW ===
export const POAP_CONTRACT_ADDRESS = "0xbD347fe7Bb315fCcfC90D3f16ADDa3613346Cbb9"; 
export const EVENT_CONTRACT_ADDRESS = "0x3B7a7D7b142B02f8233dD79e3554046621Fd40Bc"; 

// === POAP Contract ABI ===
export const POAP_ABI = POAPArtifact.abi;

// === EventManager Contract ABI ===
export const EVENT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "ens", "type": "string" }
    ],
    "name": "confirmAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "attended",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "certificates",
    "outputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "string", "name": "ens", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
