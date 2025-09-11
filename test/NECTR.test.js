const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NECTR Token Contract", function () {
  let nectr;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const NECTR = await ethers.getContractFactory("NECTR");
    nectr = await NECTR.deploy();
    await nectr.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nectr.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await nectr.balanceOf(owner.address);
      expect(await nectr.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct initial supply", async function () {
      const totalSupply = await nectr.totalSupply();
      const initialSupply = ethers.parseEther("100000000"); // 100M tokens
      expect(totalSupply).to.equal(initialSupply);
    });

    it("Should have correct max supply", async function () {
      const maxSupply = await nectr.MAX_SUPPLY();
      const expectedMaxSupply = ethers.parseEther("1000000000"); // 1B tokens
      expect(maxSupply).to.equal(expectedMaxSupply);
    });
  });

  describe("Tier System", function () {
    it("Should initialize tiers correctly", async function () {
      // Test Bronze tier
      const bronzeTier = await nectr.getTierInfo(0); // BRONZE = 0
      expect(bronzeTier.apyRate).to.equal(500); // 5%
      expect(bronzeTier.name).to.equal("Bronze");

      // Test Silver tier
      const silverTier = await nectr.getTierInfo(1); // SILVER = 1
      expect(silverTier.apyRate).to.equal(800); // 8%
      expect(silverTier.name).to.equal("Silver");

      // Test Gold tier
      const goldTier = await nectr.getTierInfo(2); // GOLD = 2
      expect(goldTier.apyRate).to.equal(1200); // 12%
      expect(goldTier.name).to.equal("Gold");

      // Test Platinum tier
      const platinumTier = await nectr.getTierInfo(3); // PLATINUM = 3
      expect(platinumTier.apyRate).to.equal(1500); // 15%
      expect(platinumTier.name).to.equal("Platinum");
    });
  });

  describe("Staking", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for testing
      await nectr.transfer(addr1.address, ethers.parseEther("10000"));
    });

    it("Should allow staking tokens", async function () {
      const stakeAmount = ethers.parseEther("1000");
      
      await nectr.connect(addr1).stake(stakeAmount);
      
      const stakeInfo = await nectr.getStakeInfo(addr1.address);
      expect(stakeInfo.amount).to.equal(stakeAmount);
      expect(stakeInfo.isActive).to.be.true;
      expect(stakeInfo.tier).to.equal(0); // Should be Bronze tier
    });

    it("Should upgrade tier when staking more tokens", async function () {
      const initialStake = ethers.parseEther("5000");
      const additionalStake = ethers.parseEther("5000");
      
      // First stake - should be Bronze tier
      await nectr.connect(addr1).stake(initialStake);
      let stakeInfo = await nectr.getStakeInfo(addr1.address);
      expect(stakeInfo.tier).to.equal(0); // Bronze
      
      // Second stake - should upgrade to Silver tier
      await nectr.connect(addr1).stake(additionalStake);
      stakeInfo = await nectr.getStakeInfo(addr1.address);
      expect(stakeInfo.tier).to.equal(1); // Silver
    });

    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await nectr.connect(addr1).stake(stakeAmount);
      
      // Fast forward time by 1 day
      await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
      await ethers.provider.send("evm_mine");
      
      const pendingRewards = await nectr.getPendingRewards(addr1.address);
      expect(pendingRewards).to.be.gt(0);
    });

    it("Should allow unstaking", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await nectr.connect(addr1).stake(stakeAmount);
      
      const unstakeAmount = ethers.parseEther("500");
      await nectr.connect(addr1).unstake(unstakeAmount);
      
      const stakeInfo = await nectr.getStakeInfo(addr1.address);
      expect(stakeInfo.amount).to.equal(ethers.parseEther("500"));
    });

    it("Should prevent staking below minimum amount", async function () {
      const stakeAmount = ethers.parseEther("50"); // Below 100 minimum
      
      await expect(
        nectr.connect(addr1).stake(stakeAmount)
      ).to.be.revertedWith("Amount below minimum stake");
    });

    it("Should prevent staking above maximum amount", async function () {
      const stakeAmount = ethers.parseEther("11000000"); // Above 10M maximum
      
      await expect(
        nectr.connect(addr1).stake(stakeAmount)
      ).to.be.revertedWith("Amount exceeds maximum stake");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      const reason = "Test minting";
      
      await nectr.mint(addr1.address, mintAmount, reason);
      
      const balance = await nectr.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should prevent non-authorized users from minting", async function () {
      const mintAmount = ethers.parseEther("1000");
      const reason = "Unauthorized minting";
      
      await expect(
        nectr.connect(addr1).mint(addr2.address, mintAmount, reason)
      ).to.be.revertedWith("Not authorized to mint");
    });

    it("Should prevent minting beyond max supply", async function () {
      const maxSupply = await nectr.MAX_SUPPLY();
      const currentSupply = await nectr.totalSupply();
      const excessAmount = maxSupply - currentSupply + ethers.parseEther("1");
      
      await expect(
        nectr.mint(addr1.address, excessAmount, "Excess minting")
      ).to.be.revertedWith("Max supply exceeded");
    });
  });

  describe("Blacklist", function () {
    it("Should allow owner to blacklist addresses", async function () {
      await nectr.setBlacklist(addr1.address, true);
      expect(await nectr.blacklisted(addr1.address)).to.be.true;
    });

    it("Should prevent blacklisted addresses from receiving tokens", async function () {
      await nectr.setBlacklist(addr1.address, true);
      
      await expect(
        nectr.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("Blacklisted address");
    });

    it("Should prevent blacklisted addresses from staking", async function () {
      await nectr.setBlacklist(addr1.address, true);
      await nectr.transfer(addr1.address, ethers.parseEther("1000"));
      
      await expect(
        nectr.connect(addr1).stake(ethers.parseEther("100"))
      ).to.be.revertedWith("Account is blacklisted");
    });
  });

  describe("Pause Functionality", function () {
    it("Should allow owner to pause staking", async function () {
      await nectr.pauseStaking();
      expect(await nectr.paused()).to.be.true;
    });

    it("Should prevent staking when paused", async function () {
      await nectr.pauseStaking();
      await nectr.transfer(addr1.address, ethers.parseEther("1000"));
      
      await expect(
        nectr.connect(addr1).stake(ethers.parseEther("100"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow owner to unpause staking", async function () {
      await nectr.pauseStaking();
      await nectr.unpauseStaking();
      expect(await nectr.paused()).to.be.false;
    });
  });

  describe("Administrative Functions", function () {
    it("Should allow owner to update tier APY", async function () {
      await nectr.updateTierApy(0, 600); // Update Bronze tier to 6%
      const bronzeTier = await nectr.getTierInfo(0);
      expect(bronzeTier.apyRate).to.equal(600);
    });

    it("Should prevent non-owner from updating tier APY", async function () {
      await expect(
        nectr.connect(addr1).updateTierApy(0, 600)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set minimum stake amount", async function () {
      const newMinAmount = ethers.parseEther("200");
      await nectr.setMinStakeAmount(newMinAmount);
      expect(await nectr.minStakeAmount()).to.equal(newMinAmount);
    });

    it("Should allow owner to set maximum stake amount", async function () {
      const newMaxAmount = ethers.parseEther("20000000");
      await nectr.setMaxStakeAmount(newMaxAmount);
      expect(await nectr.maxStakeAmount()).to.equal(newMaxAmount);
    });
  });

  describe("Contract Statistics", function () {
    it("Should return correct contract statistics", async function () {
      const stats = await nectr.getContractStats();
      expect(stats.totalStaked).to.equal(0);
      expect(stats.totalRewards).to.equal(0);
      expect(stats.totalSupply).to.equal(ethers.parseEther("100000000"));
      expect(stats.maxSupply).to.equal(ethers.parseEther("1000000000"));
    });
  });

  describe("Events", function () {
    it("Should emit TokensStaked event", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await nectr.transfer(addr1.address, stakeAmount);
      
      await expect(nectr.connect(addr1).stake(stakeAmount))
        .to.emit(nectr, "TokensStaked")
        .withArgs(addr1.address, stakeAmount, 0, await ethers.provider.getBlockNumber() + 1);
    });

    it("Should emit TierUpgraded event", async function () {
      const stakeAmount = ethers.parseEther("10000");
      await nectr.transfer(addr1.address, stakeAmount);
      
      await expect(nectr.connect(addr1).stake(stakeAmount))
        .to.emit(nectr, "TierUpgraded")
        .withArgs(addr1.address, 0, 1); // From Bronze to Silver
    });
  });
});
