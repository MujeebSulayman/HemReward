import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NewsArticle {
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
}

const NewsModule: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Mock news data for demo purposes
  const mockArticles: NewsArticle[] = [
    {
      id: "1",
      title: "NECTR Token Launches Revolutionary Healthcare Rewards Platform",
      summary: "The NECTR ecosystem introduces a groundbreaking approach to incentivizing healthy behaviors through blockchain technology.",
      content: "The NECTR Token ecosystem has officially launched, bringing together healthcare providers, patients, and wellness enthusiasts in a revolutionary rewards system. The platform leverages blockchain technology to create transparent, secure, and efficient health reward mechanisms that benefit all participants.",
      author: "Sarah Johnson",
      publishedAt: "2024-01-15T10:30:00Z",
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      readTime: "5 min read",
      source: "HealthTech News"
    },
    {
      id: "2",
      title: "Staking Rewards Reach 10% APY as NECTR Adoption Grows",
      summary: "Early adopters of NECTR staking are seeing impressive returns as the platform gains traction in the healthcare sector.",
      content: "NECTR token stakers are enjoying substantial rewards as the platform's adoption continues to grow. With a current APY of 10%, early participants are seeing significant returns on their staked tokens. The staking mechanism is designed to encourage long-term participation in the ecosystem.",
      author: "Michael Chen",
      publishedAt: "2024-01-14T14:20:00Z",
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
      readTime: "4 min read",
      source: "Crypto Daily"
    },
    {
      id: "3",
      title: "Major Healthcare Providers Partner with NECTR for Patient Rewards",
      summary: "Leading hospitals and clinics are integrating NECTR rewards into their patient care programs.",
      content: "Several major healthcare providers have announced partnerships with NECTR to integrate token rewards into their patient care programs. This collaboration aims to improve patient engagement and health outcomes through incentivized wellness programs.",
      author: "Dr. Emily Rodriguez",
      publishedAt: "2024-01-13T09:15:00Z",
      category: "healthcare",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop",
      readTime: "6 min read",
      source: "Medical Innovation"
    },
    {
      id: "4",
      title: "NECTR Token Listed on Major Exchanges",
      summary: "The NECTR token is now available for trading on several prominent cryptocurrency exchanges.",
      content: "NECTR token has been successfully listed on major cryptocurrency exchanges, providing increased liquidity and accessibility for investors and users. The listing marks a significant milestone in the token's journey toward mainstream adoption.",
      author: "Alex Thompson",
      publishedAt: "2024-01-12T16:45:00Z",
      category: "blockchain",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      readTime: "3 min read",
      source: "Crypto Exchange News"
    },
    {
      id: "5",
      title: "Wellness Programs Show 40% Improvement in Patient Engagement",
      summary: "Early data from NECTR-powered wellness programs demonstrates significant improvements in patient participation.",
      content: "Preliminary data from healthcare providers using NECTR rewards shows a 40% increase in patient engagement with wellness programs. The token-based incentive system is proving effective in motivating patients to maintain healthy habits and attend regular checkups.",
      author: "Dr. James Wilson",
      publishedAt: "2024-01-11T11:30:00Z",
      category: "healthcare",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      readTime: "7 min read",
      source: "Healthcare Analytics"
    }
  ];

  const categories = [
    { id: "all", name: "All News", count: mockArticles.length },
    { id: "blockchain", name: "Blockchain", count: mockArticles.filter(a => a.category === "blockchain").length },
    { id: "healthcare", name: "Healthcare", count: mockArticles.filter(a => a.category === "healthcare").length },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(mockArticles);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "blockchain":
        return "bg-purple-900/30 text-purple-300 border-purple-700/50";
      case "healthcare":
        return "bg-green-900/30 text-green-300 border-green-700/50";
      default:
        return "bg-gray-900/30 text-gray-300 border-gray-700/50";
    }
  };

  const ArticleCard: React.FC<{ article: NewsArticle; index: number }> = ({ article, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
      onClick={() => setSelectedArticle(article)}
    >
      <div className="relative">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
          <span>{article.source}</span>
          <span>•</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-purple-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">By {article.author}</span>
          <span className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors">
            Read More →
          </span>
        </div>
      </div>
    </motion.div>
  );

  const ArticleModal: React.FC<{ article: NewsArticle; onClose: () => void }> = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <span>{article.source}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{article.title}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(article.category)}`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
            <span className="text-gray-400">By {article.author}</span>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">{article.summary}</p>
            <p className="text-gray-300 leading-relaxed">{article.content}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Latest News & Updates
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Stay informed about the latest developments in the NECTR ecosystem and healthcare blockchain innovation
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-gray-700/50"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 animate-pulse">
                <div className="w-full h-48 bg-gray-700"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        )}

        {/* Featured Article */}
        {!loading && articles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Featured Article</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-700/50"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-purple-300 mb-4">
                    <span>{articles[0].source}</span>
                    <span>•</span>
                    <span>{formatDate(articles[0].publishedAt)}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{articles[0].title}</h3>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">{articles[0].summary}</p>
                  <button
                    onClick={() => setSelectedArticle(articles[0])}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Read Full Article
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={articles[0].imageUrl}
                    alt={articles[0].title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Article Modal */}
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NewsModule;
