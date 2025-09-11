import React, { useEffect } from "react";
import { motion } from "framer-motion";

const SocialFeed: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tight">
            COMMUNITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">SOCIAL</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect with the <span className="text-blue-400 font-semibold">NECTR community</span> and stay updated
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Twitter Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                Twitter Feed
              </h2>
              
              <div className="flex justify-center">
                <a
                  className="twitter-timeline"
                  data-height="600"
                  data-theme="dark"
                  data-chrome="noheader nofooter noborders"
                  data-tweet-limit="5"
                  href="https://twitter.com/search?q=NECTR%20OR%20%23NECTR%20OR%20%22NECTR%20Token%22%20OR%20%22NECTR%20ecosystem%22&src=typed_query&f=live"
                >
                  Tweets about NECTR
                </a>
              </div>
            </div>
          </div>

          {/* Community Links */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">👥</span>
                Join Our Community
              </h3>
              <div className="space-y-4">
                <motion.a
                  href="https://twitter.com/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl hover:from-blue-800/40 hover:to-cyan-800/40 transition-all duration-300 border border-blue-700/30 hover:border-blue-600/50 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">Twitter</div>
                    <div className="text-sm text-gray-400">@NECTRToken</div>
                  </div>
                </motion.a>
                
                <motion.a
                  href="https://t.me/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl hover:from-blue-800/40 hover:to-indigo-800/40 transition-all duration-300 border border-blue-700/30 hover:border-blue-600/50 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">Telegram</div>
                    <div className="text-sm text-gray-400">@NECTRToken</div>
                  </div>
                </motion.a>
                
                <motion.a
                  href="https://discord.gg/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl hover:from-indigo-800/40 hover:to-purple-800/40 transition-all duration-300 border border-indigo-700/30 hover:border-indigo-600/50 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">Discord</div>
                    <div className="text-sm text-gray-400">NECTR Community</div>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Official Twitter Widget */}
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📢</span>
                NECTR Official
              </h3>
              <div className="flex justify-center">
                <a
                  className="twitter-timeline"
                  data-height="400"
                  data-theme="dark"
                  data-chrome="noheader nofooter noborders"
                  data-tweet-limit="3"
                  href="https://twitter.com/NECTRToken?ref_src=twsrc%5Etfw"
                >
                  Tweets by NECTRToken
                </a>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-slate-800/40 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-600/30 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📊</span>
                Community Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Twitter Followers</span>
                  <span className="text-blue-400 font-semibold">2.5K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Telegram Members</span>
                  <span className="text-blue-400 font-semibold">1.8K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Discord Members</span>
                  <span className="text-indigo-400 font-semibold">1.2K+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Active Stakers</span>
                  <span className="text-green-400 font-semibold">850+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;