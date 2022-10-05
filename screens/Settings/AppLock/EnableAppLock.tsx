import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import PinCodeInput from '../../../components/PinCodeInput';
import { tw } from '../../../utils/tailwind';
import { useRecoilState } from 'recoil';
import { appLockState } from '../../../data/globalState/appLock';
import toastr from '../../../utils/toastr';

const EnableAppLock = ({ onSuccess }) => {
    const [, setAppLock] = useRecoilState(appLockState)
    const [step, setStep] = useState(0)
    const [tempCode, setTempCode] = useState('')
    const [err, setErr] = useState(null)
    const handleSettingPinCode = useCallback((pinCode: string) => {

        if (pinCode.length === 6) {
            setErr(null)
            if (step === 0) {
                setTempCode(pinCode)
                setStep(1)
                return
            }
            else {
                if (tempCode === pinCode) {
                    setAppLock({
                        updatedAt: new Date(),
                        openAt: new Date(),
                        pinCode,
                        isLock: false,
                        typeBioMetric: "none",
                        autoLockAfterSeconds: 0
                    })
                    onSuccess()
                }
                else {
                    setStep(0)
                    setTempCode('')
                    setErr("Passcode Doesn't Match")
                    return
                }

            }
        }
    }, [step])

    return (
        <View>
            <View style={tw`items-center justify-center`}>

                <Text style={tw`text-lg text-center mb-3 font-bold dark:text-white`}>{!step ? "Enter new passcode" : "Re-enter your passcode"}</Text>
                {step === 0 && <View>
                    <PinCodeInput hide onChange={handleSettingPinCode} err={err} />
                </View>}
                {/* reset pin code input and next step */}
                {step === 1 && <View>
                    <PinCodeInput hide onChange={handleSettingPinCode} err={err} />
                </View>}
                {!!err && <Text style={tw`text-red-500 text-center`}>{err}</Text>}
            </View>
        </View>
    );
}


export default EnableAppLock;