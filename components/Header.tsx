import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgMenuLeft } from "react-icons/cg";
import { FaTimes, FaWallet, FaUser, FaCog } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { getTokenBalance } from "../services/blockchain";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (address) {
        try {
          const balance = await getTokenBalance(address);
          setTokenBalance(balance);
        } catch (error) {
          console.error("Error fetching token balance:", error);
        }
      }
    };

    fetchTokenBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchTokenBalance, 30000);
    return () => clearInterval(interval);
  }, [address]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "faucet", label: "Get Tokens" },
    { id: "staking", label: "Stake" },
    { id: "tiers", label: "Tiers" },
    { id: "social", label: "Community" },
    { id: "news", label: "News" },
  ];

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(2);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.header
      className={`fixed z-50 top-0 right-0 left-0 transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => scrollToSection("hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🪙</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <motion.span 
                className="text-white font-black text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                NECTR
              </motion.span>
              <div className="text-xs text-cyan-400 font-medium">Token Ecosystem</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-white transition-all duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                <span className="font-medium">{item.label}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </motion.button>
            ))}
            
            {/* Admin Link */}
            <Link
              href="/admin"
              className="group relative px-4 py-2 rounded-xl text-gray-300 hover:text-red-400 transition-all duration-300"
            >
                  <span className="font-medium">Admin</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="group flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">
                      {shortenAddress(address || "")}
                    </div>
                    <div className="text-cyan-400 text-xs">
                      {formatBalance(tokenBalance)} NECTR
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </motion.button>

                {/* Wallet Dropdown Menu */}
                <AnimatePresence>
                  {showWalletMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <FaWallet className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold">Wallet Connected</div>
                            <div className="text-gray-400 text-sm font-mono break-all">
                              {address}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div className="bg-slate-700/50 rounded-xl p-3">
                          <div className="text-gray-400 text-sm mb-1">NECTR Balance</div>
                          <div className="text-white font-bold text-lg">
                            {formatBalance(tokenBalance)} NECTR
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            disconnect();
                            setShowWalletMenu(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300"
                        >
                          <FaTimes className="text-sm" />
                          <span className="font-medium">Disconnect</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:block">
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    mounted,
                  }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <motion.button
                                onClick={openConnectModal}
                                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaWallet className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                                <span>Connect Wallet</span>
                              </motion.button>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <motion.button
                                onClick={openChainModal}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span>Wrong network</span>
                              </motion.button>
                            );
                          }

                          return (
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={openChainModal}
                                className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white text-sm transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 16,
                                      height: 16,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 16, height: 16 }}
                                      />
                                    )}
                                  </div>
                                )}
                                <span>{chain.name}</span>
                              </motion.button>

                              <motion.button
                                onClick={openAccountModal}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaUser className="text-sm" />
                                <span>{account.displayName}</span>
                              </motion.button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-white transition-all duration-300"
              >
                {isOpen ? <FaTimes className="h-6 w-6" /> : <CgMenuLeft className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border-b border-slate-700/50 shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              <Link
                href="/admin"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:text-red-400 hover:bg-slate-800/50 transition-all duration-300"
              >
                <span className="font-medium">Admin</span>
              </Link>

              {!isConnected && (
                <div className="pt-4 border-t border-slate-700/50">
                  <ConnectButton />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;