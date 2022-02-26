import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import readline from "readline"

function userInput(query: string): Promise<string> {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
  }))
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, network} = hre
  const {deploy} = deployments

  const SyntheticLoot = await deployments.get("SyntheticLoot")
  const SyntheticLootCharacterAssets = await deployments.get("SyntheticLootCharacterAssets")

  const {deployer} = await getNamedAccounts()

  const debug = network.name === "hardhat"
  const isMainnet = network.name == "mainnet"

  const name = isMainnet ? "Synthetic Loot Character" : "Secret Project"
  const symbol = isMainnet ? "sLOOTCHARACTER" : "sPROJECT"
  
  // TODO: Withdrawal address
  if (!debug) {
    const confirmation = await userInput(`
      Confirm name: ${name}\n
      Confirm symbol: ${symbol}\n
      Confirm deployer address: ${deployer}\n
      Confirm assets address: ${SyntheticLootCharacterAssets.address}\n
      \n'y' to continue, ENTER to cancel\n`
    )
    if (confirmation.toLowerCase() !== "y") {
      throw new Error("User denied deployment details");
    }
  }

  await deploy("SyntheticLootCharacter", {
    from: deployer,
    log: true,
    args: ["Synthetic Loot Character", "sLOOTCHARACTER", SyntheticLoot.address, SyntheticLootCharacterAssets.address],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.dependencies = ["SyntheticLoot", "SyntheticLootCharacterAssets"]
func.tags = ["SyntheticLootCharacter"]