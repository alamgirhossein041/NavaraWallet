import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { idWalletSelected, listWalletsState } from ".";
import { defaultEnabledNetworks, NETWORKS } from "../../../enum/bcEnum";
import { ENVIRONMENT } from "../../../global.config";
import WalletController from "../../database/controllers/wallet.controller";
import { ChainWallet } from "../../database/entities/chainWallet";
import { Wallet } from "../../database/entities/wallet";
import { walletEnvironmentState } from "../userData";

interface IWalletsActions {
  /**
   * return list wallet
   */
  get: () => Wallet[];
  /**
   * return a wallet by id
   */
  getById: (id: string) => Wallet | null;
  /**
   * remove a wallet from array state, local database
   * @param id: id of wallet to remove
   */
  remove: (id: string) => Promise<void>;
  /**
   * update a wallet from array state, not update local database
   */
  update: (wallet: Wallet) => void;
  /**
   * Only update specific field of wallet from array state
   */
  updateSpecific: (walletId: string, newValue: {}) => void;
  /**
   * update a wallet from globe state and local database
   */
  updateDB: (wallet: Wallet) => Promise<void>;
  /**
   * Only update specific field of wallet from array state and local database
   */
  updateSpecificDB: (walletId: string, newValue: {}) => Promise<void>;
  /**
   * get index of wallet by createdAt
   */
  createdIndex: (walletId: string) => number;
  /**
   * get chain of wallet. If not exist, get from database
   */
  getListChain: (walletId: string) => Promise<ChainWallet[]>;
}

const useWalletsActions = (): IWalletsActions => {
  const [wallets, setWallets] = useRecoilState(listWalletsState);
  const walletController = new WalletController();
  const setIdWalletSelected = useSetRecoilState(idWalletSelected);
  const walletEnvironment = useRecoilValue(walletEnvironmentState);

  const mappingChain = (chains: ChainWallet[]) => {
    return chains.map((chain) => {
      const addressByNetwork =
        walletEnvironment === ENVIRONMENT.PRODUCTION
          ? chain?.address
          : chain?.testnetAddress;
      return {
        ...chain,
        currentAddress: addressByNetwork,
      };
    });
  };

  const actions = {
    get: () => {
      return wallets;
    },
    getById: (id: string) => {
      return wallets.find((wallet) => wallet.id === id) || null;
    },
    remove: async (walletId: string): Promise<void> => {
      await walletController.removeWallet(walletId);
      const removedWallet = wallets.filter((wallet) => wallet.id !== walletId);
      setWallets(removedWallet);

      // Set default wallet selected index = 0 (first)
      setIdWalletSelected(0);
    },

    update: (wallet: Wallet) => {
      const updatedWallet = wallets.map((item) =>
        item.id === wallet.id ? wallet : item
      );
      setWallets(updatedWallet);
    },

    updateSpecific: (walletId: string, newValue: {}) => {
      const updatedWallet = wallets.map((item) =>
        item.id === walletId ? { ...item, ...newValue } : item
      );
      setWallets(updatedWallet);
    },

    updateDB: async (wallet: Wallet): Promise<void> => {
      await walletController.updateWallet(wallet);
      const updatedWallet = wallets.map((item) =>
        item.id === wallet.id ? wallet : item
      );
      setWallets(updatedWallet);
    },

    updateSpecificDB: async (walletId: string, newValue: {}): Promise<void> => {
      await walletController.updateWalletSpecific(walletId, newValue);
      const updatedWallet = wallets.map((item) =>
        item.id === walletId ? { ...item, ...newValue } : item
      );
      setWallets(updatedWallet);
    },

    createdIndex: (walletId: string) => {
      const sorted = [...wallets].sort(
        (a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
      );

      const index = sorted.findIndex((wallet) => wallet.id === walletId);
      return index;
    },

    getListChain: async (walletId: string): Promise<ChainWallet[]> => {
      const wallet = wallets.find((_wallet) => _wallet.id === walletId);
      const chains = wallet?.chains;

      let count = chains.reduce((total, chain) => {
        if (defaultEnabledNetworks.includes(chain.network as NETWORKS)) {
          return total + 1;
        }
      }, 0);

      if (count === defaultEnabledNetworks.length) {
        return mappingChain(chains);
      } else {
        const dbWallet = (await walletController.getWallets()).find(
          (_wallet) => _wallet.id === walletId
        );
        const dbChain = dbWallet?.chains;
        if (dbChain) {
          return mappingChain(dbChain);
        }
      }
    },
  };
  return actions;
};

export default useWalletsActions;
