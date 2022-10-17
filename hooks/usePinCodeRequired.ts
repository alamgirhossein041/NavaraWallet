import {useRecoilState} from 'recoil';
import {appLockState} from '../data/globalState/appLock';
import {getFromKeychain} from '../utils/keychain';

const usePinCodeRequired = () => {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const lock = () => {
    getFromKeychain().then((password: string) => {
      if (password) {
        setAppLock({...appLock, isLock: true});
      }
    });
  };
  return [lock];
};

export {usePinCodeRequired};
