import {atom} from 'recoil';
import {Wallet} from '../../database/entities/wallet';
import {IWallet} from './../../types/index';

const listWalletsState = atom({
  key: 'listWalletsState',
  default: [] as Wallet[],
});

const idWalletSelected = atom({
  key: 'idWalletSelected',
  default: 0,
});

const reloadingWallets = atom({
  default: true,
  key: 'reloadingWallets',
});

export {listWalletsState, idWalletSelected, reloadingWallets};
