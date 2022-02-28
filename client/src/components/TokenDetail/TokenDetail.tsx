import { Token } from "../Token/Token"
import { useEffect, useState } from "react"
import { useContractRead, useProvider, useSigner } from "wagmi"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { SpinnerCircular } from "spinners-react"

import style from "./TokenDetail.module.css"
import { useSyntheticLootCharacter } from "../../hooks/useSyntheticLootCharacter"

interface ITokenDetailProps {
  address: string
}

export const TokenDetail = ({address}: ITokenDetailProps) => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  
  const syntheticLoot = useSyntheticLootCharacter(signer || provider)
  const syntheticLootConfig = useContractAdapter(syntheticLoot)

  const [{ data: tokenURI, loading: tokenURILoading, error: tokenURIError }, readTokenURI] = useContractRead(
    syntheticLootConfig,
    '_tokenURI',
    {args: [address]}
  ) 

  const [{ data: itemNames, loading: itemsLoading, error: itemsError }, readItems] = useContractRead(
    syntheticLootConfig,
    'getItems',
    {args: [address]}
  ) 

  const [imageData, setImageData] = useState<string | undefined>()
  useEffect(() => {
    if (tokenURI) {
      console.log(address)
      setImageData((JSON.parse(atob(tokenURI.split(",")[1])) as any).image)
    }
  // eslint-disable-next-line
  }, [tokenURI])

  useEffect(() => {
    readTokenURI()
    readItems()
    // eslint-disable-next-line
  }, [address])

  const loading = itemsLoading || tokenURILoading
  const error = tokenURIError || itemsError
  
  if (error) {
    return <div>
      {error.message}
    </div>
  }
  
  return (
    <div style={{minHeight: "560px", display: "flex", justifyContent: "center"}}>
      {loading 
      ? 
        <div style={{marginTop: "auto", marginBottom: "auto"}}>
          <SpinnerCircular enabled={true} color="white" />
        </div>
      :  
        <div>
          <Token imageData={imageData!}></Token>
          <h1>Items</h1>
          <div className={style.attributesContainer}>
            {itemNames?.map((itemName, i) => {
              return <div key={i} className={style.atrribute }>{itemName}</div>
            })}
          </div>
        </div> 
      }
    </div>
  )
}