import {cloneDeep} from 'lodash';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {Wallet} from '../data/database/entities/wallet';
import useDatabase from '../data/database/useDatabase';
import {
  idWalletSelected,
  listWalletsState,
} from '../data/globalState/listWallets';
import {defaultEnabledNetworks} from '../enum/bcEnum';
import {localStorage, SELECTED_WALLET} from '../utils/storage';

interface IUseWalletSelected {
  index: number | null;
  data: Wallet | null;
  setEnabledNetworks: (array: string[]) => void;
  enabledNetworks: string[];
}

const useWalletSelected = (): IUseWalletSelected => {
  const index = useRecoilValue(idWalletSelected);
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {walletController} = useDatabase();
  const selectedWallet = listWallets[index];

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
          listWallets.map(wallet =>
            wallet.id === newWallet.id ? newWallet : wallet,
          ),
        );
      } catch (error) {
        console.warn("Error updating wallet's enabledNetworks: ", error);
      }
    },
    [listWallets, selectedWallet, setListWallets, walletController],
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
    data: listWallets[index],
    setEnabledNetworks,
    enabledNetworks,
  };
};

export {useWalletSelected};
