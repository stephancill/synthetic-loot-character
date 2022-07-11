import { ethers, Wallet } from "ethers"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useLocation } from "react-router-dom"
import { useAccount, useProvider, useSigner } from "wagmi"
import dice from "../../img/dice.svg"
import { Search } from "../Search/Search"
import { TokenCardHeader } from "../TokenCardHeader/TokenCardHeader"
import { TokenDetail } from "../TokenDetail/TokenDetail"
import style from "./TokenCard.module.css"

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

  const addressType =
    account?.address && randomWallet?.address === address
      ? AddressType.Random
      : account?.address === address
      ? AddressType.Signer
      : AddressType.Search

  useEffect(() => {
    if (!signer) {
      setRandomWallet(undefined)
    }
  }, [signer])

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
          <TokenCardHeader address={address} addressType={addressType} onTwitterShare={onTwitterShare} />
          {address && (
            <div>
              <TokenDetail address={address}></TokenDetail>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
