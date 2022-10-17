import {atom} from 'recoil';
import {IAppLockState} from '../../types';

const appLockState = atom({
  key: 'appLockState',
  default: {} as IAppLockState,
});
export {appLockState};
