# NECTR Token Ecosystem - Deployment Guide

This guide will walk you through deploying the NECTR Token Ecosystem to various platforms.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Yarn or npm package manager
- Git repository access
- Environment variables configured

### 1. Environment Setup

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

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

### 3. Build the Application

```bash
yarn build
# or
npm run build
```

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

2. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings
   - Navigate to Environment Variables
   - Add all variables from your `.env.local` file

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Custom domain can be configured in Project Settings

### Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Sign in with GitHub
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   - Build command: `yarn build` or `npm run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all required environment variables

4. **Deploy**
   - Netlify will build and deploy automatically

### IPFS (Decentralized)

1. **Export Static Files**
   ```bash
   yarn export
   # or
   npm run export
   ```

2. **Upload to IPFS**
   - Use services like Pinata, Infura IPFS, or local IPFS node
   - Upload the `out` folder contents

3. **Access via IPFS Gateway**
   - Use IPFS gateways like `ipfs.io`, `cloudflare-ipfs.com`

## 🔗 Smart Contract Deployment

### Polygon Mumbai Testnet

1. **Get Testnet MATIC**
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Request testnet MATIC tokens

2. **Deploy Contract**
   ```bash
   # Compile contracts
   npx hardhat compile
   
   # Deploy to Mumbai
   npx hardhat run scripts/deploy.js --network mumbai
   ```

3. **Verify Contract**
   ```bash
   npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
   ```

4. **Update Contract Address**
   - Update `contracts/contractAddress.json` with deployed address
   - Commit and push changes

### Local Development

1. **Start Local Network**
   ```bash
   npx hardhat node
   ```

2. **Deploy to Local Network**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Update Frontend**
   - Update contract address in `contractAddress.json`
   - Restart development server

## 🔧 Configuration

### WalletConnect Setup

1. **Create Project**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create new project
   - Copy Project ID

2. **Configure in App**
   - Add Project ID to environment variables
   - Update `src/wagmi.ts` if needed

### RPC Provider Setup

1. **Alchemy (Recommended)**
   - Sign up at [Alchemy](https://alchemy.com)
   - Create new app for Polygon Mumbai
   - Copy HTTP URL

2. **Infura**
   - Sign up at [Infura](https://infura.io)
   - Create new project
   - Copy endpoint URL

3. **Public RPC (Development Only)**
   - Use public endpoints for testing
   - Not recommended for production

## 📱 Mobile Deployment

### React Native (Future)

The current app is web-only, but can be adapted for mobile:

1. **Expo/React Native**
   - Use Expo for cross-platform development
   - Implement wallet connection via WalletConnect
   - Use Web3 libraries compatible with React Native

2. **Progressive Web App (PWA)**
   - Add PWA configuration to Next.js
   - Enable offline functionality
   - Add to home screen capability

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env.local` to version control
- Use different keys for development and production
- Rotate keys regularly

### Smart Contract Security
- Deploy to testnet first
- Run comprehensive tests
- Consider professional audit for mainnet
- Use multi-signature wallets for contract ownership

### Frontend Security
- Validate all user inputs
- Implement rate limiting
- Use HTTPS in production
- Regular dependency updates

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules .next
   yarn install
   yarn build
   ```

2. **Contract Deployment Issues**
   ```bash
   # Check network configuration
   npx hardhat console --network mumbai
   ```

3. **Wallet Connection Issues**
   - Ensure MetaMask is installed
   - Check network configuration
   - Verify WalletConnect Project ID

4. **Environment Variable Issues**
   - Check variable names (case-sensitive)
   - Ensure all required variables are set
   - Restart development server after changes

### Support

For deployment issues:
- Check the [README.md](README.md) for detailed setup
- Review error logs in deployment platform
- Contact support: nectr.devs@gmail.com

## 📊 Performance Optimization

### Frontend
- Enable Next.js optimizations
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Smart Contract
- Use efficient data structures
- Minimize gas usage
- Implement proper error handling
- Consider upgrade patterns

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Monitoring

### Analytics
- Google Analytics for user behavior
- Vercel Analytics for performance
- Custom event tracking for staking actions

### Error Tracking
- Sentry for error monitoring
- LogRocket for session replay
- Custom error boundaries

### Smart Contract Monitoring
- PolygonScan for transaction monitoring
- Custom event listeners
- Alert systems for critical events

---

**Note**: This deployment guide covers the most common scenarios. For production deployments, additional security measures and monitoring should be implemented.
