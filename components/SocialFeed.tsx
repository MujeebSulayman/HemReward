import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Tweet {
  id: string;
  text: string;
  author: string;
  username: string;
  timestamp: string;
  likes: number;
  retweets: number;
  avatar: string;
}

const SocialFeed: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock Twitter data for demo purposes
  const mockTweets: Tweet[] = [
    {
      id: "1",
      text: "🚀 Excited to announce the NECTR Token Ecosystem! Join us in revolutionizing healthcare rewards with blockchain technology. #NECTR #Web3 #Healthcare",
      author: "NECTR Official",
      username: "@NECTRToken",
      timestamp: "2h",
      likes: 1247,
      retweets: 89,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "2",
      text: "💡 Did you know? NECTR tokens can be earned by completing health checkups, maintaining fitness goals, and participating in wellness programs. Your health = your wealth! 💪",
      author: "HealthTech News",
      username: "@HealthTechNews",
      timestamp: "4h",
      likes: 892,
      retweets: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "3",
      text: "🔥 The staking rewards for NECTR tokens are now live! Stake your tokens and earn up to 10% APY. Don't miss out on this opportunity to grow your health rewards! 📈",
      author: "DeFi Updates",
      username: "@DeFiUpdates",
      timestamp: "6h",
      likes: 2156,
      retweets: 234,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "4",
      text: "🏥 Partnering with leading healthcare providers to integrate NECTR rewards into their systems. Soon, you'll be able to earn tokens for every doctor visit! 🩺",
      author: "NECTR Official",
      username: "@NECTRToken",
      timestamp: "8h",
      likes: 1876,
      retweets: 198,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "5",
      text: "🌱 Sustainability meets healthcare! NECTR is committed to reducing healthcare costs while incentivizing healthy behaviors. Join the movement! 🌍",
      author: "Green Health",
      username: "@GreenHealth",
      timestamp: "12h",
      likes: 743,
      retweets: 67,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchTweets = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTweets(mockTweets);
      setLoading(false);
    };

    fetchTweets();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const TweetCard: React.FC<{ tweet: Tweet; index: number }> = ({ tweet, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className="flex space-x-4">
        <img
          src={tweet.avatar}
          alt={tweet.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white">{tweet.author}</h3>
            <span className="text-gray-400 text-sm">{tweet.username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{tweet.timestamp}</span>
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">{tweet.text}</p>
          <div className="flex items-center space-x-6 text-gray-500">
            <div className="flex items-center space-x-1 hover:text-red-400 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{formatNumber(tweet.likes)}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-400 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm">{formatNumber(tweet.retweets)}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-400 transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Social Media Feed
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest NECTR news and community discussions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Twitter Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Twitter Feed</h2>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-700/30 rounded-xl p-6 animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {tweets.map((tweet, index) => (
                    <TweetCard key={tweet.id} tweet={tweet} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Social Links & Community */}
          <div className="space-y-6">
            {/* Community Links */}
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Join Our Community</h3>
              <div className="space-y-4">
                <a
                  href="https://twitter.com/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50 hover:bg-blue-900/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Twitter</p>
                    <p className="text-sm text-gray-400">Follow @NECTRToken</p>
                  </div>
                </a>

                <a
                  href="https://t.me/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50 hover:bg-blue-900/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Telegram</p>
                    <p className="text-sm text-gray-400">Join our community</p>
                  </div>
                </a>

                <a
                  href="https://discord.gg/NECTRToken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-indigo-900/30 rounded-lg border border-indigo-700/50 hover:bg-indigo-900/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">Discord</p>
                    <p className="text-sm text-gray-400">Chat with the community</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Twitter Followers</span>
                  <span className="text-white font-semibold">12.5K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Telegram Members</span>
                  <span className="text-white font-semibold">8.9K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Discord Members</span>
                  <span className="text-white font-semibold">5.2K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Stakers</span>
                  <span className="text-white font-semibold">3.1K</span>
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
