// Import necessary modules
const hre = require('hardhat'); // Hardhat for Ethereum development
const fs = require('fs'); // File system module for writing to files

// Define an asynchronous function called 'main' for deploying the smart contract
async function main() {
  // Get the contract factory for the 'NFTMarketplace' smart contract
  const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');

  // Deploy the 'NFTMarketplace' smart contract
  const nftMarketplace = await NFTMarketplace.deploy();

  // Wait for the deployment to complete and confirm that it's deployed
  await nftMarketplace.deployed();
  console.log('NFTMarketplace deployed to:', nftMarketplace.address);

  // Write the contract's address to a configuration file
  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `);
}

// Call the 'main' function and handle any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1; // Set the process exit code to 1 in case of an error
});
