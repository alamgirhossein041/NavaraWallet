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
  };
  return actions;
};

export default useWalletsActions;
