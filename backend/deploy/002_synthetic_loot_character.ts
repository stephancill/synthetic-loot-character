import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre
  const {deploy} = deployments

  const SyntheticLoot = await deployments.get("SyntheticLoot")

  const {deployer} = await getNamedAccounts()

  await deploy("SyntheticLootCharacter", {
    from: deployer,
    log: true,
    args: ["Synthetic Loot Character", "sLOOTCHARACTER", SyntheticLoot.address, ["https://ipfs.io/ipfs/"]],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.dependencies = ["SyntheticLoot"]
func.tags = ["SyntheticLootCharacter"]