import { atom } from 'recoil';
import { IWallet } from './../../types/index';

const listWalletsState = atom({
    key: 'listWalletsState',
    default: []
})

export { listWalletsState }