import { Punk } from "../Punk/Punk"
import { useEffect, useState } from "react"
import { useContractRead, useProvider, useSigner } from "wagmi"
import { useContractAdapter } from "../../hooks/useContractAdapter"
import { SpinnerCircular } from "spinners-react"

import style from "./PunkDetail.module.css"
import { useSyntheticLootCharacter } from "../../hooks/useSyntheticLootCharacter"

interface IPunkDetailProps {
  address: string
}

export const PunkDetail = ({address}: IPunkDetailProps) => {
  const provider = useProvider()
  const [{ data: signer }] = useSigner()
  
  const syntheticPunks = useSyntheticLootCharacter(signer || provider)
  const syntheticPunksConfig = useContractAdapter(syntheticPunks)

  const [{ data: tokenURI, loading: tokenURILoading, error: tokenURIError }, readTokenURI] = useContractRead(
    syntheticPunksConfig,
    '_tokenURI',
    {args: [address]}
  ) 

  const [{ data: itemNames, loading: itemsLoading, error: itemsError }, readItems] = useContractRead(
    syntheticPunksConfig,
    'getItems',
    {args: [address]}
  ) 

  const [imageData, setImageData] = useState<string | undefined>()
  useEffect(() => {
    if (tokenURI) {
      console.log(address)
      setImageData((JSON.parse(atob(tokenURI.split(",")[1])) as any).image)
    }
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
    <div style={{minHeight: "380px", display: "flex", justifyContent: "center"}}>
      {loading 
      ? 
        <div style={{marginTop: "auto", marginBottom: "auto"}}>
          <SpinnerCircular enabled={true} color="white" />
        </div>
      :  
        <div>
          <Punk imageData={imageData!}></Punk>
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