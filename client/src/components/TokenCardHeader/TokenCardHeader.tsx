import { useEnsLookup } from "wagmi"
import twitter from "../../img/twitter.svg"
import { truncateAddress } from "../../utilities"
import { AddressTypeTag } from "../AddressTypeTag/AddressTypeTag"
import { AddressType } from "../TokenCard/TokenCard"
import style from "./TokenCardHeader.module.css"

interface ITokenCardHeaderProps {
  address?: string
  addressType: AddressType
  onTwitterShare: () => void
}
const copyAddress = (address: string | undefined) => {
  if (address) {
    navigator.clipboard.writeText(address)
  }
}
export const TokenCardHeader = ({ address, addressType, onTwitterShare }: ITokenCardHeaderProps) => {
  const [{ data: ensName }] = useEnsLookup({ address })

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h1 onClick={() => copyAddress(address)} title={address} style={{ display: "inline-block", cursor: "copy" }}>
          {ensName ? ensName : address ? truncateAddress(address) : ""}
        </h1>
        <AddressTypeTag addressType={addressType} />
        <button className={style.twitterButton} onClick={onTwitterShare}>
          <img src={twitter} alt="Twitter"></img>
        </button>
      </div>
    </div>
  )
}
