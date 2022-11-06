import { useCallback, useState } from "react";
import { AppStateStatus } from "react-native";
import { useRecoilState } from "recoil";
import { appLockState } from "../data/globalState/appLock";

const usePinCodeRequired = () => {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [unixTimeToLock, setUnixTimeToLock] = useState<number | null>(null);

  const lock = useCallback(
    (nextAppState: AppStateStatus) => {
      if (appLock?.typeBioMetric) {
        if (nextAppState === "active") {
          if (!appLock.isLock) {
            const unixTimeNow = Date.now();
            if (unixTimeToLock && unixTimeNow >= unixTimeToLock) {
              setAppLock({ ...appLock, isLock: true });
            } else {
              setUnixTimeToLock(null);
            }
          }
        } else if (nextAppState === "background") {
          const _unixTimeToLock =
            Date.now() + (appLock.autoLockAfterSeconds * 1000 || 0);
          setUnixTimeToLock(_unixTimeToLock);
        } else {
          setUnixTimeToLock(null);
        }
      }
    },
    [appLock, setAppLock, unixTimeToLock]
  );

  return [lock];
};

export { usePinCodeRequired };
