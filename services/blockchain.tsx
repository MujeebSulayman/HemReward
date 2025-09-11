import { ethers } from "ethers";
import address from "../contracts/contractAddress.json";
import abi from '../artifacts/contracts/NECTR.sol/NECTR.json';

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
    const maxSupply = await contract.MAX_SUPPLY();
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

// Debug function to help with testing rewards
const getRewardCalculation = async (address: string): Promise<{
  timeStaked: number;
  apyRate: number;
  annualReward: string;
  rewards: string;
}> => {
  try {
    const contract = await getEthereumContract();
    const calculation = await contract.getRewardCalculation(address);
    return {
      timeStaked: Number(calculation.timeStaked),
      apyRate: Number(calculation.apyRate),
      annualReward: fromWei(calculation.annualReward),
      rewards: fromWei(calculation.rewards)
    };
  } catch (error) {
    console.error("Error getting reward calculation:", error);
    return {
      timeStaked: 0,
      apyRate: 0,
      annualReward: "0",
      rewards: "0"
    };
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
const mintTokens = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    const accounts = await ethereum.request({ method: "eth_accounts" });
    tx = await contract.mint(accounts[0], toWei(amount), "Demo minting");
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Minting error:", error);
    return Promise.reject(error.message || "Minting failed");
  }
};

// Additional functions for compatibility
const getTotalMinted = async (): Promise<string> => {
  return getTotalSupply();
};

const getClaimedRewards = async (address: string): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const stakeInfo = await contract.getStakeInfo(address);
    return fromWei(stakeInfo.totalRewardsClaimed);
  } catch (error) {
    console.error("Error getting claimed rewards:", error);
    return "0";
  }
};

const burnTokens = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.transfer("0x000000000000000000000000000000000000dEaD", toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Burning error:", error);
    return Promise.reject(error.message || "Burning failed");
  }
};

const distributeReward = async (recipient: string, amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.transfer(recipient, toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Distribution error:", error);
    return Promise.reject(error.message || "Distribution failed");
  }
};

const setReferral = async (referrer: string): Promise<any> => {
  // Mock function - not implemented in current contract
  return Promise.resolve({ hash: "0xmock" });
};

const claimReferralReward = async (user: string): Promise<any> => {
  // Mock function - not implemented in current contract
  return Promise.resolve({ hash: "0xmock" });
};

// Essential functions for the demo
const getMinStakeAmount = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const minAmount = await contract.minStakeAmount();
    return fromWei(minAmount);
  } catch (error) {
    console.error("Error getting min stake amount:", error);
    return "0";
  }
};

const getMaxStakeAmount = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const maxAmount = await contract.maxStakeAmount();
    return fromWei(maxAmount);
  } catch (error) {
    console.error("Error getting max stake amount:", error);
    return "0";
  }
};

const getTotalRewardsDistributed = async (): Promise<string> => {
  try {
    const contract = await getEthereumContract();
    const totalRewards = await contract.totalRewardsDistributed();
    return fromWei(totalRewards);
  } catch (error) {
    console.error("Error getting total rewards distributed:", error);
    return "0";
  }
};

const getStakingStartTime = async (): Promise<number> => {
  try {
    const contract = await getEthereumContract();
    const startTime = await contract.stakingStartTime();
    return Number(startTime);
  } catch (error) {
    console.error("Error getting staking start time:", error);
    return 0;
  }
};

const isPaused = async (): Promise<boolean> => {
  try {
    const contract = await getEthereumContract();
    return await contract.paused();
  } catch (error) {
    console.error("Error checking pause status:", error);
    return false;
  }
};

// Public faucet function
const claimFaucetTokens = async (): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.claimFaucetTokens();
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Faucet claim error:", error);
    return Promise.reject(error.message || "Faucet claim failed");
  }
};

// Admin Functions
const addAuthorizedMinter = async (minter: string): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.addAuthorizedMinter(minter);
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Add authorized minter error:", error);
    return Promise.reject(error.message || "Failed to add authorized minter");
  }
};

const removeAuthorizedMinter = async (minter: string): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.removeAuthorizedMinter(minter);
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Remove authorized minter error:", error);
    return Promise.reject(error.message || "Failed to remove authorized minter");
  }
};

const pauseStaking = async (): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.pauseStaking();
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Pause staking error:", error);
    return Promise.reject(error.message || "Failed to pause staking");
  }
};

const unpauseStaking = async (): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.unpauseStaking();
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Unpause staking error:", error);
    return Promise.reject(error.message || "Failed to unpause staking");
  }
};

const setMinStakeAmount = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.setMinStakeAmount(toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Set min stake amount error:", error);
    return Promise.reject(error.message || "Failed to set minimum stake amount");
  }
};

const setMaxStakeAmount = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.setMaxStakeAmount(toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Set max stake amount error:", error);
    return Promise.reject(error.message || "Failed to set maximum stake amount");
  }
};

const updateTierApy = async (tier: number, newApyRate: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.updateTierApy(tier, newApyRate);
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Update tier APY error:", error);
    return Promise.reject(error.message || "Failed to update tier APY");
  }
};

const setBlacklist = async (account: string, isBlacklisted: boolean): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.setBlacklist(account, isBlacklisted);
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Set blacklist error:", error);
    return Promise.reject(error.message || "Failed to update blacklist");
  }
};

const emergencyWithdraw = async (amount: number): Promise<any> => {
  if (!ethereum) {
    return Promise.reject(new Error("Please install a wallet provider"));
  }

  try {
    const contract = await getEthereumContract();
    tx = await contract.emergencyWithdraw(toWei(amount));
    await tx.wait();
    return Promise.resolve(tx);
  } catch (error: any) {
    console.error("Emergency withdraw error:", error);
    return Promise.reject(error.message || "Failed to perform emergency withdraw");
  }
};

// Check if address is authorized minter
const isAuthorizedMinter = async (address: string): Promise<boolean> => {
  if (!ethereum) {
    return false;
  }

  try {
    const contract = await getEthereumContract();
    return await contract.authorizedMinters(address);
  } catch (error: any) {
    console.error("Error checking authorized minter:", error);
    return false;
  }
};

// Check if address is blacklisted
const isBlacklisted = async (address: string): Promise<boolean> => {
  if (!ethereum) {
    return false;
  }

  try {
    const contract = await getEthereumContract();
    return await contract.blacklisted(address);
  } catch (error: any) {
    console.error("Error checking blacklist:", error);
    return false;
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
  getRewardCalculation,
  getStakeInfo,
  getTokenBalance,
  getUserTier,
  getTierInfo,
  getContractStats,
  mintTokens,
  getTotalMinted,
  getClaimedRewards,
  burnTokens,
  distributeReward,
  setReferral,
  claimReferralReward,
  // Essential functions
  getMinStakeAmount,
  getMaxStakeAmount,
  getTotalRewardsDistributed,
  getStakingStartTime,
  isPaused,
  // Faucet function
  claimFaucetTokens,
  // Admin functions
  addAuthorizedMinter,
  removeAuthorizedMinter,
  pauseStaking,
  unpauseStaking,
  setMinStakeAmount,
  setMaxStakeAmount,
  updateTierApy,
  setBlacklist,
  emergencyWithdraw,
  isAuthorizedMinter,
  isBlacklisted,
  toWei,
  fromWei,
};
