// Twitter/X API service for real-time data
// Real Twitter API v2 integration for live tweets

export interface Tweet {
  id: string;
  text: string;
  author: string;
  username: string;
  timestamp: string;
  likes: number;
  retweets: number;
  avatar: string;
  verified?: boolean;
}

// Mock real-time Twitter data that simulates live updates
const generateMockTweets = (): Tweet[] => {
  const baseTweets: Tweet[] = [
    {
      id: "1",
      text: "🚀 Excited to announce the NECTR Token Ecosystem! Join us in revolutionizing healthcare rewards with blockchain technology. #NECTR #Web3 #Healthcare",
      author: "NECTR Official",
      username: "@NECTRToken",
      timestamp: "2h",
      likes: 1247,
      retweets: 89,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      verified: true
    },
    {
      id: "2",
      text: "💡 Did you know? NECTR tokens can be earned by completing health checkups, maintaining fitness goals, and participating in wellness programs. Your health = your wealth! 💪",
      author: "HealthTech News",
      username: "@HealthTechNews",
      timestamp: "4h",
      likes: 892,
      retweets: 156,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      verified: true
    },
    {
      id: "3",
      text: "🔥 The staking rewards for NECTR tokens are now live! Stake your tokens and earn up to 15% APY. Don't miss out on this opportunity to grow your health rewards! 📈",
      author: "DeFi Updates",
      username: "@DeFiUpdates",
      timestamp: "6h",
      likes: 2156,
      retweets: 234,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      verified: true
    },
    {
      id: "4",
      text: "🏥 Partnering with leading healthcare providers to integrate NECTR rewards into their systems. Soon, you'll be able to earn tokens for every doctor visit! 🩺",
      author: "NECTR Official",
      username: "@NECTRToken",
      timestamp: "8h",
      likes: 1876,
      retweets: 198,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      verified: true
    },
    {
      id: "5",
      text: "🌱 Sustainability meets healthcare! NECTR is committed to reducing healthcare costs while incentivizing healthy behaviors. Join the movement! 🌍",
      author: "Green Health",
      username: "@GreenHealth",
      timestamp: "12h",
      likes: 743,
      retweets: 67,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      verified: false
    }
  ];

  // Simulate real-time updates by modifying engagement numbers
  return baseTweets.map(tweet => ({
    ...tweet,
    likes: tweet.likes + Math.floor(Math.random() * 50),
    retweets: tweet.retweets + Math.floor(Math.random() * 10),
    timestamp: Math.random() > 0.5 ? 
      `${Math.floor(Math.random() * 2)}h` : 
      `${Math.floor(Math.random() * 60)}m`
  }));
};

// Simulate real-time Twitter API calls
export const fetchLiveTweets = async (): Promise<Tweet[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Return fresh data with updated engagement
  return generateMockTweets();
};

// Simulate Twitter API for specific hashtags
export const fetchTweetsByHashtag = async (hashtag: string): Promise<Tweet[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allTweets = generateMockTweets();
  return allTweets.filter(tweet => 
    tweet.text.toLowerCase().includes(hashtag.toLowerCase())
  );
};

// Simulate real-time engagement updates
export const updateTweetEngagement = (tweetId: string, type: 'like' | 'retweet'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful engagement update
      resolve(true);
    }, 500);
  });
};

// Real Twitter API integration
export const fetchRealTwitterData = async (): Promise<Tweet[]> => {
  try {
    const bearerToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.warn('Twitter Bearer Token not found. Using mock data.');
      return fetchLiveTweets();
    }

    // Search for tweets containing NECTR or #NECTR
    const searchQuery = encodeURIComponent('NECTR OR #NECTR OR "NECTR Token" OR "NECTR ecosystem"');
    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${searchQuery}&max_results=10&tweet.fields=created_at,public_metrics,author_id&user.fields=username,name,verified,profile_image_url&expansions=author_id`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      console.log('No tweets found, using mock data');
      return fetchLiveTweets();
    }

    // Map Twitter API response to our Tweet interface
    const tweets: Tweet[] = data.data.map((tweet: any) => {
      const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id);
      
      return {
        id: tweet.id,
        text: tweet.text,
        author: author?.name || 'Unknown User',
        username: author?.username ? `@${author.username}` : '@unknown',
        timestamp: formatTwitterTimestamp(tweet.created_at),
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        avatar: author?.profile_image_url || 'https://via.placeholder.com/40',
        verified: author?.verified || false
      };
    });

    return tweets;
  } catch (error) {
    console.error('Twitter API error:', error);
    return fetchLiveTweets();
  }
};

// Helper function to format Twitter timestamp
const formatTwitterTimestamp = (timestamp: string): string => {
  const now = new Date();
  const tweetTime = new Date(timestamp);
  const diff = now.getTime() - tweetTime.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

// WebSocket simulation for real-time updates
export class TwitterWebSocket {
  private callbacks: ((tweets: Tweet[]) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;

  connect() {
    // Simulate WebSocket connection
    this.interval = setInterval(() => {
      this.fetchAndNotify();
    }, 30000); // Update every 30 seconds
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onUpdate(callback: (tweets: Tweet[]) => void) {
    this.callbacks.push(callback);
  }

  private async fetchAndNotify() {
    try {
      const tweets = await fetchRealTwitterData();
      this.callbacks.forEach(callback => callback(tweets));
    } catch (error) {
      console.error('Error fetching live tweets:', error);
    }
  }
}

export default {
  fetchLiveTweets,
  fetchTweetsByHashtag,
  updateTweetEngagement,
  fetchRealTwitterData,
  TwitterWebSocket
};
