import React from 'react';
import { motion } from 'framer-motion';

interface TokenStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  subtext?: string;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const TokenStatCard: React.FC<TokenStatCardProps> = ({
  title,
  value,
  icon,
  bgColor = 'from-slate-800/40 to-gray-800/20',
  textColor = 'text-white',
  subtext,
  loading = false,
  trend = 'neutral',
  trendValue
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '';
    }
  };

  return (
    <motion.div 
      className={`
        p-6 
        rounded-2xl 
        bg-gradient-to-br 
        ${bgColor} 
        border 
        border-slate-600/30 
        transform 
        transition-all 
        duration-300 
        hover:scale-105
        hover:shadow-2xl
        backdrop-blur-xl
        group
      `}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-slate-700/50 ${textColor} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            {trendValue && (
              <div className="flex items-center space-x-1">
                <span className={`text-xs ${getTrendColor()}`}>
                  {getTrendIcon()} {trendValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div>
        {loading ? (
          <div className="animate-pulse bg-slate-700/50 h-8 rounded w-3/4"></div>
        ) : (
          <>
            <p 
              className={`
                text-3xl 
                font-bold 
                ${textColor} 
                truncate 
                max-w-full
                group-hover:text-blue-400
                transition-colors
                duration-300
              `}
              title={String(value)}
            >
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">
                {subtext}
              </p>
            )}
          </>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </motion.div>
  );
};

export default TokenStatCard;