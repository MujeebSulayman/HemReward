import { ethers } from "ethers";

export interface RewardParams {
  user: string
  amount: number
}

export interface ReferralParams {
  referrer: string
  referredUser: string
}

export interface RewardStruct {
  id: number
  owner: string
  amount: string
  claimed: boolean
  timestamp: number
}

export interface ReferralStruct {
  id: number
  referrer: string
  referredUser: string
  reward: string
  timestamp: number
}

export interface INECTR {
  maxSupply: () => Promise<bigint>;
  totalMinted: () => Promise<bigint>;
  mint: (to: string, amount: bigint) => Promise<ethers.ContractTransaction>;
  burn: (amount: bigint) => Promise<ethers.ContractTransaction>;
  distributeReward: (params: RewardParams) => Promise<ethers.ContractTransaction>;
  setReferral: (referrer: string) => Promise<ethers.ContractTransaction>;
  claimReferralReward: (referredUser: string) => Promise<ethers.ContractTransaction>;
}

export interface ContractEvent {
  referralRewardsClaimed: (referrer: string, reward: bigint) => void;
  rewardDistributed: (user: string, amount: bigint) => void;
}

export interface Web3State {
  address: string;
  balance: string;
  loading: boolean;
  error: string | null;
  contract: INECTR | null;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}
