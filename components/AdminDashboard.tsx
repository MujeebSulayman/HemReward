import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";
import {
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
  getMinStakeAmount,
  getMaxStakeAmount,
  getTierInfo,
  isPaused,
  getContractStats,
} from "../services/blockchain";
import { reportError } from "../utils/web3.utils";

const AdminDashboard: React.FC = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isBlacklistedUser, setIsBlacklistedUser] = useState<boolean>(false);
  const [contractStats, setContractStats] = useState<any>(null);
  const [tierInfo, setTierInfo] = useState<any[]>([]);
  const [isPausedStatus, setIsPausedStatus] = useState<boolean>(false);
  const [minStake, setMinStake] = useState<string>("0");
  const [maxStake, setMaxStake] = useState<string>("0");

  // Form states
  const [minterAddress, setMinterAddress] = useState<string>("");
  const [blacklistAddress, setBlacklistAddress] = useState<string>("");
  const [newMinStake, setNewMinStake] = useState<string>("");
  const [newMaxStake, setNewMaxStake] = useState<string>("");
  const [emergencyAmount, setEmergencyAmount] = useState<string>("");
  const [tierApyUpdates, setTierApyUpdates] = useState<{[key: number]: string}>({});

  useEffect(() => {
    if (address) {
      fetchAdminData();
    }
  }, [address]);

  const fetchAdminData = async () => {
    if (!address) return;

    try {
      const [
        authorized,
        blacklisted,
        stats,
        paused,
        minStakeAmount,
        maxStakeAmount,
        bronzeTier,
        silverTier,
        goldTier,
        platinumTier
      ] = await Promise.all([
        isAuthorizedMinter(address),
        isBlacklisted(address),
        getContractStats(),
        isPaused(),
        getMinStakeAmount(),
        getMaxStakeAmount(),
        getTierInfo(0), // Bronze
        getTierInfo(1), // Silver
        getTierInfo(2), // Gold
        getTierInfo(3), // Platinum
      ]);

      setIsAuthorized(authorized);
      setIsBlacklistedUser(blacklisted);
      setContractStats(stats);
      setIsPausedStatus(paused);
      setMinStake(minStakeAmount);
      setMaxStake(maxStakeAmount);
      setTierInfo([bronzeTier, silverTier, goldTier, platinumTier]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleAddMinter = async () => {
    if (!minterAddress) {
      toast.error("Please enter a valid address");
      return;
    }

    setLoading(true);
    try {
      await addAuthorizedMinter(minterAddress);
      toast.success("Authorized minter added successfully!");
      setMinterAddress("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMinter = async () => {
    if (!minterAddress) {
      toast.error("Please enter a valid address");
      return;
    }

    setLoading(true);
    try {
      await removeAuthorizedMinter(minterAddress);
      toast.success("Authorized minter removed successfully!");
      setMinterAddress("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseStaking = async () => {
    setLoading(true);
    try {
      await pauseStaking();
      toast.success("Staking paused successfully!");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUnpauseStaking = async () => {
    setLoading(true);
    try {
      await unpauseStaking();
      toast.success("Staking unpaused successfully!");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMinStake = async () => {
    if (!newMinStake) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await setMinStakeAmount(parseFloat(newMinStake));
      toast.success("Minimum stake amount updated successfully!");
      setNewMinStake("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaxStake = async () => {
    if (!newMaxStake) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await setMaxStakeAmount(parseFloat(newMaxStake));
      toast.success("Maximum stake amount updated successfully!");
      setNewMaxStake("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTierApy = async (tier: number) => {
    const newApy = tierApyUpdates[tier];
    if (!newApy) {
      toast.error("Please enter a valid APY rate");
      return;
    }

    setLoading(true);
    try {
      await updateTierApy(tier, parseInt(newApy));
      toast.success(`Tier ${tier} APY updated successfully!`);
      setTierApyUpdates(prev => ({ ...prev, [tier]: "" }));
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBlacklist = async (isBlacklisted: boolean) => {
    if (!blacklistAddress) {
      toast.error("Please enter a valid address");
      return;
    }

    setLoading(true);
    try {
      await setBlacklist(blacklistAddress, isBlacklisted);
      toast.success(`Address ${isBlacklisted ? 'blacklisted' : 'unblacklisted'} successfully!`);
      setBlacklistAddress("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyWithdraw = async () => {
    if (!emergencyAmount) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await emergencyWithdraw(parseFloat(emergencyAmount));
      toast.success("Emergency withdrawal completed successfully!");
      setEmergencyAmount("");
      await fetchAdminData();
    } catch (error: any) {
      const errorMessage = reportError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tierNames = ["Bronze", "Silver", "Gold", "Platinum"];
  const tierColors = [
    "from-orange-500 to-amber-500",
    "from-gray-400 to-gray-600", 
    "from-yellow-500 to-yellow-600",
    "from-purple-500 to-indigo-500"
  ];

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-300 mb-3">Connect Your Wallet</h2>
          <p className="text-lg text-gray-300">Connect your wallet to access admin functions</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-red-300 mb-3">Access Denied</h2>
          <p className="text-lg text-gray-300">You are not authorized to access admin functions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden pt-20">
      <ToastContainer theme="dark" />
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">DASHBOARD</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Manage the <span className="text-red-400 font-semibold">NECTR ecosystem</span> with full administrative control
          </p>
        </div>

        {/* Contract Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-blue-400 mb-1">
                {contractStats ? (parseFloat(contractStats.totalSupply) / 1e18 / 1e6).toFixed(1) + "M" : "0"}
              </h3>
              <p className="text-gray-300 font-medium text-sm">Total Supply</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-1">
                {contractStats ? (parseFloat(contractStats.totalStaked) / 1e18 / 1e6).toFixed(1) + "M" : "0"}
              </h3>
              <p className="text-gray-300 font-medium text-sm">Total Staked</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-400 mb-1">
                {contractStats ? (parseFloat(contractStats.totalRewards) / 1e18 / 1e6).toFixed(1) + "M" : "0"}
              </h3>
              <p className="text-gray-300 font-medium text-sm">Rewards Distributed</p>
            </div>
          </div>

          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-xl ${
            isPausedStatus 
              ? 'bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/20' 
              : 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/20'
          }`}>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                isPausedStatus 
                  ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-500'
              }`}>
                <span className="text-xl">{isPausedStatus ? '⏸️' : '▶️'}</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${
                isPausedStatus ? 'text-red-400' : 'text-green-400'
              }`}>
                {isPausedStatus ? 'Paused' : 'Active'}
              </h3>
              <p className="text-gray-300 font-medium text-sm">Staking Status</p>
            </div>
          </div>
        </div>

        {/* Admin Functions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Staking Control */}
          <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Staking Control
            </h2>
            
            <div className="space-y-6">
              <div className="flex space-x-4">
                <button
                  onClick={handlePauseStaking}
                  disabled={loading || isPausedStatus}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                    loading || isPausedStatus
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transform hover:scale-105"
                  }`}
                >
                  Pause Staking
                </button>
                <button
                  onClick={handleUnpauseStaking}
                  disabled={loading || !isPausedStatus}
                  className={`flex-1 py-3 rounded-xl text-white font-bold transition-all duration-300 ${
                    loading || !isPausedStatus
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105"
                  }`}
                >
                  Unpause Staking
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Stake Amount
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newMinStake}
                      onChange={(e) => setNewMinStake(e.target.value)}
                      placeholder={minStake}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                    />
                    <button
                      onClick={handleSetMinStake}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Stake Amount
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newMaxStake}
                      onChange={(e) => setNewMaxStake(e.target.value)}
                      placeholder={maxStake}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                    />
                    <button
                      onClick={handleSetMaxStake}
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minter Management */}
          <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">👥</span>
              Minter Management
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={minterAddress}
                  onChange={(e) => setMinterAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddMinter}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-white font-bold transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105"
                >
                  Add Minter
                </button>
                <button
                  onClick={handleRemoveMinter}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl text-white font-bold transition-all duration-300 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transform hover:scale-105"
                >
                  Remove Minter
                </button>
              </div>
            </div>
          </div>

          {/* Tier Management */}
          <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🏆</span>
              Tier Management
            </h2>
            
            <div className="space-y-4">
              {tierInfo.map((tier, index) => (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${tierColors[index]} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-white font-semibold">{tierNames[index]}</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {(tier.apyRate / 100).toFixed(1)}% APY
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={tierApyUpdates[index] || ""}
                      onChange={(e) => setTierApyUpdates(prev => ({ ...prev, [index]: e.target.value }))}
                      placeholder="New APY (basis points)"
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleUpdateTierApy(index)}
                      disabled={loading}
                      className="px-4 py-2 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Emergency */}
          <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🔒</span>
              Security & Emergency
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blacklist Address
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={blacklistAddress}
                    onChange={(e) => setBlacklistAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                  />
                  <button
                    onClick={() => handleSetBlacklist(true)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Blacklist
                  </button>
                  <button
                    onClick={() => handleSetBlacklist(false)}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 rounded-lg text-white font-semibold hover:bg-green-700 transition-colors"
                  >
                    Unblacklist
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emergency Withdraw Amount
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={emergencyAmount}
                    onChange={(e) => setEmergencyAmount(e.target.value)}
                    placeholder="Amount in NECTR"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400"
                  />
                  <button
                    onClick={handleEmergencyWithdraw}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;