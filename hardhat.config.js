require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    apothem: {
      url: `https://rpc.apothem.network`,
      accounts: [privateKey],
    },
    // mumbai: {
    //   url: `https://rpc-mumbai.maticvigil.com`,
    //   accounts: [privateKey],
    // },
  },
  solidity: "0.8.9",
};
