import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getContractStats, getTotalRewardsDistributed, getStakingStartTime } from "../services/blockchain";

const Hero = () => {
  const [contractStats, setContractStats] = useState({
    totalSupply: "0",
    maxSupply: "0",
    totalStaked: "0",
    totalRewards: "0",
    totalRewardsDistributed: "0",
    stakingStartTime: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [stats, totalRewardsDistributed, stakingStartTime] = await Promise.all([
          getContractStats(),
          getTotalRewardsDistributed(),
          getStakingStartTime()
        ]);
        
        setContractStats({
          ...stats,
          totalRewardsDistributed,
          stakingStartTime
        });
      } catch (error) {
        console.error("Error fetching contract stats:", error);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLargeNumber = (value: string) => {
    const num = parseFloat(value);
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Main Hero Content */}
        <div className="text-center mb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 backdrop-blur-xl mb-8 shadow-2xl"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">🪙</span>
            </div>
            <span className="text-blue-200 text-lg font-semibold">
              NECTR Token Ecosystem
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-tight"
          >
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              NECTR
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of <span className="text-blue-400 font-semibold">decentralized finance</span>. 
            Stake your NECTR tokens to earn up to <span className="text-green-400 font-semibold">15% APY rewards</span> 
            and join the next generation of blockchain innovation.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <button className="group px-12 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <span className="flex items-center">
                <span className="mr-3">🚀</span>
                Start Staking
                <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
            <button className="group px-12 py-5 rounded-2xl border-2 border-blue-500/50 text-white font-bold text-lg transition-all duration-300 hover:bg-blue-900/30 hover:border-blue-400/70 backdrop-blur-xl">
              <span className="flex items-center">
                <span className="mr-3">💰</span>
                Get NECTR Tokens
                <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
        >
          {[
            { 
              value: formatLargeNumber(contractStats.totalSupply), 
              label: "NECTR Supply", 
              icon: "🪙",
              color: "from-blue-500 to-cyan-500",
              bgColor: "from-blue-900/30 to-cyan-900/30",
              borderColor: "border-blue-500/20"
            },
            { 
              value: formatLargeNumber(contractStats.totalStaked), 
              label: "Tokens Staked", 
              icon: "🔒",
              color: "from-emerald-500 to-green-500",
              bgColor: "from-emerald-900/30 to-green-900/30",
              borderColor: "border-emerald-500/20"
            },
            { 
              value: formatLargeNumber(contractStats.totalRewardsDistributed), 
              label: "Rewards Paid", 
              icon: "💰",
              color: "from-purple-500 to-violet-500",
              bgColor: "from-purple-900/30 to-violet-900/30",
              borderColor: "border-purple-500/20"
            },
            { 
              value: "5-15%", 
              label: "APY Range", 
              icon: "📈",
              color: "from-orange-500 to-red-500",
              bgColor: "from-orange-900/30 to-red-900/30",
              borderColor: "border-orange-500/20"
            },
            { 
              value: contractStats.stakingStartTime > 0 ? "Active" : "Inactive", 
              label: "Platform Status", 
              icon: "✅",
              color: "from-green-500 to-emerald-500",
              bgColor: "from-green-900/30 to-emerald-900/30",
              borderColor: "border-green-500/20"
            },
            { 
              value: formatLargeNumber(contractStats.maxSupply), 
              label: "Max Supply", 
              icon: "🎯",
              color: "from-indigo-500 to-purple-500",
              bgColor: "from-indigo-900/30 to-purple-900/30",
              borderColor: "border-indigo-500/20"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-xl rounded-2xl p-6 border ${stat.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </h3>
                <p className="text-gray-300 font-medium text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex justify-center items-center space-x-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-bounce"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full animate-pulse"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;