import React from "react";
import Hero from "../../components/Hero";
import TokenFaucet from "../../components/TokenFaucet";
import StakingInterface from "../../components/StakingInterface";
import SocialFeed from "../../components/SocialFeed";
import NewsModule from "../../components/NewsModule";

const Index = () => {
  return (
    <div>
      <Hero />
      <TokenFaucet />
      <StakingInterface />
      <SocialFeed />
      <NewsModule />
    </div>
  );
};

export default Index;
