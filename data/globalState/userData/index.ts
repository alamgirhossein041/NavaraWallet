import {atom} from 'recoil';
import {ENVIRONMENT} from '../../../global.config';
import {IUser} from '../../types';

const userState = atom({
  key: 'userState',
  default: {
    wallets: [],
  } as IUser,
});

const walletSelectedState = atom({
  key: 'walletSelectedState',
  default: 'wallet1',
});

const walletEnvironmentState = atom({
  key: 'walletEnvironmentState',
  default: 1 as ENVIRONMENT,
});

export {userState, walletSelectedState, walletEnvironmentState};
