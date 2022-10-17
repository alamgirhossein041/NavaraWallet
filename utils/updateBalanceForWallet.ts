import {TOKEN_SYMBOLS} from '../configs/bcNetworks';
import {ChainWallet} from '../data/database/entities/chainWallet';
import {Wallet} from '../data/database/entities/wallet';
import {NETWORKS} from '../enum/bcEnum';
import {getEthereumBalance} from '../hooks/useEvm';
import {getNearBalance} from '../hooks/useNEAR';
import {getSolanaBalance} from '../hooks/useSolana';

/**
 *  author: l1ttps
 *  auto generate network others
 * @param currentList  current list network
 * @param netWorkEnable  list network enable
 * @returns {Promise<ChainWallet[]>} list network
 */

const updateBalanceForWallet = async (
  wallet: Wallet,
  currentList: ChainWallet[],
  netWorkEnable: string[],
): Promise<Wallet> => {
  /**
   * get list network enable and fucntion get balance for  network
   */
  const _newListNetworks = netWorkEnable.map((network: NETWORKS) => {
    if (network === NETWORKS.SOLANA) {
      const data = currentList.find(item => item.network === network);
      return {data, getBalance: getSolanaBalance(data.address)};
    } else if (network === NETWORKS.NEAR) {
      const data = currentList.find(item => item.network === network);
      return {
        data,
        getBalance: getNearBalance(data.address),
      };
    } else {
      const data = currentList.find(item => item.network === NETWORKS.ETHEREUM);
      const symbol = TOKEN_SYMBOLS[network];
      return {
        data: {...data, symbol, network},
        getBalance: getEthereumBalance(data.address, network),
      };
    }
  });

  /**
   * Get blance for all chain network by Promise all
   */
  const _balanceChains = await Promise.all(
    _newListNetworks.map(chain => {
      return chain.getBalance;
    }),
  );

  /**
   * Merge data chain network and balance
   */
  const chains: ChainWallet[] = _newListNetworks.map((chain, index) => {
    return {...chain.data, balance: +_balanceChains[index].balance};
  });

  return {
    ...wallet,
    chains,
  };
};

export default updateBalanceForWallet;
