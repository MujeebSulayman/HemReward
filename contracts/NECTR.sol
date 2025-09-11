// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NECTR is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    enum StakeTier {
        BRONZE,
        SILVER,
        GOLD,
        PLATINUM
    }

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 lastClaimTime;
        StakeTier tier;
        uint256 totalRewardsClaimed;
        bool isActive;
    }

    struct TierInfo {
        uint256 minAmount;
        uint256 maxAmount;
        uint256 apyRate;
        string name;
    }
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public totalStakedByUser;
    mapping(StakeTier => TierInfo) public tierInfo;
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant BASIS_POINTS = 10000; // For percentage calculations
    
    uint256 public totalStakedAmount;
    uint256 public totalRewardsDistributed;
    uint256 public stakingStartTime;
    
    mapping(address => bool) public authorizedMinters;
    mapping(address => bool) public blacklisted;
    uint256 public maxStakeAmount = 10_000_000 * 10**18; // 10M token max stake
    uint256 public minStakeAmount = 100 * 10**18; // 100 token minimum stake
    
    event TokensStaked(
        address indexed user, 
        uint256 amount, 
        StakeTier tier, 
        uint256 timestamp
    );
    event TokensUnstaked(
        address indexed user, 
        uint256 amount, 
        uint256 rewards, 
        uint256 timestamp
    );
    event RewardsClaimed(
        address indexed user, 
        uint256 amount, 
        uint256 timestamp
    );
    event TokensMinted(
        address indexed to, 
        uint256 amount, 
        string reason
    );
    event TierUpgraded(
        address indexed user, 
        StakeTier oldTier, 
        StakeTier newTier
    );
    event EmergencyWithdraw(
        address indexed user, 
        uint256 amount
    );
    event BlacklistUpdated(
        address indexed account, 
        bool isBlacklisted
    );

    constructor() ERC20("NECTR Token", "NECTR") Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
        stakingStartTime = block.timestamp;
        _initializeTiers();
        authorizedMinters[msg.sender] = true;
        emit TokensMinted(msg.sender, INITIAL_SUPPLY, "Initial supply");
    }

    function _initializeTiers() internal {
        tierInfo[StakeTier.BRONZE] = TierInfo({
            minAmount: 0,
            maxAmount: 10_000 * 10**18,
            apyRate: 500,
            name: "Bronze"
        });
        
        tierInfo[StakeTier.SILVER] = TierInfo({
            minAmount: 10_000 * 10**18,
            maxAmount: 100_000 * 10**18,
            apyRate: 800,
            name: "Silver"
        });
        
        tierInfo[StakeTier.GOLD] = TierInfo({
            minAmount: 100_000 * 10**18,
            maxAmount: 1_000_000 * 10**18,
            apyRate: 1200,
            name: "Gold"
        });
        
        tierInfo[StakeTier.PLATINUM] = TierInfo({
            minAmount: 1_000_000 * 10**18,
            maxAmount: type(uint256).max,
            apyRate: 1500,
            name: "Platinum"
        });
    }

    function mint(address to, uint256 amount, string calldata reason) external {
        require(
            msg.sender == owner() || authorizedMinters[msg.sender], 
            "Not authorized to mint"
        );
        require(!blacklisted[to], "Recipient is blacklisted");
        require(totalSupply().add(amount) <= MAX_SUPPLY, "Max supply exceeded");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    function stake(uint256 amount) external nonReentrant whenNotPaused {
        require(!blacklisted[msg.sender], "Account is blacklisted");
        require(amount >= minStakeAmount, "Amount below minimum stake");
        require(amount <= maxStakeAmount, "Amount exceeds maximum stake");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        if (stakes[msg.sender].isActive) {
            _claimRewardsInternal(msg.sender);
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        uint256 newTotalStaked = totalStakedByUser[msg.sender].add(amount);
        StakeTier newTier = _determineTier(newTotalStaked);
        
        if (stakes[msg.sender].isActive) {
            stakes[msg.sender].amount = stakes[msg.sender].amount.add(amount);
            stakes[msg.sender].lastClaimTime = block.timestamp;
            
            // Check for tier upgrade
            if (newTier != stakes[msg.sender].tier) {
                StakeTier oldTier = stakes[msg.sender].tier;
                stakes[msg.sender].tier = newTier;
                emit TierUpgraded(msg.sender, oldTier, newTier);
            }
        } else {
            stakes[msg.sender] = StakeInfo({
                amount: amount,
                timestamp: block.timestamp,
                lastClaimTime: block.timestamp,
                tier: newTier,
                totalRewardsClaimed: 0,
                isActive: true
            });
        }
        
        totalStakedByUser[msg.sender] = newTotalStaked;
        totalStakedAmount = totalStakedAmount.add(amount);
        
        emit TokensStaked(msg.sender, amount, newTier, block.timestamp);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].isActive, "No active stake");
        require(amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        
        uint256 rewards = _calculateRewards(msg.sender);
        
        stakes[msg.sender].amount = stakes[msg.sender].amount.sub(amount);
        totalStakedByUser[msg.sender] = totalStakedByUser[msg.sender].sub(amount);
        totalStakedAmount = totalStakedAmount.sub(amount);
        
        StakeTier newTier = _determineTier(totalStakedByUser[msg.sender]);
        if (newTier != stakes[msg.sender].tier) {
            StakeTier oldTier = stakes[msg.sender].tier;
            stakes[msg.sender].tier = newTier;
            emit TierUpgraded(msg.sender, oldTier, newTier);
        }
        
        if (stakes[msg.sender].amount == 0) {
            stakes[msg.sender].isActive = false;
        }
        
        _transfer(address(this), msg.sender, amount);
        
        // Mint and transfer rewards if any
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            stakes[msg.sender].totalRewardsClaimed = stakes[msg.sender].totalRewardsClaimed.add(rewards);
            totalRewardsDistributed = totalRewardsDistributed.add(rewards);
            stakes[msg.sender].lastClaimTime = block.timestamp;
            emit RewardsClaimed(msg.sender, rewards, block.timestamp);
        }
        
        emit TokensUnstaked(msg.sender, amount, rewards, block.timestamp);
    }

    function claimRewards() external nonReentrant {
        require(stakes[msg.sender].isActive, "No active stake");
        _claimRewardsInternal(msg.sender);
    }

    function _claimRewardsInternal(address user) internal {
        uint256 rewards = _calculateRewards(user);
        require(rewards > 0, "No rewards to claim");
        
        _mint(user, rewards);
        stakes[user].totalRewardsClaimed = stakes[user].totalRewardsClaimed.add(rewards);
        totalRewardsDistributed = totalRewardsDistributed.add(rewards);
        stakes[user].lastClaimTime = block.timestamp;
        
        emit RewardsClaimed(user, rewards, block.timestamp);
    }

    function _determineTier(uint256 amount) internal view returns (StakeTier) {
        if (amount >= tierInfo[StakeTier.PLATINUM].minAmount) {
            return StakeTier.PLATINUM;
        } else if (amount >= tierInfo[StakeTier.GOLD].minAmount) {
            return StakeTier.GOLD;
        } else if (amount >= tierInfo[StakeTier.SILVER].minAmount) {
            return StakeTier.SILVER;
        } else {
            return StakeTier.BRONZE;
        }
    }

    function _calculateRewards(address user) internal view returns (uint256) {
        if (!stakes[user].isActive || stakes[user].amount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp.sub(stakes[user].lastClaimTime);
        uint256 apyRate = tierInfo[stakes[user].tier].apyRate;
        uint256 annualReward = stakes[user].amount.mul(apyRate).div(BASIS_POINTS);
        uint256 rewards = annualReward.mul(timeStaked).div(365 days); // Calculate daily rewards
        
        return rewards;
    }

    function getStakeInfo(address user) external view returns (StakeInfo memory stakeInfo) {
        return stakes[user];
    }

    function getPendingRewards(address user) external view returns (uint256) {
        return _calculateRewards(user);
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStakedAmount;
    }

    function getUserStakedAmount(address user) external view returns (uint256) {
        return stakes[user].amount;
    }

    function getTierInfo(StakeTier tier) external view returns (TierInfo memory) {
        return tierInfo[tier];
    }

    function getUserTier(address user) external view returns (StakeTier) {
        return stakes[user].tier;
    }

    function getContractStats() external view returns (
        uint256 totalStaked,
        uint256 totalRewards,
        uint256 totalSupply,
        uint256 maxSupply
    ) {
        return (
            totalStakedAmount,
            totalRewardsDistributed,
            this.totalSupply(),
            MAX_SUPPLY
        );
    }

    function pauseStaking() external onlyOwner {
        _pause();
    }

    function unpauseStaking() external onlyOwner {
        _unpause();
    }

    function setMinStakeAmount(uint256 newMinAmount) external onlyOwner {
        require(newMinAmount > 0, "Minimum stake must be greater than 0");
        minStakeAmount = newMinAmount;
    }

    function setMaxStakeAmount(uint256 newMaxAmount) external onlyOwner {
        require(newMaxAmount > minStakeAmount, "Max must be greater than min");
        maxStakeAmount = newMaxAmount;
    }

    function updateTierApy(StakeTier tier, uint256 newApyRate) external onlyOwner {
        require(newApyRate <= 5000, "APY cannot exceed 50%"); // Max 50%
        tierInfo[tier].apyRate = newApyRate;
    }

    function setBlacklist(address account, bool isBlacklisted) external onlyOwner {
        blacklisted[account] = isBlacklisted;
        emit BlacklistUpdated(account, isBlacklisted);
    }

    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient contract balance");
        _transfer(address(this), owner(), amount);
        emit EmergencyWithdraw(owner(), amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        require(!blacklisted[from] && !blacklisted[to], "Blacklisted address");
        require(!paused() || from == address(0) || to == address(0), "Transfers paused");
        super._beforeTokenTransfer(from, to, amount);
    }
}
