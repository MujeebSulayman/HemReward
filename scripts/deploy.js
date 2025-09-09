const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying NECTR Token with the account:", deployer.address);
  try {
    console.log(
      "Account balance:",
      (await ethers.provider.getBalance(deployer.address)).toString()
    );

    const NECTR = await ethers.getContractFactory("NECTR");

    console.log("Deploying NECTR Token contract...");
    const nectr = await NECTR.deploy();

    console.log("Waiting for deployment...");
    await nectr.waitForDeployment();

    const nectrAddress = await nectr.getAddress();
    console.log("NECTR Token deployed to:", nectrAddress);

    // Verify deployment
    const totalSupply = await nectr.totalSupply();
    const maxSupply = await nectr.maxSupply();
    const stakingRewardRate = await nectr.stakingRewardRate();
    
    console.log("Total Supply:", ethers.formatEther(totalSupply));
    console.log("Max Supply:", ethers.formatEther(maxSupply));
    console.log("Staking Reward Rate:", stakingRewardRate.toString(), "%");

    const fs = require("fs");
    const contractsDir = __dirname + "/../contracts";

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
      contractsDir + "/contractAddress.json",
      JSON.stringify(
        {
          NECTR: nectrAddress,
          network: "sepolia",
          chainId: 11155111,
        },
        undefined,
        2
      )
    );

    console.log("Contract address saved to contracts/contractAddress.json");
  } catch (error) {
    console.log("Deployment failed");
    console.error("error:", error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
