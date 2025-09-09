import { ethers } from "ethers";
import address from "../contracts/contractAddress.json";
import abi from '@artifacts/contracts/NECTR.sol/NECTR.json';

const toWei = (num: number) => ethers.parseEther(num.toString());
const fromWei = (num: string | number | null): string => {
  if (num === null || num === undefined) {
    return "0";
  }
  return ethers.formatEther(num.toString());
};

let ethereum: any;
let tx: any;

if (typeof window !== "undefined") ethereum = (window as any).ethereum;

const getEthereumContract = async () => {
  const accounts = await ethereum?.request?.({ method: "eth_accounts" });

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(address.NECTR, abi.abi, signer);
    return contract;
  } else {
    const provider = new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/your-project-id'
    );
    const contract = new ethers.Contract(address.NECTR, abi.abi, provider);
    return contract;
  }
};

// Staking functions
const stakeTokens = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.stake(toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Staking error:", error);
    return Promise.reject(error.message || "Staking failed");
  }
};

const unstakeTokens = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.unstake(toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Unstaking error:", error);
    return Promise.reject(error.message || "Unstaking failed");
  }
};

const claimStakingRewards = async (): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.claimRewards();
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Claim rewards error:", error);
    return Promise.reject(error.message || "Claiming rewards failed");
  }
};

// View functions
const getMaxSupply = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const maxSupply = await contract.maxSupply();
    return fromWei(maxSupply);
  } catch (error) {
    console.error("Error getting max supply:", error);
    return "0";
  }
};

const getTotalSupply = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const totalSupply = await contract.totalSupply();
    return fromWei(totalSupply);
  } catch (error) {
    console.error("Error getting total supply:", error);
    return "0";
  }
};

const getTotalStaked = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const totalStaked = await contract.getTotalStaked();
    return fromWei(totalStaked);
  } catch (error) {
    console.error("Error getting total staked:", error);
    return "0";
  }
};

const getUserStakedAmount = async (address: string): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const stakedAmount = await contract.getUserStakedAmount(address);
    return fromWei(stakedAmount);
  } catch (error) {
    console.error("Error getting user staked amount:", error);
    return "0";
  }
};

const getPendingRewards = async (address: string): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const pendingRewards = await contract.getPendingRewards(address);
    return fromWei(pendingRewards);
  } catch (error) {
    console.error("Error getting pending rewards:", error);
    return "0";
  }
};

const getStakeInfo = async (address: string): Promise<{
  amount: string;
  timestamp: number;
  lastClaimTime: number;
  tier: number;
  totalRewardsClaimed: string;
  isActive: boolean;
}> => {
  try {
    const contract = await getEthereumContract();
    const stakeInfo = await contract.getStakeInfo(address);
    return {
      amount: fromWei(stakeInfo.amount),
      timestamp: Number(stakeInfo.timestamp),
      lastClaimTime: Number(stakeInfo.lastClaimTime),
      tier: Number(stakeInfo.tier),
      totalRewardsClaimed: fromWei(stakeInfo.totalRewardsClaimed),
      isActive: stakeInfo.isActive
    };
  } catch (error) {
    console.error("Error getting stake info:", error);
    return { 
      amount: "0", 
      timestamp: 0, 
      lastClaimTime: 0,
      tier: 0,
      totalRewardsClaimed: "0",
      isActive: false 
    };
  }
};

const getTokenBalance = async (address: string): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const balance = await contract.balanceOf(address);
    return fromWei(balance);
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};

// Enhanced contract functions
const getUserTier = async (address: string): Promise<number> => {
  try {
    const contract = await getEthereumContract();
    const tier = await contract.getUserTier(address);
    return Number(tier);
  } catch (error) {
    console.error("Error getting user tier:", error);
    return 0;
  }
};

const getTierInfo = async (tier: number): Promise<{
  minAmount: string;
  maxAmount: string;
  apyRate: number;
  name: string;
}> => {
  try {
    const contract = await getEthereumContract();
    const tierInfo = await contract.getTierInfo(tier);
    return {
      minAmount: fromWei(tierInfo.minAmount),
      maxAmount: fromWei(tierInfo.maxAmount),
      apyRate: Number(tierInfo.apyRate),
      name: tierInfo.name
    };
  } catch (error) {
    console.error("Error getting tier info:", error);
    return {
      minAmount: "0",
      maxAmount: "0",
      apyRate: 0,
      name: "Unknown"
    };
  }
};

const getContractStats = async (): Promise<{
  totalStaked: string;
  totalRewards: string;
  totalSupply: string;
  maxSupply: string;
}> => {
  try {
    const contract = await getEthereumContract();
    const stats = await contract.getContractStats();
    return {
      totalStaked: fromWei(stats.totalStaked),
      totalRewards: fromWei(stats.totalRewards),
      totalSupply: fromWei(stats.totalSupply),
      maxSupply: fromWei(stats.maxSupply)
    };
  } catch (error) {
    console.error("Error getting contract stats:", error);
    return {
      totalStaked: "0",
      totalRewards: "0",
      totalSupply: "0",
      maxSupply: "0"
    };
  }
};

// Owner functions (for testing/demo purposes)
const mintTokens = async (to: string, amount: number, reason: string = "Demo minting"): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.mint(to, toWei(amount), reason);
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Minting error:", error);
    return Promise.reject(error.message || "Minting failed");
  }
};

export {
  stakeTokens,
  unstakeTokens,
  claimStakingRewards,
  getMaxSupply,
  getTotalSupply,
  getTotalStaked,
  getUserStakedAmount,
  getPendingRewards,
  getStakeInfo,
  getTokenBalance,
  getUserTier,
  getTierInfo,
  getContractStats,
  mintTokens,
  toWei,
  fromWei,
};
