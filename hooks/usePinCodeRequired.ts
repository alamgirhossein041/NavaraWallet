import { localStorage, STORAGE_APP_LOCK } from './../utils/storage';
import { useRecoilState } from "recoil"
import { appLockState } from "../data/globalState/appLock"

const usePinCodeRequired = () => {
    const [appLock, setAppLock] = useRecoilState(appLockState)
    const lock = () => {
        localStorage.get(STORAGE_APP_LOCK).then((res: any) => {
            if (res && !!res.pinCode) {
                setAppLock({ ...appLock, isLock: true })
            }
        })

    }
    return [lock];
}

export { usePinCodeRequired }