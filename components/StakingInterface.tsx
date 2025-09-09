import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  stakeTokens,
  unstakeTokens,
  claimStakingRewards,
  getTotalStaked,
  getUserStakedAmount,
  getPendingRewards,
  getStakeInfo,
  getTokenBalance,
} from "../services/blockchain";
import {
  formatTokenAmount,
  reportError,
  validateTokenAmount,
} from "../utils/web3.utils";
import { useAccount } from "wagmi";

const formatLargeNumber = (value: string) => {
  const num = parseFloat(value);

  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;

  return num.toFixed(2);
};

// Reusable Stat Component
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}> = ({ title, value, icon, bgColor, textColor }) => (
  <div
    className={`p-5 rounded-xl ${bgColor} flex items-center space-x-4 shadow-lg transform transition-all duration-300 hover:scale-105`}
  >
    <div className={`p-3 rounded-full ${textColor} bg-opacity-20`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-xl font-bold text-white" title={value}>
        {formatLargeNumber(value)}
      </p>
    </div>
  </div>
);

const StakingInterface: React.FC = () => {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const [totalStaked, setTotalStaked] = useState<string>("0");
  const [userStaked, setUserStaked] = useState<string>("0");
  const [pendingRewards, setPendingRewards] = useState<string>("0");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [stakeInfo, setStakeInfo] = useState<{amount: string, timestamp: number, rewardRate: number}>({
    amount: "0",
    timestamp: 0,
    rewardRate: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStakingData = async () => {
      if (!address) return;
      
      try {
        const [totalStakedAmount, userStakedAmount, pendingRewardsAmount, tokenBalanceAmount, stakeInfoData] = await Promise.all([
          getTotalStaked(),
          getUserStakedAmount(address),
          getPendingRewards(address),
          getTokenBalance(address),
          getStakeInfo(address),
        ]);

        setTotalStaked(totalStakedAmount);
        setUserStaked(userStakedAmount);
        setPendingRewards(pendingRewardsAmount);
        setTokenBalance(tokenBalanceAmount);
        setStakeInfo(stakeInfoData);
      } catch (error) {
        toast.error("Failed to fetch staking data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchStakingData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStakingData, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const handleStake = async () => {
    if (!address) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (amount > parseFloat(tokenBalance)) {
      toast.error("Insufficient token balance", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await stakeTokens(amount);
      toast.success(`Successfully staked ${amount} NECTR tokens`);
      
      // Refresh data
      const [updatedUserStaked, updatedPendingRewards, updatedTokenBalance, updatedStakeInfo] = await Promise.all([
        getUserStakedAmount(address),
        getPendingRewards(address),
        getTokenBalance(address),
        getStakeInfo(address),
      ]);
      
      setUserStaked(updatedUserStaked);
      setPendingRewards(updatedPendingRewards);
      setTokenBalance(updatedTokenBalance);
      setStakeInfo(updatedStakeInfo);
      setStakeAmount("");
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!address) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const amount = parseFloat(unstakeAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (amount > parseFloat(userStaked)) {
      toast.error("Insufficient staked amount", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await unstakeTokens(amount);
      toast.success(`Successfully unstaked ${amount} NECTR tokens`);
      
      // Refresh data
      const [updatedUserStaked, updatedPendingRewards, updatedTokenBalance, updatedStakeInfo] = await Promise.all([
        getUserStakedAmount(address),
        getPendingRewards(address),
        getTokenBalance(address),
        getStakeInfo(address),
      ]);
      
      setUserStaked(updatedUserStaked);
      setPendingRewards(updatedPendingRewards);
      setTokenBalance(updatedTokenBalance);
      setStakeInfo(updatedStakeInfo);
      setUnstakeAmount("");
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!address) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (parseFloat(pendingRewards) <= 0) {
      toast.error("No rewards to claim", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setClaimLoading(true);
      await claimStakingRewards();
      toast.success(`Successfully claimed ${pendingRewards} NECTR rewards`);
      
      // Refresh data
      const [updatedPendingRewards, updatedTokenBalance] = await Promise.all([
        getPendingRewards(address),
        getTokenBalance(address),
      ]);
      
      setPendingRewards(updatedPendingRewards);
      setTokenBalance(updatedTokenBalance);
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setClaimLoading(false);
    }
  };

  const getStakingDuration = () => {
    if (stakeInfo.timestamp === 0) return "Not staking";
    const duration = Date.now() / 1000 - stakeInfo.timestamp;
    const days = Math.floor(duration / 86400);
    const hours = Math.floor((duration % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            NECTR Token Staking
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stake your NECTR tokens to earn rewards. The longer you stake, the more rewards you earn!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Staking Stats */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Staking Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Staked"
                value={totalStaked}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                bgColor="bg-purple-900/30"
                textColor="text-purple-400"
              />

              <StatCard
                title="Your Staked"
                value={userStaked}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                bgColor="bg-green-900/30"
                textColor="text-green-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <StatCard
                title="Pending Rewards"
                value={pendingRewards}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                bgColor="bg-blue-900/30"
                textColor="text-blue-400"
              />

              <StatCard
                title="Token Balance"
                value={tokenBalance}
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                bgColor="bg-indigo-900/30"
                textColor="text-indigo-400"
              />
            </div>

            {/* Staking Info */}
            {parseFloat(userStaked) > 0 && (
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Your Staking Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Staking Duration</p>
                    <p className="text-lg font-semibold text-white">{getStakingDuration()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Reward Rate</p>
                    <p className="text-lg font-semibold text-white">{stakeInfo.rewardRate}% APY</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Staked Amount</p>
                    <p className="text-lg font-semibold text-white">{formatLargeNumber(userStaked)} NECTR</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Staking Actions */}
          <div className="space-y-6">
            {/* Stake Section */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Stake NECTR
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="stakeAmount"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter amount to stake"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                      NECTR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Available: {formatLargeNumber(tokenBalance)} NECTR
                  </p>
                </div>

                <button
                  onClick={handleStake}
                  disabled={loading || !address || !stakeAmount}
                  className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
                    loading || !address || !stakeAmount
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-purple-700 hover:bg-purple-600 active:bg-purple-800 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  }`}
                >
                  {loading ? "Staking..." : "Stake Tokens"}
                </button>
              </div>
            </div>

            {/* Unstake Section */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Unstake NECTR
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="unstakeAmount" className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Unstake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="unstakeAmount"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter amount to unstake"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                      NECTR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Staked: {formatLargeNumber(userStaked)} NECTR
                  </p>
                </div>

                <button
                  onClick={handleUnstake}
                  disabled={loading || !address || !unstakeAmount}
                  className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
                    loading || !address || !unstakeAmount
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-600 active:bg-red-800 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                  }`}
                >
                  {loading ? "Unstaking..." : "Unstake Tokens"}
                </button>
              </div>
            </div>

            {/* Claim Rewards Section */}
            {parseFloat(pendingRewards) > 0 && (
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Claim Rewards
                </h2>

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">Available Rewards</p>
                    <p className="text-3xl font-bold text-green-400">
                      {formatLargeNumber(pendingRewards)} NECTR
                    </p>
                  </div>

                  <button
                    onClick={handleClaimRewards}
                    disabled={claimLoading || !address}
                    className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
                      claimLoading || !address
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-green-700 hover:bg-green-600 active:bg-green-800 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                    }`}
                  >
                    {claimLoading ? "Claiming..." : "Claim Rewards"}
                  </button>
                </div>
              </div>
            )}

            {!address && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <p className="text-red-400 text-sm text-center">
                  Please connect your wallet to stake tokens
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;
