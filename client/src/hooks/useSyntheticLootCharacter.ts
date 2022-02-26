import { Signer } from 'ethers'
import { Provider } from '@ethersproject/providers'
import deployments from "../deployments.json"
import { SyntheticLootCharacter } from "../../../backend/types"
import { useContract } from "wagmi"

export const useSyntheticLootCharacter = (signerOrProvider: Signer | Provider) => {
  return useContract<SyntheticLootCharacter>({
    addressOrName: deployments.contracts.SyntheticLootCharacter.address,
    contractInterface: deployments.contracts.SyntheticLootCharacter.abi,
    signerOrProvider
  })
}