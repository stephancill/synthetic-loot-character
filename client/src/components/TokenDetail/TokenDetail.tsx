import { BaseProvider } from "@ethersproject/providers"
import { ContractCallContext, ContractCallResults, Multicall } from "ethereum-multicall"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { SpinnerCircular } from "spinners-react"
import { useProvider } from "wagmi"
import deployments from "../../deployments.json"
import { Token } from "../Token/Token"
import { getImageData, ICharacter } from "./helpers"
import style from "./TokenDetail.module.css"
interface ITokenDetailProps {
  address: string
}

async function getCharacter(address: string, provider: BaseProvider) {
  const multicall = new Multicall({
    ethersProvider: provider,
    tryAggregate: true,
  })
  const { abi, address: contractAddress } = deployments.contracts.SyntheticLoot
  const componentNames = ["head", "neck", "chest", "hand", "ring", "waist", "weapon", "foot"]
  const contractCallContext: ContractCallContext[] = [
    {
      reference: "names",
      contractAddress,
      abi: abi,
      // Convert to title case
      calls: componentNames.map((item) => {
        const methodName = `get${item[0].toUpperCase()}${item.slice(1)}`
        return {
          reference: item,
          methodName,
          methodParameters: [address],
        }
      }),
    },
    {
      reference: "components",
      contractAddress,
      abi: abi,
      // Convert to title case
      calls: componentNames.map((item) => {
        const methodName = `${item}Components`
        return {
          reference: item,
          methodName,
          methodParameters: [address],
        }
      }),
    },
  ]

  const results: ContractCallResults = await multicall.call(contractCallContext)

  let components = {}
  results.results.components.callsReturnContext.forEach(
    (item) => (components = { ...components, [item.reference]: BigNumber.from(item.returnValues[0]).toNumber() }),
  )

  let names = {}
  results.results.names.callsReturnContext.forEach(
    (item) => (names = { ...names, [item.reference]: item.returnValues[0] }),
  )

  return { components: components as ICharacter, names: Object.values(names) as string[] }
}

export const TokenDetail = ({ address }: ITokenDetailProps) => {
  const provider = useProvider()

  const [itemNames, setItemNames] = useState<string[]>()
  const [imageData, setImageData] = useState<string>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getCharacter(address, provider).then(({ components, names }) => {
      setLoading(false)
      setItemNames(names)
      setImageData(getImageData(components))
    })
    // eslint-disable-next-line
  }, [address])

  return (
    <div style={{ minHeight: "560px", display: "flex", justifyContent: "center" }}>
      {loading ? (
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <SpinnerCircular enabled={true} color="white" />
        </div>
      ) : (
        <div>
          <Token imageData={imageData!}></Token>
          <h1>Items</h1>
          <div className={style.attributesContainer}>
            {itemNames?.map((itemName, i) => {
              return (
                <div key={i} className={style.atrribute}>
                  {itemName}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
