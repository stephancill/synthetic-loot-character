import { ethers, deployments } from "hardhat"
import { SyntheticLootCharacter, SyntheticLootCharacter__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"

describe("SyntheticLootCharacter", function () {
  let signers: SignerWithAddress[]
  let syntheticLootCharacter: SyntheticLootCharacter

  beforeEach(async function () {
    signers = await ethers.getSigners()
    await deployments.fixture(["SyntheticLootCharacter"])
    const SLC = await deployments.get("SyntheticLootCharacter")
    // TODO: get contract from SLC
    await syntheticLootCharacter.deployed()
  })

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter")
    const greeter = await Greeter.deploy("Hello, world!")
    await greeter.deployed()

    expect(await greeter.greet()).to.equal("Hello, world!")

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!")

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await greeter.greet()).to.equal("Hola, mundo!")
  })
})
