import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  mintTokens,
  getMaxSupply,
  getTotalMinted,
  getClaimedRewards,
  isAuthorizedMinter,
} from "../services/blockchain";
import {
  formatTokenAmount,
  reportError,
  validateTokenAmount,
  calculatePercentage,
  formatPercentage,
} from "../utils/web3.utils";
import { useAccount } from "wagmi";

const formatLargeNumber = (value: string) => {
  const num = parseFloat(value);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
};

const TokenMint: React.FC = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("100");
  const [maxSupply, setMaxSupply] = useState<string>("0");
  const [totalMinted, setTotalMinted] = useState<string>("0");
  const [claimedRewards, setClaimedRewards] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const fetchSupplyData = async () => {
      try {
        const [max, minted, claimed, authorized] = await Promise.all([
          getMaxSupply(),
          getTotalMinted(),
          address ? getClaimedRewards(address) : "0",
          address ? isAuthorizedMinter(address) : false,
        ]);

        setMaxSupply(max);
        setTotalMinted(minted);
        setClaimedRewards(claimed);
        setIsAuthorized(authorized);
      } catch (error) {
        toast.error("Failed to fetch supply data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchSupplyData();
  }, [address]);

  const handleMint = async () => {
    if (!address) {
      toast.error("Please connect your wallet", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const parsedAmount = amount
        ? parseFloat(amount.replace(/,/g, "").replace(" NECTR", ""))
        : 100;

      await mintTokens(parsedAmount);

      toast.success(`Successfully minted ${parsedAmount} tokens`);

      const [updatedMinted, updatedClaimed] = await Promise.all([
        getTotalMinted(),
        getClaimedRewards(address)
      ]);

      setTotalMinted(updatedMinted);
      setClaimedRewards(updatedClaimed);
      setAmount("100");
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

  const mintPercentage = calculatePercentage(totalMinted, maxSupply);

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-amber-300 mb-3">Connect Your Wallet</h2>
          <p className="text-lg text-gray-300">Connect your wallet to access token minting</p>
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
          <p className="text-lg text-gray-300">You are not authorized to mint tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden pt-20">
      <ToastContainer theme="dark" />
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            TOKEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">MINTING</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create new <span className="text-amber-400 font-semibold">NECTR tokens</span> to expand the ecosystem
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-400 mb-1">{formatLargeNumber(maxSupply)}</h3>
                <p className="text-gray-300 font-medium text-sm">Max Supply</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🏭</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-1">{formatLargeNumber(totalMinted)}</h3>
                <p className="text-gray-300 font-medium text-sm">Total Minted</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📈</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-1">{formatPercentage(mintPercentage)}</h3>
                <p className="text-gray-300 font-medium text-sm">Minted %</p>
                <p className="text-xs text-gray-400 mt-1">Of Max Supply</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">💰</span>
                </div>
                <h3 className="text-2xl font-bold text-orange-400 mb-1">{formatLargeNumber(claimedRewards)}</h3>
                <p className="text-gray-300 font-medium text-sm">Claimed Rewards</p>
                <p className="text-xs text-gray-400 mt-1">NECTR Tokens</p>
              </div>
            </div>
          </div>

          {/* Minting Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl h-full">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Mint NECTR Tokens</h2>
                <p className="text-gray-400 text-sm">Create new tokens for the ecosystem</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Mint
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const inputVal = e.target.value;
                        if (/^[\d,]*\.?\d* ?NECTR?$/.test(inputVal)) {
                          setAmount(inputVal);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter token amount"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                      NECTR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Default amount is 100 NECTR
                  </p>
                </div>

                <button
                  onClick={handleMint}
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Minting...</span>
                    </div>
                  ) : (
                    "Mint Tokens"
                  )}
                </button>

                <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-amber-300 font-semibold text-sm">Authorized Minter</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    You have permission to mint new NECTR tokens
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMint;