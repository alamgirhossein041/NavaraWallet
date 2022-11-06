import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Wallet } from "../data/database/entities/wallet";
import useDatabase from "../data/database/useDatabase";
import {
  idWalletSelected,
  listWalletsState,
} from "../data/globalState/listWallets";
import { walletEnvironmentState } from "../data/globalState/userData";
import { defaultEnabledNetworks } from "../enum/bcEnum";
import { ENVIRONMENT } from "../global.config";

export interface IUseWalletSelected {
  index: number | null;
  data: Wallet | null;
  setEnabledNetworks: (array: string[]) => void;
  enabledNetworks: string[];
}
/**
 *
 * @returns get data current wallet selected by idWalletSelected  state
 */
const useWalletSelected = (): IUseWalletSelected => {
  const index = useRecoilValue(idWalletSelected);
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const { walletController } = useDatabase();
  const selectedWalletInstance =
    listWallets[index === listWallets.length ? 0 : index];
  const walletEnvironment = useRecoilValue(walletEnvironmentState);

  const selectedWallet = useMemo(() => {
    const wallet = {
      ...selectedWalletInstance,
      chains: selectedWalletInstance.chains.map((chain) => {
        return {
          ...chain,
          address:
            walletEnvironment === ENVIRONMENT.PRODUCTION
              ? chain?.address
              : chain?.testnetAddress,
        };
      }),
    };
    return wallet;
  }, [selectedWalletInstance, walletEnvironment]);

  const setEnabledNetworks = useCallback(
    (array: string[]) => {
      try {
        const newWallet = {
          ...selectedWallet,
          enabledNetworks: JSON.stringify(array),
        };

        walletController.updateWalletSpecific(selectedWallet.id, {
          enabledNetworks: JSON.stringify(array),
        });
        setListWallets(
          listWallets.map((wallet) =>
            wallet.id === newWallet.id ? newWallet : wallet
          )
        );
      } catch (error) {
        console.warn("Error updating wallet's enabledNetworks: ", error);
      }
    },
    [listWallets, selectedWallet, setListWallets, walletController]
  );

  const enabledNetworks = useMemo((): Array<string> => {
    if (selectedWallet) {
      const _enabledNetworks = JSON.parse(selectedWallet.enabledNetworks);
      if (_enabledNetworks) {
        return _enabledNetworks;
      } else {
        setEnabledNetworks(defaultEnabledNetworks);
        return defaultEnabledNetworks;
      }
    }
    return defaultEnabledNetworks;
  }, [selectedWallet, setEnabledNetworks]);

  return {
    index,
    data: selectedWallet,
    setEnabledNetworks,
    enabledNetworks,
  };
};

export { useWalletSelected };
