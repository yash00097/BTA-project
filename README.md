# On-Chain Attendance (POAP) Project

A full-stack blockchain application for minting event attendance NFTs (POAPs) on Ethereum Sepolia testnet.

## Day-1 Setup Instructions

### 1. Install Dependencies

```bash
mkdir onchain-attendance && cd onchain-attendance
npm init -y
npm install --save-dev hardhat
npx hardhat --init
```

Choose "Create a basic sample project" when prompted.

### 2. Initialize Hardhat Project

When running `npx hardhat --init`, you'll be asked:

- Which version of Hardhat would you like to use? → `hardhat-3`
- Where would you like to initialize the project? → (current directory)
- Hardhat only supports ESM projects. Would you like to change `./package.json` to turn your project into ESM? → `true`
- Install dependencies using npm? → `true`

### 3. Install Additional Tools

```bash
npm install @openzeppelin/contracts dotenv ethers hardhat-ethers wagmi viem
```

### 4. Environment Setup

Create a `.env` file and add your MetaMask extension credentials:

```env
ALCHEMY_API_URL=your_alchemy_api_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Get your Alchemy API URL from: <https://developer.metamask.io/key/active-endpoints>

## Day-2: Smart Contract Development & Deployment

### 1. Files Created

- `contracts/POAP.sol` - Main POAP smart contract
- `scripts/deploy.cjs` - Deployment script
- `hardhat.config.cts` - Modified Hardhat configuration

### 2. Compile the Smart Contract

```bash
npx hardhat compile
```

This command will:

- Generate typings for 18 artifacts in `typechain-types` directory (target: ethers-v6)
- Compile 16 Solidity files successfully (evm target: paris)
- Create artifacts in the `artifacts/` directory

### 3. Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.cjs --network sepolia
```

The deployment script will output the deployed contract address.

### 4. Deployment Summary

After successful deployment, you'll receive:

| Item | Details |
|------|---------|
| **Contract Name** | POAP |
| **Network** | Sepolia Testnet |
| **Deployed Address** | Example: `0x45B8F72942fAEceA84159921804EE1De4e7fe11c` |
| **Deployer Wallet** | The address linked to your `.env` `PRIVATE_KEY` |
| **Status** | ✅ Successfully deployed |

> **Note**: Save your deployed contract address - you'll need it for frontend integration!

## What's Included?

- Native TypeScript support
- Hardhat scripts and tasks
- Solidity compilation (v0.8.20)
- OpenZeppelin ERC721 + Ownable contracts
- React + Vite frontend with Wagmi v2 for Web3 interactions
