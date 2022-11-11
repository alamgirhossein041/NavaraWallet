import { useRecoilState, useSetRecoilState } from "recoil";
import { idWalletSelected, listWalletsState } from ".";
import { Wallet } from "../../database/entities/wallet";
import useDatabase from "../../database/useDatabase";

interface IWalletsActions {
  /**
   * return list wallet
   */
  get: () => Wallet[];
  /**
   * remove an wallet from array state, local database
   * @param id: id of wallet to remove
   */
  remove: (id: string) => Promise<void>;
  /**
   * get index of wallet by createdAt
   */
  createdIndex: (id: string) => number;
}

const useWalletsActions = (): IWalletsActions => {
  const [wallets, setWallets] = useRecoilState(listWalletsState);
  const { walletController } = useDatabase();
  const setIdWalletSelected = useSetRecoilState(idWalletSelected);
  const actions = {
    get: () => {
      return wallets;
    },
    remove: async (id: string): Promise<void> => {
      await walletController.removeWallet(id);
      const removedWallet = wallets.filter((wallet) => wallet.id !== id);
      setWallets(removedWallet);

      // Set default wallet selected index = 0 (first)
      setIdWalletSelected(0);
    },

    createdIndex: (id: string) => {
      const sorted = [...wallets].sort(
        (a, b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt))
      );

      const index = sorted.findIndex((wallet) => wallet.id === id);
      return index;
    },
  };
  return actions;
};

export default useWalletsActions;
