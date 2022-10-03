import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
/** @type import('hardhat/config').HardhatUserConfig */
dotenv.config({path: __dirname + '/.env'})
module.exports = {
  solidity: "0.8.17",
  networks: {
    bsctest: {
      url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
      accounts: [process.env.PRIV_KEY]
    }
    
  },
  etherscan:{
    apiKey: process.env.API_KEY
  }

};
