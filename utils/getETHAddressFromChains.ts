import { ChainWallet } from "../data/database/entities/chainWallet";
import { NETWORKS } from "../enum/bcEnum";

const getETHAddressFromChains = (chains: ChainWallet[]) => {
  return (
    chains.find((chain) => chain.network === NETWORKS.ETHEREUM).address || null
  );
};

export default getETHAddressFromChains;
