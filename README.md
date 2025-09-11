# NECTR Token Ecosystem

A comprehensive decentralized application (dApp) built for the NECTR Token ecosystem, featuring staking functionality, social media integration, and news modules.

## 🚀 Features

### Core Functionality
- **NECTR Token Contract**: ERC-20 token with staking capabilities
- **Staking Interface**: Stake/unstake tokens with 10% APY rewards
- **Wallet Integration**: MetaMask support via RainbowKit
- **Social Media Feed**: Twitter/X integration with community links
- **News Module**: RSS-style news feed with category filtering
- **Transaction Tracking**: Real-time transaction status updates

### Technical Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Ethereum, Polygon Mumbai testnet
- **Smart Contracts**: Solidity 0.8.28, OpenZeppelin
- **Wallet**: RainbowKit, Wagmi, Viem
- **Development**: Hardhat, Ethers.js

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- Yarn or npm package manager
- MetaMask wallet installed
- Polygon Mumbai testnet configured in MetaMask
- Mumbai testnet MATIC tokens for gas fees

## 🛠️ Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd nectr-token-ecosystem
```

2. **Install dependencies**
```bash
   yarn install
   # or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
```env
   # WalletConnect Project ID (get from https://cloud.walletconnect.com/)
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   
   # Mumbai RPC URL (get from Alchemy, Infura, or use public endpoint)
   NEXT_PUBLIC_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_api_key
   
   # For deployment (optional)
   PRIVATE_KEY=your_private_key_here
   MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_api_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

4. **Deploy Smart Contract** (Optional - for testing)
```bash
   # Compile contracts
   npx hardhat compile
   
   # Deploy to Mumbai testnet
   npx hardhat run scripts/deploy.js --network mumbai
   ```

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
yarn build
yarn start
# or
npm run build
npm start
```

## 📱 Usage Guide

### 1. Wallet Connection
- Click "Connect Wallet" button
- Select MetaMask from the wallet options
- Approve the connection request
- Ensure you're connected to Polygon Mumbai testnet

### 2. Staking Tokens
- Navigate to the Staking Interface section
- Enter the amount of NECTR tokens you want to stake
- Click "Stake Tokens" and confirm the transaction
- Monitor your staking rewards in real-time

### 3. Unstaking Tokens
- In the Staking Interface, enter the amount to unstake
- Click "Unstake Tokens" and confirm the transaction
- Your tokens and accumulated rewards will be returned

### 4. Claiming Rewards
- If you have pending rewards, click "Claim Rewards"
- Confirm the transaction to receive your staking rewards

### 5. Social Media & News
- Browse the Twitter feed for latest updates
- Join community channels via the social links
- Read news articles and filter by category

## 🏗️ Project Structure

```
nectr-token-ecosystem/
├── components/           # React components
│   ├── Hero.tsx         # Landing page hero section
│   ├── StakingInterface.tsx  # Staking functionality
│   ├── SocialFeed.tsx   # Social media integration
│   ├── NewsModule.tsx   # News feed component
│   └── ...
├── contracts/           # Smart contracts
│   ├── NECTR.sol       # Main token contract
│   └── contractAddress.json  # Deployed contract addresses
├── scripts/            # Deployment scripts
│   └── deploy.js       # Contract deployment script
├── services/           # Blockchain services
│   └── blockchain.tsx  # Contract interaction functions
├── src/
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global styles
│   └── wagmi.ts        # Wallet configuration
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## 🔧 Smart Contract Details

### NECTR Token Contract
- **Name**: NECTR Token
- **Symbol**: NECTR
- **Decimals**: 18
- **Max Supply**: 1,000,000,000 NECTR
- **Initial Supply**: 100,000,000 NECTR

### Staking Features
- **Reward Rate**: 10% APY
- **Minimum Stake**: No minimum
- **Reward Calculation**: Time-based with compound interest
- **Security**: ReentrancyGuard protection

### Key Functions
- `stake(uint256 amount)`: Stake tokens and start earning rewards
- `unstake(uint256 amount)`: Unstake tokens and claim rewards
- `claimRewards()`: Claim accumulated staking rewards
- `getPendingRewards(address user)`: View pending rewards
- `getUserStakedAmount(address user)`: View staked amount

## 🌐 Network Configuration

### Polygon Mumbai Testnet
- **Chain ID**: 80001
- **RPC URL**: https://polygon-mumbai.g.alchemy.com/v2/demo
- **Block Explorer**: https://mumbai.polygonscan.com/
- **Testnet Faucet**: https://faucet.polygon.technology/

### Adding Mumbai to MetaMask
1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network"
4. Enter the following details:
   - Network Name: Polygon Mumbai
   - RPC URL: https://polygon-mumbai.g.alchemy.com/v2/demo
   - Chain ID: 80001
   - Currency Symbol: MATIC
   - Block Explorer: https://mumbai.polygonscan.com/

## 🧪 Testing

### Unit Tests
```bash
npx hardhat test
```

### Contract Verification
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## 📦 Deployment

### Smart Contract Deployment
```bash
# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```



## 📊 Demo Features

This demo includes:
- ✅ Functional NECTR token smart contract
- ✅ Staking interface with real-time updates
- ✅ MetaMask wallet integration
- ✅ Twitter/X social media feed
- ✅ News module with category filtering
- ✅ Responsive design and animations
- ✅ Transaction status tracking
- ✅ Sepolia testnet deployment ready

---

**Note**: This is a demo application for evaluation purposes. The smart contract is deployed on Polygon Mumbai testnet for testing. For production use, additional security audits and testing would be required.