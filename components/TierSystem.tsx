import React, { useState, useEffect } from "react";
import { getTierInfo, getUserTier, getUserStakedAmount } from "../services/blockchain";
import { useAccount } from "wagmi";

const TierSystem: React.FC = () => {
  const { address } = useAccount();
  const [tierInfo, setTierInfo] = useState<any[]>([]);
  const [userTier, setUserTier] = useState<number>(0);
  const [userStaked, setUserStaked] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTierData();
  }, [address]);

  const fetchTierData = async () => {
    if (!address) {
      setLoading(false);
      return;
    }

    try {
      const [bronze, silver, gold, platinum, currentTier, stakedAmount] = await Promise.all([
        getTierInfo(0), // Bronze
        getTierInfo(1), // Silver
        getTierInfo(2), // Gold
        getTierInfo(3), // Platinum
        getUserTier(address),
        getUserStakedAmount(address)
      ]);

      setTierInfo([bronze, silver, gold, platinum]);
      setUserTier(currentTier);
      setUserStaked(stakedAmount);
    } catch (error) {
      console.error("Error fetching tier data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tierNames = ["Bronze", "Silver", "Gold", "Platinum"];
  const tierColors = [
    {
      bg: "from-orange-900/30 to-amber-900/30",
      border: "border-orange-500/20",
      icon: "from-orange-500 to-amber-500",
      text: "text-orange-400",
      emoji: "🥉"
    },
    {
      bg: "from-gray-900/30 to-slate-900/30",
      border: "border-gray-500/20",
      icon: "from-gray-400 to-gray-600",
      text: "text-gray-400",
      emoji: "🥈"
    },
    {
      bg: "from-yellow-900/30 to-amber-900/30",
      border: "border-yellow-500/20",
      icon: "from-yellow-500 to-yellow-600",
      text: "text-yellow-400",
      emoji: "🥇"
    },
    {
      bg: "from-purple-900/30 to-indigo-900/30",
      border: "border-purple-500/20",
      icon: "from-purple-500 to-indigo-500",
      text: "text-purple-400",
      emoji: "💎"
    }
  ];

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount) / 1e18;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getNextTierInfo = () => {
    if (userTier >= 3) return null; // Already at highest tier
    const nextTier = tierInfo[userTier + 1];
    const currentStaked = parseFloat(userStaked) / 1e18;
    const requiredStake = parseFloat(nextTier?.minAmount || "0") / 1e18;
    const remaining = requiredStake - currentStaked;
    
    return {
      tier: userTier + 1,
      name: tierNames[userTier + 1],
      required: requiredStake,
      remaining: Math.max(0, remaining),
      apy: (nextTier?.apyRate || 0) / 100
    };
  };

  const nextTier = getNextTierInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading tier information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            STAKING <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">TIERS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Unlock higher rewards with our <span className="text-purple-400 font-semibold">multi-tier staking system</span>
          </p>
        </div>

        {/* Current Status */}
        {address && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tierColors[userTier].icon} rounded-2xl flex items-center justify-center`}>
                    <span className="text-2xl">{tierColors[userTier].emoji}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Current Tier</h2>
                    <p className={`text-2xl font-bold ${tierColors[userTier].text}`}>{tierNames[userTier]}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Staked Amount</p>
                    <p className="text-2xl font-bold text-white">{formatAmount(userStaked)} NECTR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Current APY</p>
                    <p className="text-2xl font-bold text-green-400">{(tierInfo[userTier]?.apyRate || 0) / 100}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Annual Rewards</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {((parseFloat(userStaked) / 1e18) * (tierInfo[userTier]?.apyRate || 0) / 10000).toFixed(0)} NECTR
                    </p>
                  </div>
                </div>

                {nextTier && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-xl border border-purple-500/20">
                    <h3 className="text-xl font-bold text-purple-300 mb-4">Upgrade to {nextTier.name} Tier</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-400 text-sm">Required Stake</p>
                        <p className="text-lg font-bold text-white">{nextTier.required.toFixed(0)} NECTR</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Remaining</p>
                        <p className="text-lg font-bold text-orange-400">{nextTier.remaining.toFixed(0)} NECTR</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">New APY</p>
                        <p className="text-lg font-bold text-green-400">{nextTier.apy.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, ((parseFloat(userStaked) / 1e18) / nextTier.required) * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {((parseFloat(userStaked) / 1e18) / nextTier.required * 100).toFixed(1)}% to next tier
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tierInfo.map((tier, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${tierColors[index].bg} backdrop-blur-xl rounded-2xl p-6 border ${tierColors[index].border} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${
                userTier === index ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${tierColors[index].icon} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{tierColors[index].emoji}</span>
                </div>
                
                <h3 className={`text-2xl font-bold ${tierColors[index].text} mb-2`}>
                  {tierNames[index]}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">APY Rate</p>
                    <p className="text-3xl font-bold text-green-400">{(tier.apyRate / 100).toFixed(1)}%</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Min Stake</p>
                    <p className="text-lg font-semibold text-white">{formatAmount(tier.minAmount)} NECTR</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Max Stake</p>
                    <p className="text-lg font-semibold text-white">
                      {tier.maxAmount === "115792089237316195423570985008687907853269984665640564039457584007913129639935" 
                        ? "Unlimited" 
                        : formatAmount(tier.maxAmount) + " NECTR"
                      }
                    </p>
                  </div>
                </div>

                {userTier === index && (
                  <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 font-semibold text-sm">Current Tier</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Tier Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Higher APY</h3>
                <p className="text-gray-300">Earn up to 15% APY with higher tier stakes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Priority Access</h3>
                <p className="text-gray-300">Get early access to new features and rewards</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Exclusive Rewards</h3>
                <p className="text-gray-300">Access to special rewards and governance rights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierSystem;
