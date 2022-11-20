import allSettled from "promise.allsettled";
import { TOKEN_SYMBOLS } from "../configs/bcNetworks";
import { ChainWallet } from "../data/database/entities/chainWallet";
import { NETWORKS, NETWORK_ENVIRONMENT_ENUM } from "../enum/bcEnum";
import { getEthereumBalance } from "../hooks/useEvm";
import { getNearBalance } from "../hooks/useNEAR";
import { getSolanaBalance } from "../hooks/useSolana";

/**
 *  author: l1ttps
 *  auto generate network others
 * @param currentList  current list network
 * @param netWorkEnable  list network enable
 * @returns {Promise<ChainWallet[]>} list network
 */

const updateBalanceForWallet = async (
  currentList: ChainWallet[],
  netWorkEnable: string[],
  env: NETWORK_ENVIRONMENT_ENUM
): Promise<ChainWallet[]> => {
  /**
   * get list network enable and Promise get balance for  network
   */
  const _newListNetworks = netWorkEnable.map((network: NETWORKS) => {
    if (network === NETWORKS.SOLANA) {
      const data = currentList.find((item) => item.network === network);
      return { data, getBalance: getSolanaBalance(data.currentAddress, env) };
    } else if (network === NETWORKS.NEAR) {
      const data = currentList.find((item) => item.network === network);
      return {
        data,
        getBalance: getNearBalance(data.currentAddress, env),
      };
    } else {
      const data = currentList.find(
        (item) => item.network === NETWORKS.ETHEREUM
      );
      const symbol = TOKEN_SYMBOLS[network];
      return {
        data: { ...data, symbol, network },
        getBalance: getEthereumBalance(data.currentAddress, network, env),
      };
    }
  });

  /**
   * Get blance for all chain network by Promise allSettled
   */
  const _balanceChains = (await allSettled(
    _newListNetworks.map((chain) => {
      return chain?.getBalance;
    })
  )) as any;
  /**
   * Merge data chain network and balance
   */
  const chains: ChainWallet[] = _newListNetworks.map((chain, index) => {
    if (_balanceChains[index].status === "fulfilled") {
      return {
        ...chain.data,
        balance: +_balanceChains[index]?.value?.balance,
      };
    } else if (chain.data?.balance !== null) {
      return {
        ...chain.data,
      };
    }

    return { ...chain.data, balance: null };
  });
  return chains;
};

export default updateBalanceForWallet;
