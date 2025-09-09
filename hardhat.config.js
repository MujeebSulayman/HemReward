require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
	defaultNetwork: 'mumbai',
	networks: {
		mumbai: {
			url: process.env.MUMBAI_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo',
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			chainId: 80001,
		},
		sepolia: {
			url: process.env.NEXT_PUBLIC_RPC_URL,
			accounts: [process.env.PRIVATE_KEY],
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
			polygonMumbai: process.env.POLYGONSCAN_API_KEY,
		},
	},
};
