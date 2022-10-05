import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Switch, View } from "react-native";
import { primaryColor, primaryGray } from "../../../configs/theme";
import { BiometricTypeEnum } from "../../../enum";
import { localStorage, STORAGE_TYPE_BIOMETRIC } from "../../../utils/storage";
// import * as LocalAuthentication from 'expo-local-authentication';
import { FingerPrintIcon } from "react-native-heroicons/solid";
import MenuItem from "../../../components/MenuItem";

export const checkStateScanFingerNative = async (): Promise<boolean> => {
    try {
        const result = await LocalAuthentication.authenticateAsync({
            disableDeviceFallback: false,
        });

        return result.success
    }
    catch (e) {
        return false
    }
}

const FingerPrint: FunctionComponent = () => {

    const [isEnabled, setIsEnabled] = useState(null)
    const [supported, setSupported] = useState(false)
    const menu = useMemo(() => {
        return {
            icon: <FingerPrintIcon width="100%" height="100%" fill={primaryColor} />,
            name: "Finger print",
            value: <Switch
                trackColor={{ false: primaryGray, true: primaryColor }}
                thumbColor="white"
                onValueChange={(value) => handleChangeSwitch(value)}
                value={isEnabled !== BiometricTypeEnum.ONLY_PIN_CODE}
            />,

            next: false,
        }

    }, [isEnabled])
    useEffect(() => {
        (async () => {
            setSupported(await LocalAuthentication.hasHardwareAsync())
            localStorage.get(STORAGE_TYPE_BIOMETRIC).then((value: any) => {
                if (!!value) {
                    setIsEnabled(value);
                    return
                }
                setIsEnabled(BiometricTypeEnum.ONLY_PIN_CODE);
            })

        })()
    }, [])



    const handleChangeSwitch = async (value: boolean) => {
        if (!! await checkStateScanFingerNative()) {
            const newValue = value ? BiometricTypeEnum.BIOMETRIC_TYPE_FINGERPRINT : BiometricTypeEnum.ONLY_PIN_CODE
            localStorage.set(STORAGE_TYPE_BIOMETRIC, newValue).then(() => {
                setIsEnabled(newValue)
            })
        }

    }

    return supported && isEnabled && (
        <MenuItem
            icon={menu.icon}
            name={menu.name}
            value={menu.value}
            next={menu.next}
            disabled={!menu.next}
        />

    );
};

export default FingerPrint;
