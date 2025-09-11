import React from "react";
import Hero from "../../components/Hero";
import TokenFaucet from "../../components/TokenFaucet";
import StakingInterface from "../../components/StakingInterface";
import TierSystem from "../../components/TierSystem";
import SocialFeed from "../../components/SocialFeed";
import NewsModule from "../../components/NewsModule";

const Index = () => {
  return (
    <div className="relative">
      {/* Main Public Sections */}
      <div className="relative z-10">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="faucet">
          <TokenFaucet />
        </section>
        
        <section id="staking">
          <StakingInterface />
        </section>
        
        <section id="tiers">
          <TierSystem />
        </section>
        
        <section id="social">
          <SocialFeed />
        </section>
        
        <section id="news">
          <NewsModule />
        </section>
      </div>
    </div>
  );
};

export default Index;