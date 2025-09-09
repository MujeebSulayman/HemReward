import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <main className="relative w-full px-4 sm:px-6 lg:px-32 pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 relative z-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left lg:max-w-[640px] mx-auto lg:mx-0"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-900/30 border border-purple-700/50 mb-6 sm:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse mr-2"></span>
              <span className="text-purple-200 text-sm">
                NECTR Token Ecosystem
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                NECTR Token
              </span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-[540px] mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Experience the future of decentralized healthcare rewards. Stake your NECTR tokens, 
              earn rewards, and join a vibrant community revolutionizing healthcare through blockchain technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                Get Started Now
              </button>
              <button className="px-8 py-4 rounded-lg border border-purple-700/50 text-white font-semibold hover:bg-purple-900/30 transition-all duration-300">
                Learn More →
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-purple-700/30"
            >
              {[
                { value: "100M", label: "NECTR Tokens" },
                { value: "10%", label: "Staking APY" },
                { value: "1B", label: "Max Supply" },
              ].map((stat, index) => (
                <div key={index} className="text-center px-2">
                  <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Visual */}
          <motion.div
            className="flex-1 relative lg:min-w-[50%]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-[700px] mx-auto">
              {/* Decorative Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4">
                {Array(9)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="border border-purple-700/20 rounded-lg backdrop-blur-sm"
                    />
                  ))}
              </div>

              {/* Main Image */}
              <div className="relative z-10 w-full h-full p-8">
                <Image
                  src="/hero-illustration.svg"
                  alt="Healthcare Rewards Platform"
                  layout="fill"
                  objectFit="contain"
                  priority
                  className="drop-shadow-2xl"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-20 animate-float-slow" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-20 animate-float" />
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
