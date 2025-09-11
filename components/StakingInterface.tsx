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
  getRewardCalculation,
  getStakeInfo,
  getTokenBalance,
  getMinStakeAmount,
  getMaxStakeAmount,
  getTotalRewardsDistributed,
  isPaused as getIsPaused,
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

const StakingInterface: React.FC = () => {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [unstakeAmount, setUnstakeAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [userStaked, setUserStaked] = useState<string>("0");
  const [pendingRewards, setPendingRewards] = useState<string>("0");
  const [totalStaked, setTotalStaked] = useState<string>("0");
  const [totalRewardsDistributed, setTotalRewardsDistributed] = useState<string>("0");
  const [minStakeAmount, setMinStakeAmount] = useState<string>("0");
  const [maxStakeAmount, setMaxStakeAmount] = useState<string>("0");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [rewardCalculation, setRewardCalculation] = useState<any>(null);
  const [transactionStatus, setTransactionStatus] = useState<{
    status: string;
    message: string;
  }>({ status: "", message: "" });

  const fetchData = async () => {
    if (!address) return;

    try {
      const [
        balance,
        staked,
        rewards,
        totalStakedAmount,
        totalRewards,
        minStake,
        maxStake,
        paused,
        calculation
      ] = await Promise.all([
        getTokenBalance(address),
        getUserStakedAmount(address),
        getPendingRewards(address),
        getTotalStaked(),
        getTotalRewardsDistributed(),
        getMinStakeAmount(),
        getMaxStakeAmount(),
        getIsPaused(),
        getRewardCalculation(address)
      ]);

      setTokenBalance(balance);
      setUserStaked(staked);
      setPendingRewards(rewards);
      setTotalStaked(totalStakedAmount);
      setTotalRewardsDistributed(totalRewards);
      setMinStakeAmount(minStake);
      setMaxStakeAmount(maxStake);
      setIsPaused(paused);
      setRewardCalculation(calculation);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [address]);

  const handleStake = async () => {
    if (!address || !stakeAmount) return;

    setLoading(true);
    setTransactionStatus({ status: "pending", message: "Staking tokens..." });

    try {
      if (!validateTokenAmount(stakeAmount)) {
        toast.error("Invalid amount");
        return;
      }
      const amount = parseFloat(stakeAmount);

      if (parseFloat(stakeAmount) < parseFloat(minStakeAmount)) {
        toast.error(`Minimum stake amount is ${minStakeAmount} NECTR`);
        return;
      }

      if (parseFloat(stakeAmount) > parseFloat(maxStakeAmount)) {
        toast.error(`Maximum stake amount is ${maxStakeAmount} NECTR`);
        return;
      }

      if (isPaused) {
        toast.error("Staking is currently paused");
        return;
      }

      await stakeTokens(amount);
      setTransactionStatus({ status: "success", message: "Tokens staked successfully!" });
      toast.success("Tokens staked successfully!");
      setStakeAmount("");
      await fetchData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      setTransactionStatus({ status: "error", message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!address || !unstakeAmount) return;

    setLoading(true);
    setTransactionStatus({ status: "pending", message: "Unstaking tokens..." });

    try {
      if (!validateTokenAmount(unstakeAmount)) {
        toast.error("Invalid amount");
        return;
      }
      const amount = parseFloat(unstakeAmount);

      await unstakeTokens(amount);
      setTransactionStatus({ status: "success", message: "Tokens unstaked successfully!" });
      toast.success("Tokens unstaked successfully!");
      setUnstakeAmount("");
      await fetchData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      setTransactionStatus({ status: "error", message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!address) return;

    setClaimLoading(true);
    setTransactionStatus({ status: "pending", message: "Claiming rewards..." });

    try {
      await claimStakingRewards();
      setTransactionStatus({ status: "success", message: "Rewards claimed successfully!" });
      toast.success("Rewards claimed successfully!");
      await fetchData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      setTransactionStatus({ status: "error", message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden pt-20">
      <ToastContainer theme="dark" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            NECTR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">STAKING</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Lock your <span className="text-blue-400 font-semibold">NECTR tokens</span> and earn up to <span className="text-green-400 font-semibold">15% APY</span> rewards
          </p>
          
          {/* Staking Status */}
          <div className={`mt-8 inline-flex items-center px-6 py-3 rounded-full border ${
            isPaused 
              ? 'bg-red-900/30 border-red-700/50 text-red-300' 
              : 'bg-green-900/30 border-green-700/50 text-green-300'
          }`}>
            <div className={`w-3 h-3 rounded-full mr-3 ${isPaused ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
            <span className="text-base font-medium">
              Staking is {isPaused ? 'Paused' : 'Active'}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column - Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Total Staked Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="text-3xl font-bold text-blue-400 mb-1">{formatLargeNumber(totalStaked)}</h3>
                <p className="text-gray-300 font-medium text-sm">Total Staked</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>

            {/* Your Staked Card */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">💰</span>
                </div>
                <h3 className="text-3xl font-bold text-emerald-400 mb-1">{formatLargeNumber(userStaked)}</h3>
                <p className="text-gray-300 font-medium text-sm">Your Staked</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>

            {/* Pending Rewards Card */}
            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎁</span>
                </div>
                <h3 className="text-3xl font-bold text-purple-400 mb-1">{formatLargeNumber(pendingRewards)}</h3>
                <p className="text-gray-300 font-medium text-sm">Pending Rewards</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>
          </div>

          {/* Main Action Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/30 shadow-2xl h-full">
              
              {!address ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-amber-300 mb-3">Connect Your Wallet</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Connect your Web3 wallet to start staking NECTR tokens
                  </p>
                  <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-semibold text-lg">
                    <span className="mr-2">🔗</span>
                    Connect Wallet
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Staking Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stake Section */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-700/30">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">⬆️</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Stake NECTR</h3>
                        <p className="text-gray-400 text-sm">Lock tokens to earn rewards</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Amount to Stake
                          </label>
                          <input
                            type="text"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Available: {formatLargeNumber(tokenBalance)} NECTR
                          </p>
                        </div>

                        <button
                          onClick={handleStake}
                          disabled={loading || !address || !stakeAmount || isPaused}
                          className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                            loading || !address || !stakeAmount || isPaused
                              ? "bg-gray-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Staking...</span>
                            </div>
                          ) : (
                            "Stake Tokens"
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Unstake Section */}
                    <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-2xl p-6 border border-red-700/30">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">⬇️</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Unstake NECTR</h3>
                        <p className="text-gray-400 text-sm">Withdraw your staked tokens</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Amount to Unstake
                          </label>
                          <input
                            type="text"
                            value={unstakeAmount}
                            onChange={(e) => setUnstakeAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <p className="text-xs text-gray-400 mt-2">
                            Staked: {formatLargeNumber(userStaked)} NECTR
                          </p>
                        </div>

                        <button
                          onClick={handleUnstake}
                          disabled={loading || !address || !unstakeAmount}
                          className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                            loading || !address || !unstakeAmount
                              ? "bg-gray-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Unstaking...</span>
                            </div>
                          ) : (
                            "Unstake Tokens"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Claim Rewards Section */}
                  {parseFloat(pendingRewards) > 0 && (
                    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-700/30">
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">💰</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Claim Rewards</h3>
                        <p className="text-gray-400 text-sm">Collect your earned rewards</p>
                      </div>

                      <div className="text-center">
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Available Rewards</p>
                          <p className="text-3xl font-bold text-green-400">
                            {formatLargeNumber(pendingRewards)} NECTR
                          </p>
                        </div>

                        <button
                          onClick={handleClaimRewards}
                          disabled={claimLoading || !address}
                          className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                            claimLoading || !address
                              ? "bg-gray-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                          }`}
                        >
                          {claimLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Claiming...</span>
                            </div>
                          ) : (
                            "Claim Rewards"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Transaction Status */}
                  {transactionStatus.status && (
                    <div className={`p-4 rounded-xl border ${
                      transactionStatus.status === 'pending' ? 'bg-yellow-900/30 border-yellow-700/50' :
                      transactionStatus.status === 'success' ? 'bg-green-900/30 border-green-700/50' :
                      'bg-red-900/30 border-red-700/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          transactionStatus.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                          transactionStatus.status === 'success' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className={`font-medium ${
                          transactionStatus.status === 'pending' ? 'text-yellow-300' :
                          transactionStatus.status === 'success' ? 'text-green-300' :
                          'text-red-300'
                        }`}>
                          {transactionStatus.message}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;