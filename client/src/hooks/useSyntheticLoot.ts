import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import deployments from "../deployments.json";
import { SyntheticLoot } from "../../../backend/types";
import { useContract } from "wagmi";

export const useSyntheticLoot = (signerOrProvider: Signer | Provider) => {
  return useContract<SyntheticLoot>({
    addressOrName: deployments.contracts.SyntheticLoot.address,
    contractInterface: deployments.contracts.SyntheticLoot.abi,
    signerOrProvider,
  });
};
