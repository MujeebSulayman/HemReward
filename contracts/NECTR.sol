// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title NECTR Token
 * @dev Advanced ERC-20 token with multi-tier staking, governance features, and security optimizations
 * @author NECTR Development Team
 */
contract NECTR is ERC20, Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    // ============ STAKING STRUCTURES ============
    
    enum StakeTier {
        BRONZE,    // 5% APY, 0-10K tokens
        SILVER,    // 8% APY, 10K-100K tokens  
        GOLD,      // 12% APY, 100K-1M tokens
        PLATINUM   // 15% APY, 1M+ tokens
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
        uint256 apyRate; // in basis points (100 = 1%)
        string name;
    }

    // ============ STATE VARIABLES ============
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public totalStakedByUser;
    mapping(StakeTier => TierInfo) public tierInfo;
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant BASIS_POINTS = 10000; // For percentage calculations
    
    uint256 public totalStakedAmount;
    uint256 public totalRewardsDistributed;
    uint256 public stakingStartTime;
    
    // Security and governance
    mapping(address => bool) public authorizedMinters;
    mapping(address => bool) public blacklisted;
    uint256 public maxStakeAmount = 10_000_000 * 10**18; // 10M token max stake
    uint256 public minStakeAmount = 100 * 10**18; // 100 token minimum stake
    
    // ============ EVENTS ============
    
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

    constructor() ERC20("NECTR Token", "NECTR") Ownable(msg.sender) {
        // Mint initial supply to owner
        _mint(msg.sender, INITIAL_SUPPLY);
        
        // Initialize staking start time
        stakingStartTime = block.timestamp;
        
        // Initialize tier information
        _initializeTiers();
        
        // Set owner as authorized minter
        authorizedMinters[msg.sender] = true;
        
        emit TokensMinted(msg.sender, INITIAL_SUPPLY, "Initial supply");
    }

    // ============ TIER INITIALIZATION ============
    
    function _initializeTiers() internal {
        tierInfo[StakeTier.BRONZE] = TierInfo({
            minAmount: 0,
            maxAmount: 10_000 * 10**18,
            apyRate: 500, // 5%
            name: "Bronze"
        });
        
        tierInfo[StakeTier.SILVER] = TierInfo({
            minAmount: 10_000 * 10**18,
            maxAmount: 100_000 * 10**18,
            apyRate: 800, // 8%
            name: "Silver"
        });
        
        tierInfo[StakeTier.GOLD] = TierInfo({
            minAmount: 100_000 * 10**18,
            maxAmount: 1_000_000 * 10**18,
            apyRate: 1200, // 12%
            name: "Gold"
        });
        
        tierInfo[StakeTier.PLATINUM] = TierInfo({
            minAmount: 1_000_000 * 10**18,
            maxAmount: type(uint256).max,
            apyRate: 1500, // 15%
            name: "Platinum"
        });
    }

    // ============ MINTING FUNCTIONS ============
    
    /**
     * @dev Mint tokens (owner or authorized minters only)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (for transparency)
     */
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

    /**
     * @dev Add authorized minter
     * @param minter Address to authorize
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = true;
    }

    /**
     * @dev Remove authorized minter
     * @param minter Address to remove authorization
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
    }

    // ============ STAKING FUNCTIONS ============
    
    /**
     * @dev Stake tokens with automatic tier assignment
     * @param amount Amount of tokens to stake
     */
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
        
        // Determine tier based on total staked amount
        uint256 newTotalStaked = totalStakedByUser[msg.sender].add(amount);
        StakeTier newTier = _determineTier(newTotalStaked);
        
        // Update stake info
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

    /**
     * @dev Unstake tokens and claim rewards
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].isActive, "No active stake");
        require(amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        
        // Calculate and claim rewards
        uint256 rewards = _calculateRewards(msg.sender);
        
        // Update stake info
        stakes[msg.sender].amount = stakes[msg.sender].amount.sub(amount);
        totalStakedByUser[msg.sender] = totalStakedByUser[msg.sender].sub(amount);
        totalStakedAmount = totalStakedAmount.sub(amount);
        
        // Determine new tier
        StakeTier newTier = _determineTier(totalStakedByUser[msg.sender]);
        if (newTier != stakes[msg.sender].tier) {
            StakeTier oldTier = stakes[msg.sender].tier;
            stakes[msg.sender].tier = newTier;
            emit TierUpgraded(msg.sender, oldTier, newTier);
        }
        
        // Deactivate stake if amount becomes 0
        if (stakes[msg.sender].amount == 0) {
            stakes[msg.sender].isActive = false;
        }
        
        // Transfer tokens back to user
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

    /**
     * @dev Claim staking rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        require(stakes[msg.sender].isActive, "No active stake");
        _claimRewardsInternal(msg.sender);
    }

    /**
     * @dev Internal function to claim rewards
     * @param user Address of the user claiming rewards
     */
    function _claimRewardsInternal(address user) internal {
        uint256 rewards = _calculateRewards(user);
        require(rewards > 0, "No rewards to claim");
        
        // Mint reward tokens
        _mint(user, rewards);
        stakes[user].totalRewardsClaimed = stakes[user].totalRewardsClaimed.add(rewards);
        totalRewardsDistributed = totalRewardsDistributed.add(rewards);
        stakes[user].lastClaimTime = block.timestamp;
        
        emit RewardsClaimed(user, rewards, block.timestamp);
    }

    // ============ TIER MANAGEMENT ============
    
    /**
     * @dev Determine stake tier based on amount
     * @param amount Total staked amount
     * @return tier The corresponding stake tier
     */
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

    /**
     * @dev Calculate pending rewards for a user
     * @param user Address of the user
     * @return rewards Amount of pending rewards
     */
    function _calculateRewards(address user) internal view returns (uint256) {
        if (!stakes[user].isActive || stakes[user].amount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp.sub(stakes[user].lastClaimTime);
        uint256 apyRate = tierInfo[stakes[user].tier].apyRate;
        uint256 annualReward = stakes[user].amount.mul(apyRate).div(BASIS_POINTS);
        uint256 rewards = annualReward.mul(timeStaked).div(365 days);
        
        return rewards;
    }

    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get comprehensive stake information for a user
     * @param user Address of the user
     * @return stakeInfo Complete stake information struct
     */
    function getStakeInfo(address user) external view returns (StakeInfo memory stakeInfo) {
        return stakes[user];
    }

    /**
     * @dev Get pending rewards for a user
     * @param user Address of the user
     * @return rewards Amount of pending rewards
     */
    function getPendingRewards(address user) external view returns (uint256) {
        return _calculateRewards(user);
    }

    /**
     * @dev Get total staked amount across all users
     * @return amount Total staked amount
     */
    function getTotalStaked() external view returns (uint256) {
        return totalStakedAmount;
    }

    /**
     * @dev Get user's staked amount
     * @param user Address of the user
     * @return amount User's staked amount
     */
    function getUserStakedAmount(address user) external view returns (uint256) {
        return stakes[user].amount;
    }

    /**
     * @dev Get tier information
     * @param tier The stake tier
     * @return tierInfo Information about the tier
     */
    function getTierInfo(StakeTier tier) external view returns (TierInfo memory tierInfo) {
        return tierInfo[tier];
    }

    /**
     * @dev Get user's current tier
     * @param user Address of the user
     * @return tier Current stake tier
     */
    function getUserTier(address user) external view returns (StakeTier) {
        return stakes[user].tier;
    }

    /**
     * @dev Get contract statistics
     * @return totalStaked Total amount staked
     * @return totalRewards Total rewards distributed
     * @return totalSupply Current token supply
     * @return maxSupply Maximum token supply
     */
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

    // ============ ADMINISTRATIVE FUNCTIONS ============
    
    /**
     * @dev Pause staking functionality (emergency use)
     */
    function pauseStaking() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause staking functionality
     */
    function unpauseStaking() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Set minimum stake amount
     * @param newMinAmount New minimum stake amount
     */
    function setMinStakeAmount(uint256 newMinAmount) external onlyOwner {
        require(newMinAmount > 0, "Minimum stake must be greater than 0");
        minStakeAmount = newMinAmount;
    }

    /**
     * @dev Set maximum stake amount
     * @param newMaxAmount New maximum stake amount
     */
    function setMaxStakeAmount(uint256 newMaxAmount) external onlyOwner {
        require(newMaxAmount > minStakeAmount, "Max must be greater than min");
        maxStakeAmount = newMaxAmount;
    }

    /**
     * @dev Update tier APY rates
     * @param tier The tier to update
     * @param newApyRate New APY rate in basis points
     */
    function updateTierApy(StakeTier tier, uint256 newApyRate) external onlyOwner {
        require(newApyRate <= 5000, "APY cannot exceed 50%"); // Max 50%
        tierInfo[tier].apyRate = newApyRate;
    }

    /**
     * @dev Blacklist/unblacklist an address
     * @param account Address to blacklist/unblacklist
     * @param isBlacklisted Whether to blacklist or unblacklist
     */
    function setBlacklist(address account, bool isBlacklisted) external onlyOwner {
        blacklisted[account] = isBlacklisted;
        emit BlacklistUpdated(account, isBlacklisted);
    }

    /**
     * @dev Emergency withdraw function (owner only)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient contract balance");
        _transfer(address(this), owner(), amount);
        emit EmergencyWithdraw(owner(), amount);
    }

    // ============ OVERRIDE FUNCTIONS ============
    
    /**
     * @dev Override transfer to prevent blacklisted addresses from receiving tokens
     */
    function _update(address from, address to, uint256 value) internal override {
        require(!blacklisted[from] && !blacklisted[to], "Blacklisted address");
        super._update(from, to, value);
    }

    /**
     * @dev Override to prevent transfers when paused
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused() || from == address(0) || to == address(0), "Transfers paused");
    }
}
