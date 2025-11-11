# Copilot Instructions: On-Chain Attendance (POAP) Project

## Architecture Overview

This is a full-stack blockchain application for minting event attendance NFTs (POAPs) on Ethereum Sepolia testnet:
- **Smart Contract Layer**: Solidity contract (`contracts/POAP.sol`) using OpenZeppelin ERC721 + Ownable
- **Frontend**: React + Vite + Wagmi v2 for Web3 interactions
- **Deployment**: Hardhat 2.x with TypeScript support

**Data Flow**: User connects MetaMask → Wallet auto-switches to Sepolia → Frontend calls `mintPOAP()` (owner-only) → POAP NFT minted on-chain → UI reflects claimed status via `hasClaimed` mapping.

## Critical Conventions

### Hardhat Setup (Root Directory)
- **Config file**: `hardhat.config.cts` (TypeScript with `.cts` extension, not `.ts`)
- **Deploy script**: `scripts/deploy.cjs` (CommonJS, uses `require("hardhat")`)
- **Network**: Sepolia testnet configured with Alchemy RPC
- **Environment**: Requires `.env` with `ALCHEMY_API_URL`, `PRIVATE_KEY`, `ETHERSCAN_API_KEY`
- **Compile**: No script defined—use `npx hardhat compile` directly
- **Deploy**: `npx hardhat run scripts/deploy.cjs --network sepolia`
- **TypeChain**: Auto-generates types in `typechain-types/` after compilation

### Frontend (frontend/ Directory)
- **Framework**: React 19 + Vite 7 + Wagmi v2 (latest APIs)
- **Web3 Stack**: `wagmi` + `viem` + `@tanstack/react-query` for state management
- **Chain**: Hardcoded to Sepolia (`sepolia` from `@wagmi/core/chains`)
- **Connector**: MetaMask only via `metaMask()` connector
- **Contract Config**: `src/config.js` exports `CONTRACT_ADDRESS` and `CONTRACT_ABI` (imported from `src/abi/POAP.json`)

**Auto-Network Switching**: `ConnectWallet.jsx` forces Sepolia selection via `window.ethereum.request()` before connecting. If Sepolia not in wallet, auto-adds chain config.

### Key Patterns

1. **ABI Sync Workflow**:
   - After deploying contract, copy `artifacts/contracts/POAP.sol/POAP.json` to `frontend/src/abi/POAP.json`
   - Update `CONTRACT_ADDRESS` in `frontend/src/config.js`

2. **Wagmi Hooks in `ClaimPOAP.jsx`**:
   - `useReadContract`: Checks `hasClaimed[address]` to disable button
   - `useWriteContract`: Calls `mintPOAP(address)` (owner-only function)
   - Always pass `enabled: !!address` to prevent queries when disconnected

3. **Owner-Only Minting**:
   - `mintPOAP()` has `onlyOwner` modifier—frontend must be connected with deployer wallet to mint
   - Frontend doesn't enforce this; transaction will revert if non-owner tries

## Development Workflow

```bash
# Smart Contract (from root)
npx hardhat compile               # Generates artifacts + typechain-types
npx hardhat run scripts/deploy.cjs --network sepolia

# Frontend (from frontend/)
npm run dev                       # Starts Vite dev server on http://localhost:5173
npm run build                     # Production build
npm run preview                   # Preview production build

# After contract changes
1. Recompile contract
2. Copy artifacts/contracts/POAP.sol/POAP.json to frontend/src/abi/POAP.json
3. Update CONTRACT_ADDRESS in frontend/src/config.js if redeployed
```

## Gotchas

- **Mixed module systems**: Root uses ES modules (`"type": "module"`), but deploy script is CommonJS
- **Hardhat config**: TypeScript file with `.cts` extension exports via `as any` type assertion
- **No tests**: Project has no test setup despite Hardhat Toolbox installed
- **Hardcoded address**: Frontend config has deployed contract address—must update after each deployment
- **MetaMask dependency**: No WalletConnect or other connectors configured
