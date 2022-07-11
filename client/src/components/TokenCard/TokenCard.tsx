import { useAccount, useContractRead, useContractWrite, useProvider, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { TokenDetail } from "../TokenDetail/TokenDetail"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { ClaimButton } from "../ClaimButton/ClaimButton"
import { BigNumber, ethers, Wallet } from "ethers"
import { Search } from "../Search/Search"
import { useLocation } from "react-router-dom"
import { TokenCardHeader } from "../TokenCardHeader/TokenCardHeader"
import dice from "../../img/dice.svg"
import style from "./TokenCard.module.css"
import { useSyntheticLootCharacter } from "../../hooks/useSyntheticLootCharacter"

const { isAddress, getAddress } = ethers.utils

const claimMessageHash = "0xdf82b3b8802b972d13d60623a6690febbca6142a008135b45c421dd951612158"

export enum AddressType {
  Search,
  Signer,
  Random,
  Owner,
}

export const TokenCard = () => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  const [{ data: account }] = useAccount()
  const [randomWallet, setRandomWallet] = useState<Wallet | undefined>()
  const { address: rawAddress } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const address = rawAddress
    ? isAddress(rawAddress.toLowerCase())
      ? getAddress(rawAddress.toLowerCase())
      : undefined
    : undefined

  const syntheticLoot = useSyntheticLootCharacter(signer || provider)
  const syntheticLootConfig = useContractAdapter(syntheticLoot)

  const [currentTx, setCurrentTx] = useState<ethers.providers.TransactionResponse | undefined>()

  const [{ data: tokenClaimed }, readTokenClaimed] = useContractRead(syntheticLootConfig, "claimed", {
    args: [address],
  })

  const [{ data: tokenId }, readTokenId] = useContractRead(syntheticLootConfig, "getTokenID", { args: [address] })

  const [{ data: claimPrice }] = useContractRead(syntheticLootConfig, "claimPrice")

  const [{ data: ownerAddress }, readOwnerAddress] = useContractRead(syntheticLootConfig, "ownerOf", {
    args: [tokenId],
  })

  const [, claim] = useContractWrite(syntheticLootConfig, "claim", { overrides: { value: claimPrice } })

  const [, claimOther] = useContractWrite(syntheticLootConfig, "claimOther")

  const signerCanClaim = address === account?.address || address === randomWallet?.address
  const addressType =
    account?.address && account?.address === (ownerAddress as any as string)
      ? AddressType.Owner
      : randomWallet?.address === address
      ? AddressType.Random
      : account?.address === address
      ? AddressType.Signer
      : AddressType.Search

  useEffect(() => {
    readTokenId()
    // eslint-disable-next-line
  }, [address, currentTx, provider])

  useEffect(() => {
    readTokenClaimed()
    readOwnerAddress()
    // eslint-disable-next-line
  }, [tokenId])

  useEffect(() => {
    if (!signer) {
      setRandomWallet(undefined)
    }
  }, [signer])

  useEffect(() => {
    if (currentTx) {
      console.log("new tx", currentTx.hash)
      currentTx.wait().then(() => {
        setCurrentTx(undefined)
      })
      console.log("tx done")
    }
  }, [currentTx])

  useEffect(() => {
    console.log(
      "claimPrice changed",
      claimPrice ? ethers.utils.formatEther(claimPrice as any as BigNumber) : claimPrice,
    )
  }, [claimPrice])

  const onClaim = () => {
    claim().then(({ data: tx }) => setCurrentTx(tx))
  }

  const onClaimRandom = () => {
    if (!randomWallet) {
      return
    }

    randomWallet.signMessage(ethers.utils.arrayify(claimMessageHash)).then((signature) => {
      claimOther({ args: [randomWallet.address, signature], overrides: { value: claimPrice } }).then(({ data: tx }) =>
        setCurrentTx(tx),
      )
    })
  }

  const onGenerateRandom = () => {
    const wallet = ethers.Wallet.createRandom()
    setRandomWallet(wallet)
    console.log("navigating to ", wallet.address)
    navigate({ pathname: `/address/${wallet.address}` })
  }

  const onSearch = (checksummedAddress: string) => {
    if (checksummedAddress !== address) {
      setRandomWallet(undefined)
      navigate({ pathname: `/address/${checksummedAddress}` })
    }
  }

  const onTwitterShare = () => {
    // TODO: Update this
    const tweet = encodeURIComponent(`Check out my Synthetic Loot! @stephancill`)
    const ctaURL = encodeURIComponent(`${window.location.href}`)
    const related = encodeURIComponent(`stephancill,lootproject`)
    const intentBaseURL = `https://twitter.com/intent/tweet`
    const intentURL = `${intentBaseURL}?text=${tweet}&url=${ctaURL}&related=${related}`
    window.open(intentURL, "_blank")
  }

  return (
    <div style={{ width: "90%", maxWidth: "400px" }}>
      <div style={{ display: "flex", marginBottom: "30px", height: "50px" }}>
        <Search onSearch={onSearch} />
        {signer && (
          <button className={style.randomButton} onClick={() => onGenerateRandom()}>
            <img src={dice} alt="Random" />
          </button>
        )}
      </div>
      <div className={style.tokenCard}>
        <div className={style.tokenCardContent}>
          <TokenCardHeader
            address={address}
            addressType={addressType}
            ownerAddress={ownerAddress as any as string}
            onTwitterShare={onTwitterShare}
          />
          {address && (
            <div>
              <TokenDetail address={address}></TokenDetail>
              {provider && !(!tokenClaimed && !signerCanClaim) && (
                <div style={{ paddingBottom: "6px", marginTop: "20px" }}>
                  <ClaimButton
                    address={address}
                    claimPrice={claimPrice ? (claimPrice as any as BigNumber) : undefined}
                    isRandom={randomWallet !== undefined}
                    signerCanClaim={signerCanClaim}
                    claimed={tokenClaimed as any as boolean}
                    tokenId={tokenId as any as BigNumber}
                    txHash={currentTx?.hash}
                    onClaim={onClaim}
                    onClaimOther={onClaimRandom}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
