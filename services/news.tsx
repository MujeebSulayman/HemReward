// News service for real-time RSS feed integration
// This simulates real RSS feed parsing and provides live news updates

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  imageUrl: string;
  readTime: string;
  source: string;
  url?: string;
}

// Simulate RSS feed parsing with real-time updates
const generateLiveNews = (): NewsArticle[] => {
  const baseArticles: NewsArticle[] = [
    {
      id: "1",
      title: "NECTR Token Launches Revolutionary Healthcare Rewards Platform",
      summary: "The NECTR ecosystem introduces a groundbreaking approach to incentivizing healthy behaviors through blockchain technology.",
      content: "The NECTR Token ecosystem has officially launched, bringing together healthcare providers, patients, and wellness enthusiasts in a revolutionary rewards system. The platform leverages blockchain technology to create transparent, secure, and efficient health reward mechanisms that benefit all participants.",
      author: "Sarah Johnson",
      publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "5 min read",
      source: "HealthTech News",
      url: "https://example.com/article1"
    },
    {
      id: "2",
      title: "Staking Rewards Reach 15% APY as NECTR Adoption Grows",
      summary: "Early adopters of NECTR staking are seeing impressive returns as the platform gains traction in the healthcare sector.",
      content: "NECTR token stakers are enjoying substantial rewards as the platform's adoption continues to grow. With a current APY of up to 15%, early participants are seeing significant returns on their staked tokens. The staking mechanism is designed to encourage long-term participation in the ecosystem.",
      author: "Michael Chen",
      publishedAt: new Date(Date.now() - Math.random() * 172800000).toISOString(),
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      readTime: "4 min read",
      source: "Crypto Daily",
      url: "https://example.com/article2"
    },
    {
      id: "3",
      title: "Major Healthcare Providers Partner with NECTR for Patient Rewards",
      summary: "Leading hospitals and clinics are integrating NECTR rewards into their patient care programs.",
      content: "Several major healthcare providers have announced partnerships with NECTR to integrate token rewards into their patient care programs. This collaboration aims to improve patient engagement and health outcomes through incentivized wellness programs.",
      author: "Dr. Emily Rodriguez",
      publishedAt: new Date(Date.now() - Math.random() * 259200000).toISOString(),
      category: "healthcare",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      readTime: "6 min read",
      source: "Medical Innovation",
      url: "https://example.com/article3"
    },
    {
      id: "4",
      title: "NECTR Token Listed on Major Exchanges",
      summary: "The NECTR token is now available for trading on several prominent cryptocurrency exchanges.",
      content: "NECTR token has been successfully listed on major cryptocurrency exchanges, providing increased liquidity and accessibility for investors and users. The listing marks a significant milestone in the token's journey toward mainstream adoption.",
      author: "Alex Thompson",
      publishedAt: new Date(Date.now() - Math.random() * 345600000).toISOString(),
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      readTime: "3 min read",
      source: "Crypto Exchange News",
      url: "https://example.com/article4"
    },
    {
      id: "5",
      title: "Wellness Programs Show 40% Improvement in Patient Engagement",
      summary: "Early data from NECTR-powered wellness programs demonstrates significant improvements in patient participation.",
      content: "Preliminary data from healthcare providers using NECTR rewards shows a 40% increase in patient engagement with wellness programs. The token-based incentive system is proving effective in motivating patients to maintain healthy habits and attend regular checkups.",
      author: "Dr. James Wilson",
      publishedAt: new Date(Date.now() - Math.random() * 432000000).toISOString(),
      category: "healthcare",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      readTime: "7 min read",
      source: "Healthcare Analytics",
      url: "https://example.com/article5"
    }
  ];

  // Simulate real-time updates by modifying timestamps and adding new articles
  const updatedArticles = baseArticles.map(article => ({
    ...article,
    publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }));

  // Occasionally add a new article
  if (Math.random() > 0.7) {
    const newArticle: NewsArticle = {
      id: `new-${Date.now()}`,
      title: "Breaking: NECTR Token Surges 25% Following Major Partnership Announcement",
      summary: "The NECTR token has experienced significant price movement following the announcement of a new strategic partnership.",
      content: "In a surprising turn of events, the NECTR token has surged 25% in the last 24 hours following the announcement of a major strategic partnership with a leading healthcare technology company. This partnership is expected to accelerate the adoption of NECTR's healthcare rewards platform.",
      author: "Breaking News Team",
      publishedAt: new Date().toISOString(),
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      readTime: "2 min read",
      source: "Crypto Breaking News",
      url: "https://example.com/breaking"
    };
    updatedArticles.unshift(newArticle);
  }

  return updatedArticles;
};

// Simulate RSS feed fetching
export const fetchLiveNews = async (): Promise<NewsArticle[]> => {
  // Simulate RSS parsing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Return fresh news data
  return generateLiveNews();
};

// Simulate RSS feed by category
export const fetchNewsByCategory = async (category: string): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const allNews = generateLiveNews();
  return allNews.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
};

// Simulate RSS feed search
export const searchNews = async (query: string): Promise<NewsArticle[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const allNews = generateLiveNews();
  return allNews.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.summary.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase())
  );
};

// Real RSS feed integration (requires CORS proxy or backend)
export const fetchRealRSSFeed = async (rssUrl: string): Promise<NewsArticle[]> => {
  try {
    // This would be the actual RSS parsing implementation
    // Requires a CORS proxy or backend service
    
    /*
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.guid || item.link,
      title: item.title,
      summary: item.description,
      content: item.content,
      author: item.author || 'Unknown',
      publishedAt: item.pubDate,
      category: 'general',
      imageUrl: item.thumbnail || 'https://via.placeholder.com/400x250',
      readTime: '5 min read',
      source: data.feed?.title || 'RSS Feed',
      url: item.link
    }));
    */
    
    // Fallback to mock data
    return fetchLiveNews();
  } catch (error) {
    console.error('RSS feed error:', error);
    return fetchLiveNews();
  }
};

// WebSocket simulation for real-time news updates
export class NewsWebSocket {
  private callbacks: ((articles: NewsArticle[]) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;

  connect() {
    // Simulate WebSocket connection for real-time news
    this.interval = setInterval(() => {
      this.fetchAndNotify();
    }, 60000); // Update every minute
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onUpdate(callback: (articles: NewsArticle[]) => void) {
    this.callbacks.push(callback);
  }

  private async fetchAndNotify() {
    try {
      const articles = await fetchLiveNews();
      this.callbacks.forEach(callback => callback(articles));
    } catch (error) {
      console.error('Error fetching live news:', error);
    }
  }
}

export default {
  fetchLiveNews,
  fetchNewsByCategory,
  searchNews,
  fetchRealRSSFeed,
  NewsWebSocket
};
