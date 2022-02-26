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

  it("should set the price to 0.02 eth", async function () {
    const claimPrice = await syntheticLootCharacter.claimPrice()
    expect(claimPrice).to.equal(ethers.utils.parseUnits("0.02", "ether"))
  })

  it("should let a user claim", async function () {
    const user = signers[2]
    const claimPrice = await syntheticLootCharacter.claimPrice()
    const tx = await syntheticLootCharacter.connect(user).claim({value: claimPrice})
    const txResult = await tx.wait()
    expect(txResult.events?.length).to.equal(1)

    const transferEvent = txResult.events![0]
    expect(transferEvent.event).to.equal("Transfer")
    expect(transferEvent.args![0]).to.equal(ethers.constants.AddressZero)
    expect(transferEvent.args![1]).to.equal(user.address)

    const claimed = await syntheticLootCharacter.claimed(user.address)
    expect(claimed).to.be.true
  })

  it("should let a user claim to a different account", async function() {
    const user = signers[2]

    const otherWallet = ethers.Wallet.createRandom()
    const message = await syntheticLootCharacter.claimMessage()
    const messageHash = await syntheticLootCharacter.getMessageHash(message)
    console.log(messageHash)
    const signature = await otherWallet.signMessage(ethers.utils.arrayify(messageHash))

    const claimPrice = await syntheticLootCharacter.claimPrice()
    const tx = await syntheticLootCharacter.connect(user).claimOther(otherWallet.address, signature ,{value: claimPrice})
    const txResult = await tx.wait()
    expect(txResult.events?.length).to.equal(1)

    const transferEvent = txResult.events![0]
    expect(transferEvent.event).to.equal("Transfer")
    expect(transferEvent.args![0]).to.equal(ethers.constants.AddressZero)
    expect(transferEvent.args![1]).to.equal(user.address, "Transferred to incorrect address")

    const userBalance = await syntheticLootCharacter.balanceOf(user.address)
    expect(userBalance).to.equal(1)

    const otherWalletBalance = await syntheticLootCharacter.balanceOf(otherWallet.address)
    expect(otherWalletBalance).to.equal(0)

    const otherUserClaimed = await syntheticLootCharacter.claimed(otherWallet.address)
    expect(otherUserClaimed).to.be.true

    const claimed = await syntheticLootCharacter.claimed(user.address)
    expect(claimed).to.be.false
  })

  it("should reject claims with insufficient value", async function() {
    const user = signers[2]
    const claimPrice = await syntheticLootCharacter.claimPrice()
    const tx = syntheticLootCharacter.connect(user).claim({value: claimPrice.div("2")})
    expect(tx).to.be.revertedWith("Insufficient payment")
  })

  it("should give refunds for payments that exceed claimPrice", async function() {
    let user = signers[3]
    const claimPrice = await syntheticLootCharacter.claimPrice()
    const balanceBefore = await user.getBalance()
    await syntheticLootCharacter.connect(user).claim({value: claimPrice.mul("2")})
    const balanceAfter = await user.getBalance()

    expect(balanceAfter).to.be.gte(balanceBefore.sub(claimPrice.mul("2")))
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
