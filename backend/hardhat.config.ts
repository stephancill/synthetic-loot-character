import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import "hardhat-preprocessor"
import dotenv from "dotenv"
import spritesheets from "./lib/image-data.json"
import { HardhatNetworkUserConfig } from "hardhat/types"
dotenv.config()

const SOLIDITY_CONSTANTS: {[key: string]: string} = {}
Object.keys(spritesheets).forEach(key => {
  SOLIDITY_CONSTANTS[key] = `string public constant ${key} = "${(spritesheets as any)[key]}";`
})
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

let hardhatNetwork: HardhatNetworkUserConfig = {}

if (process.env.FORK) {
  if (process.env.FORK === "mainnet") {
    console.log("forking mainnet")
    hardhatNetwork = {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      }
    }
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.12",
  networks: {
    hardhat: hardhatNetwork,
    rinkeby: {
      chainId: 4,
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.DEFAULT_DEPLOYER_KEY!],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY!
        }
      }
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.DEFAULT_DEPLOYER_KEY!],
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  preprocess: {
    eachLine: (hre) => ({
      transform: (line) => line.indexOf("// PREPROCESS CONSTANT: ") > -1 ? SOLIDITY_CONSTANTS[line.split("// PREPROCESS CONSTANT: ")[1]] : line
    })
  }
}

export default config
