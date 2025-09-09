// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NECTR is ERC20, Ownable, ReentrancyGuard {
    // Staking structures
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 rewardRate;
    }

    // State variables
    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public stakingRewards;
    mapping(address => uint256) public totalStaked;
    
    uint256 public maxSupply = 1000000000 * 10**18; // 1 billion tokens
    uint256 public stakingRewardRate = 10; // 10% APY
    uint256 public constant REWARD_DIVISOR = 10000; // For percentage calculations
    uint256 public totalStakedAmount;
    
    // Events
    event TokensStaked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("NECTR Token", "NECTR") Ownable(msg.sender) {
        // Mint initial supply to owner
        _mint(msg.sender, 100000000 * 10**18); // 100 million tokens
    }

    // Minting function (owner only)
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    // Staking functions
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update stake info
        stakes[msg.sender] = StakeInfo({
            amount: stakes[msg.sender].amount + amount,
            timestamp: block.timestamp,
            rewardRate: stakingRewardRate
        });
        
        totalStaked[msg.sender] += amount;
        totalStakedAmount += amount;
        
        emit TokensStaked(msg.sender, amount, block.timestamp);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stakes[msg.sender].amount >= amount, "Insufficient staked amount");
        
        // Calculate and claim rewards
        uint256 rewards = _calculateRewards(msg.sender);
        if (rewards > 0) {
            stakingRewards[msg.sender] += rewards;
        }
        
        // Update stake info
        stakes[msg.sender].amount -= amount;
        totalStaked[msg.sender] -= amount;
        totalStakedAmount -= amount;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount, rewards);
    }

    function claimRewards() external nonReentrant {
        require(stakes[msg.sender].amount > 0, "No staked tokens");
        
        uint256 rewards = _calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
        
        // Reset stake timestamp
        stakes[msg.sender].timestamp = block.timestamp;
        
        // Mint reward tokens
        _mint(msg.sender, rewards);
        stakingRewards[msg.sender] += rewards;
        
        emit RewardsClaimed(msg.sender, rewards);
    }

    // Internal function to calculate rewards
    function _calculateRewards(address user) internal view returns (uint256) {
        if (stakes[user].amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - stakes[user].timestamp;
        uint256 annualReward = (stakes[user].amount * stakes[user].rewardRate) / REWARD_DIVISOR;
        uint256 rewards = (annualReward * timeStaked) / 365 days;
        
        return rewards;
    }

    // Internal function to claim rewards (used in stake function)
    function _claimRewards() internal {
        uint256 rewards = _calculateRewards(msg.sender);
        if (rewards > 0) {
            stakes[msg.sender].timestamp = block.timestamp;
            _mint(msg.sender, rewards);
            stakingRewards[msg.sender] += rewards;
            emit RewardsClaimed(msg.sender, rewards);
        }
    }

    // View functions
    function getStakeInfo(address user) external view returns (uint256 amount, uint256 timestamp, uint256 rewardRate) {
        return (stakes[user].amount, stakes[user].timestamp, stakes[user].rewardRate);
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

    // Owner functions
    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Rate cannot exceed 10%"); // Max 10%
        stakingRewardRate = newRate;
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= totalSupply(), "New max supply must be >= current supply");
        maxSupply = newMaxSupply;
    }
}
