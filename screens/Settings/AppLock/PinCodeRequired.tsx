import { Modal, useDisclose } from "native-base"
import React, { useEffect, useState } from "react"
import { Text, Vibration } from "react-native"
import { useRecoilState } from "recoil"
import PinCodeInput from "../../../components/PinCodeInput"
import { appLockState } from "../../../data/globalState/appLock"
import { IAppLockState } from "../../../data/types"
import checkPinCode from "../../../utils/checkPinCode"
import { localStorage, STORAGE_APP_LOCK } from "../../../utils/storage"
import { tw } from "../../../utils/tailwind"
import Logo from "../../../assets/logo/logo.svg";
import { listWalletsState } from "../../../data/globalState/listWallets"
const ONE_SECOND_IN_MS = 100;

const PATTERN = [
    1 * ONE_SECOND_IN_MS,
    2 * ONE_SECOND_IN_MS,
    1 * ONE_SECOND_IN_MS,
];

const PinCodeRequired = () => {
    const [listWallets] = useRecoilState(listWalletsState)
    const [appLock, setAppLock] = useRecoilState(appLockState)
    const [err, setErr] = useState(false);
    // always update state appLock to localStorage
    useEffect(() => {
        if (appLock && appLock.pinCode) {
            localStorage.set(STORAGE_APP_LOCK, appLock)
        }
    }, [appLock])


    const onClose = () => {
        setAppLock({ ...appLock, isLock: false })
    }
    const onOpen = () => {
        setAppLock({ ...appLock, isLock: true })
    }

    useEffect(() => {
        // update appLock state from localStorage when open app first time
        localStorage.get(STORAGE_APP_LOCK).then(((res: IAppLockState | any) => {
            if (!!res && listWallets.length > 0) {
                setAppLock({ ...res, isLock: !!res.pinCode })
            }
            else {
                setAppLock({} as any)
            }
        }))
    }, [])

    const handleChangeInput = async (pinCodeInput) => {
        setErr(false);
        if (pinCodeInput.length === 6) {
            if (await checkPinCode(pinCodeInput)) {
                onClose()
            } else {
                setErr(true);
                Vibration.vibrate(PATTERN);
            }
        }
    };


    return (
        <Modal style={tw`h-full w-full bg-white dark:bg-gray-800`} isOpen={!!appLock.isLock}>
            <Logo />
            <Text style={tw`text-lg text-center mb-3 font-bold dark:text-white`}>
                Enter Current PIN Code
            </Text>
            <PinCodeInput
                hide
                err={err}
                onChange={(pinCode: number) => handleChangeInput(pinCode)} />
        </Modal>
    )
}
export { PinCodeRequired }