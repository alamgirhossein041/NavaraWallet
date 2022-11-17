import { atom } from "recoil";

import { Wallet } from "../../database/entities/wallet";
const DefaultValue: Wallet[] = [];
/**
 * Return list wallet from local database
 */

const listWalletsState = atom({
  key: "listWalletsState",
  default: DefaultValue,
});

/**
 * index of wallet seleted
 */
const idWalletSelected = atom({
  key: "idWalletSelected",
  default: 0,
});

/**
 * @return: isLoading of state fetching list wallets from local database
 */
const reloadingWallets = atom({
  default: true,
  key: "reloadingWallets",
});

const numberWalletIncrement = atom({
  key: "numberWalletIncrement",
  default: [],
});

export {
  listWalletsState,
  idWalletSelected,
  reloadingWallets,
  numberWalletIncrement,
};
