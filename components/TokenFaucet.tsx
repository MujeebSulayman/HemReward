import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { claimFaucetTokens } from "../services/blockchain";
import { useAccount } from "wagmi";

const TokenFaucet: React.FC = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [lastClaim, setLastClaim] = useState<number>(0);
  const [claimCount, setClaimCount] = useState<number>(0);

  const FAUCET_AMOUNT = 1000;
  const MAX_CLAIMS = 3;
  const COOLDOWN_HOURS = 24;

  const canClaim = () => {
    if (claimCount >= MAX_CLAIMS) return false;
    const now = Date.now();
    const timeSinceLastClaim = now - lastClaim;
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
    return timeSinceLastClaim >= cooldownMs;
  };

  const getTimeUntilNextClaim = () => {
    if (canClaim()) return "0h 0m";
    const now = Date.now();
    const timeSinceLastClaim = now - lastClaim;
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
    const remainingMs = cooldownMs - timeSinceLastClaim;
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleClaimTokens = async () => {
    if (!address || !canClaim()) return;

    setLoading(true);
    try {
      await claimFaucetTokens();
      
      const now = Date.now();
      setLastClaim(now);
      setClaimCount(prev => prev + 1);
      
      localStorage.setItem(`faucet_${address}`, JSON.stringify({
        lastClaim: now,
        claimCount: claimCount + 1
      }));

      toast.success(`Successfully claimed ${FAUCET_AMOUNT} NECTR tokens!`, {
        position: "top-right",
        autoClose: 5000,
      });
    } catch (error: any) {
      console.error("Error claiming tokens:", error);
      toast.error("Failed to claim tokens. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`faucet_${address}`);
      if (stored) {
        const data = JSON.parse(stored);
        setLastClaim(data.lastClaim || 0);
        setClaimCount(data.claimCount || 0);
      }
    }
  }, [address]);

  // Update cooldown timer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update cooldown display
      setLastClaim(prev => prev);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const timeUntilNext = getTimeUntilNextClaim();
  const canClaimNow = canClaim();

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
            NECTR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">FAUCET</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get your hands on <span className="text-blue-400 font-semibold">free NECTR tokens</span> and dive into the future of decentralized finance
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          
          {/* Stats Cards - Matching Height */}
          <div className="lg:col-span-1 space-y-4">
            {/* Token Amount Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🪙</span>
                </div>
                <h3 className="text-3xl font-bold text-blue-400 mb-1">{FAUCET_AMOUNT}</h3>
                <p className="text-gray-300 font-medium text-sm">NECTR Tokens</p>
                <p className="text-xs text-gray-400 mt-1">Per Claim</p>
              </div>
            </div>

            {/* Claims Remaining Card */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="text-3xl font-bold text-emerald-400 mb-1">{MAX_CLAIMS - claimCount}</h3>
                <p className="text-gray-300 font-medium text-sm">Claims Left</p>
                <p className="text-xs text-gray-400 mt-1">Out of {MAX_CLAIMS} total</p>
              </div>
            </div>

            {/* Cooldown Card */}
            <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-xl h-48 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⏰</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-400 mb-1">
                  {canClaimNow ? "Ready" : timeUntilNext}
                </h3>
                <p className="text-gray-300 font-medium text-sm">
                  {canClaimNow ? "Can Claim Now" : "Time Remaining"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Next claim</p>
              </div>
            </div>
          </div>

          {/* Main Action Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-12 border border-slate-600/30 shadow-2xl h-full flex items-center">
              
              {!address ? (
                <div className="text-center w-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-amber-300 mb-3">Connect Your Wallet</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Connect your Web3 wallet to start claiming free NECTR tokens
                  </p>
                  <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-semibold text-lg">
                    <span className="mr-2">🔗</span>
                    Connect Wallet
                  </div>
                </div>
              ) : canClaimNow ? (
                <div className="text-center w-full">
                  <div className="mb-8">
                    <h2 className="text-4xl font-black text-white mb-3">Ready to Claim!</h2>
                    <p className="text-lg text-gray-300">Get your free NECTR tokens now</p>
                  </div>
                  
                  <button
                    onClick={handleClaimTokens}
                    disabled={loading}
                    className={`group relative inline-flex items-center px-12 py-6 rounded-2xl text-white font-black text-2xl transition-all duration-300 transform hover:scale-105 ${
                      loading
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 shadow-2xl hover:shadow-blue-500/30"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-3">
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Claiming...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-black">CLAIM {FAUCET_AMOUNT} NECTR</div>
                            <div className="text-sm opacity-80">Click to receive tokens instantly</div>
                          </div>
                        </>
                      )}
                    </div>
                  </button>

                  <div className="mt-8 flex justify-center space-x-8">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">Instant</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">Free</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-400">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">Stake Ready</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      {claimCount >= MAX_CLAIMS ? (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                      ) : (
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                      )}
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-red-300 mb-3">
                    {claimCount >= MAX_CLAIMS ? "All Claims Used" : "Cooldown Active"}
                  </h2>
                  <p className="text-lg text-gray-300 mb-6">
                    {claimCount >= MAX_CLAIMS 
                      ? "You've used all available claims for this wallet"
                      : `Next claim available in ${timeUntilNext}`
                    }
                  </p>
                  <div className="inline-flex items-center px-8 py-4 bg-gray-700 rounded-2xl text-gray-400 font-semibold text-lg cursor-not-allowed">
                    <span className="mr-2">⏳</span>
                    {claimCount >= MAX_CLAIMS ? "No Claims Left" : "Wait for Cooldown"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TokenFaucet;