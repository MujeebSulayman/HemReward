import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchRealTwitterData, fetchTweetsByHashtag, TwitterWebSocket, Tweet } from "../services/twitter";

// Tweet interface is now imported from twitter service

const SocialFeed: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [wsConnection, setWsConnection] = useState<TwitterWebSocket | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchTweets = async () => {
      setLoading(true);
      try {
        const liveTweets = await fetchRealTwitterData();
        setTweets(liveTweets);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();

    // Set up real-time WebSocket connection
    const ws = new TwitterWebSocket();
    ws.onUpdate((newTweets) => {
      setTweets(newTweets);
      setLastUpdate(new Date());
    });
    ws.connect();
    setWsConnection(ws);

    // Cleanup
    return () => {
      ws.disconnect();
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const liveTweets = await fetchRealTwitterData();
      setTweets(liveTweets);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing tweets:', error);
    } finally {
      setLoading(false);
    }
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
            {tweet.verified && (
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            )}
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
            Live Social Media Feed
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest NECTR news and community discussions
          </p>
          
          {/* Real-time indicator */}
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live updates</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {formatLastUpdate(lastUpdate)}
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
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
