import { ethers, deployments } from "hardhat"
import { SyntheticLootCharacter, SyntheticLootCharacter__factory } from "../types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import isSVG from "is-svg"

describe("SyntheticLootCharacter", function () {
  let signers: SignerWithAddress[]
  let syntheticLootCharacter: SyntheticLootCharacter

  beforeEach(async function () {
    signers = await ethers.getSigners()
    await deployments.fixture(["SyntheticLootCharacter"])
    const SLC = await deployments.get("SyntheticLootCharacter")
    syntheticLootCharacter = await ethers.getContractAt("SyntheticLootCharacter", SLC.address, signers[0]) as SyntheticLootCharacter
  })

  it("Should store render order", async function () {
    const lastItem = await syntheticLootCharacter.renderOrder(7)
    expect(lastItem).to.equal("ring")
  })

  it("should return valid tokenURI", async function () {
    const uri = await syntheticLootCharacter._tokenURI(signers[1].address)
    expect(uri).to.not.equal(undefined)
    // console.log(atob(uri.split(",")[1]))
    const metadata = JSON.parse(atob(uri.split(",")[1]))
    // console.log(metadata.image);
    ;["name", "description", "image"].forEach(key => expect(Object.keys(metadata)).to.contain(key))

    const userAddress = signers[1].address.toLowerCase()
    expect(metadata.name).to.contain(userAddress)

    const svg = atob(metadata.image.split(",")[1])
    console.log(metadata.image)
    expect(isSVG(svg)).to.be.true
  })
})
