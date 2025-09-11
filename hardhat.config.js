require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
	defaultNetwork: 'sepolia',
	networks: {
		sepolia: {
			url: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id',
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 11155111,
		},
		hardhat: {
			chainId: 1337,
		},
	},
	solidity: {
		version: '0.8.28',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	mocha: {
		timeout: 40000,
	},
	etherscan: {
		apiKey: {
			sepolia: process.env.ETHERSCAN_API_KEY,
		},
	},
};
