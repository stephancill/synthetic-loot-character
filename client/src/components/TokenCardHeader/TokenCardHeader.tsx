import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { AddressType } from "../TokenCard/TokenCard"
import twitter from "../../img/twitter.svg"
import style from "./TokenCardHeader.module.css"
import { truncateAddress } from "../../utilities"
import { useEnsLookup } from "wagmi"
import { isAddress } from "ethers/lib/utils"
import { ethers } from "ethers"

interface ITokenCardHeaderProps {
  address?: string
  addressType: AddressType
  ownerAddress?: string
  onTwitterShare: () => void
}
const copyAddress = (address: string | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address);
  }
}
export const TokenCardHeader = ({address, addressType, ownerAddress, onTwitterShare}: ITokenCardHeaderProps) => {
  const [{ data: ensName }] = useEnsLookup({address})
  const [{ data: ownerEnsName }] = useEnsLookup({address: ownerAddress})

  return <div>
    <div style={{display: "flex"}}>
      
      <h1  onClick={()=> copyAddress(address)} title={address} style={{display: "inline-block",cursor:"copy"}}>{ensName ? ensName : address ? truncateAddress(address) : ""}</h1>
      <AddressTypeTag addressType={addressType} />
      <button className={style.twitterButton} onClick={onTwitterShare} ><img src={twitter} alt="Twitter"></img></button>
    </div>
    {ownerAddress && isAddress(ownerAddress) && ethers.constants.AddressZero !== ownerAddress &&
      <p title={ownerAddress} onClick={()=> copyAddress(address)} style={{cursor:"copy"}}>Owned by {ownerEnsName ? ownerEnsName : truncateAddress(ownerAddress)}</p>
    }
  </div> 
}