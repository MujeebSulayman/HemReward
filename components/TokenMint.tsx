import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  mintTokens,
  getMaxSupply,
  getTotalMinted,
  getClaimedRewards,
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
    className={`p-6 rounded-2xl ${bgColor} flex items-center space-x-4 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/10`}
  >
    <div className={`p-4 rounded-xl ${textColor} bg-opacity-20`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-300 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white" title={value}>
        {formatLargeNumber(value)}
      </p>
    </div>
  </div>
);

const TokenMint: React.FC = () => {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("100");
  const [maxSupply, setMaxSupply] = useState<string>("0");
  const [totalMinted, setTotalMinted] = useState<string>("0");
  const [claimedRewards, setClaimedRewards] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSupplyData = async () => {
      try {
        const [max, minted, claimed] = await Promise.all([
          getMaxSupply(),
          getTotalMinted(),
          address ? getClaimedRewards(address) : "0",
        ]);

        setMaxSupply(max);
        setTotalMinted(minted);
        setClaimedRewards(claimed);
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

  return (
    <div className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black px-4 sm:px-6 lg:px-8">
      <ToastContainer theme="dark" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 animate-token-glow">
            <span className="text-3xl">🏭</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">
            NECTR Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Minting</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Mint new NECTR tokens to expand the ecosystem. This feature is available only to 
            <span className="text-blue-400 font-semibold"> contract owners and authorized minters</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Token Stats */}
          <div className="lg:col-span-2 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Max Supply"
                value={maxSupply}
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                }
                bgColor="bg-purple-900/30"
                textColor="text-purple-400"
              />

              <StatCard
                title="Total Minted"
                value={totalMinted}
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                bgColor="bg-green-900/30"
                textColor="text-green-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <StatCard
                title="Minted Percentage"
                value={formatPercentage(mintPercentage)}
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                bgColor="bg-blue-900/30"
                textColor="text-blue-400"
              />

              {address && (
                <StatCard
                  title="Claimed Rewards"
                  value={claimedRewards}
                  icon={
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                  bgColor="bg-indigo-900/30"
                  textColor="text-indigo-400"
                />
              )}
            </div>
          </div>

          {/* Right Column - Minting Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl p-8 border border-blue-700/30 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                  <span className="text-2xl">🏭</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Mint NECTR Tokens
                </h2>
                <p className="text-gray-400">Create new tokens for the ecosystem</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Amount to Mint (Default: 100 NECTR)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={(e) => {
                        const inputVal = e.target.value;
                        if (/^[\d,]*\.?\d* ?NECTR?$/.test(inputVal)) {
                          setAmount(inputVal);
                        }
                      }}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="Enter token amount (default 100)"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                      NECTR
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Default mint amount is 100 NECTR. Leave blank to use default.
                  </p>
                </div>

                <button
                  onClick={handleMint}
                  disabled={loading || !address}
                  className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                    loading || !address
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/25"
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

                {!address && (
                  <p className="text-red-400 text-sm text-center mt-4">
                    Please connect your wallet to mint tokens
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMint;
