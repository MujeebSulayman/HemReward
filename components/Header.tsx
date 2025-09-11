import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CgMenuLeft } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getTokenBalance } from "../services/blockchain";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const { address, isConnected } = useAccount();

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

  return (
    <motion.header
      className={`fixed z-50 top-0 right-0 left-0 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-2xl border-b border-slate-700/50"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <button 
              onClick={() => scrollToSection("hero")}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center animate-token-glow"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-lg">🪙</span>
              </motion.div>
              <div>
                <motion.span 
                  className="text-white font-bold text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  NECTR
                </motion.span>
                <div className="text-xs text-blue-400">Token Ecosystem</div>
              </div>
            </button>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open menu</span>
              <CgMenuLeft className="h-6 w-6" aria-hidden="true" />
            </motion.button>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-white font-semibold text-base">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:text-blue-400 transition-colors font-inter cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/admin"
              className="hover:text-red-400 transition-colors font-inter"
            >
              Admin
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {isConnected && (
              <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg px-4 py-2">
                <div className="text-sm text-purple-300">NECTR Balance</div>
                <div className="text-lg font-bold text-white">
                  {parseFloat(tokenBalance).toFixed(2)} NECTR
                </div>
              </div>
            )}
            <ConnectButton
              showBalance={false}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-20 bg-slate-900 divide-y-2 divide-gray-800">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <button 
                      onClick={() => scrollToSection("hero")}
                      className="text-lg font-normal text-white cursor-pointer"
                    >
                      NECTR
                    </button>
                  </div>
                  <div className="-mr-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(!isOpen)}
                      className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                    >
                      <span className="sr-only">Close menu</span>
                      <FaTimes className="h-6 w-6" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-base font-medium text-gray-200 hover:text-white cursor-pointer text-left"
                      >
                        {item.label}
                      </button>
                    ))}
                    <Link
                      href="/admin"
                      className="text-base font-medium text-gray-200 hover:text-red-400 text-left"
                    >
                      Admin
                    </Link>
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <ConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;