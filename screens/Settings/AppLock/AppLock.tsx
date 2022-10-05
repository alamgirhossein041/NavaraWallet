import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { tw } from '../../../utils/tailwind';
import MenuItem from '../../../components/MenuItem';
import { primaryColor } from '../../../configs/theme';
import { LockClosedIcon, LockOpenIcon, PencilAltIcon, XIcon } from 'react-native-heroicons/solid';
import { Modal } from 'native-base';
import { localStorage, STORAGE_APP_LOCK } from '../../../utils/storage';
import EnableAppLock from './EnableAppLock';
import DisableAppLock from './DisableAppLock';
import toastr from '../../../utils/toastr';
import ChangePinCode from './ChangePinCode';
import { IPinCode } from '../../../data/types';
import { PinRequiredEnum } from '../../../enum';
import FingerPrint from './FingerPrint';
import AutoLock from './AutoLock';
import { useRecoilState } from 'recoil';
import { appLockState } from '../../../data/globalState/appLock';
import { useDarkMode } from '../../../hooks/useDarkMode';

const AppLock = ({ navigation }) => {
    const [appLock] = useRecoilState(appLockState)
    const defaultModalPinCode = {
        show: false,
        type: PinRequiredEnum.NULL
    }
    const [modalPincode, setShowModalPincode] = useState(defaultModalPinCode)
    const menuIsLocked = [
        {
            icon: <LockOpenIcon width="100%" height="100%" fill={primaryColor} />,
            name: "Disable App Lock",
            value: "",
            onPress: () => setShowModalPincode({ show: true, type: PinRequiredEnum.DISABLE_PIN_CODE }),
            next: true,
        },
        {
            icon: <PencilAltIcon width="100%" height="100%" fill={primaryColor} />,
            name: "Change PIN Code",
            value: "",
            onPress: () => setShowModalPincode({ show: true, type: PinRequiredEnum.CHANGE_PIN_CODE }),
            next: true,
        },
        // {
        //     icon: <UserIcon width="100%" height="100%" fill={primaryColor} />,
        //     name: "FaceID",
        //     value: (
        //         <Switch
        //             trackColor={{ false: primaryGray, true: primaryColor }}
        //             thumbColor="white"
        //             onValueChange={(value) => setIsEnabled(value)}
        //             value={isEnabled}
        //         />
        //     ),
        //     next: false,
        // },
    ]

    const menuDefault = [
        {
            icon: <LockClosedIcon width="100%" height="100%" fill={primaryColor} />,
            name: "Enable App Lock",
            value: "",
            onPress: () => setShowModalPincode({ show: true, type: PinRequiredEnum.ENABLE_PIN_CODE }),
            next: true,
        },

    ]



    const handleOnSuccess = () => {
        setShowModalPincode(defaultModalPinCode)
        toastr.success("Success")
    }
    const modeColor = useDarkMode();
    return (
        <View style={tw`h-full w-full ${modeColor}`}>
            <View style={tw`px-3`}>

                {!appLock.pinCode ? <View>
                    {menuDefault.map((item, index) => {
                        return <MenuItem key={index}
                            icon={item.icon}
                            name={item.name}
                            onPress={item.onPress}
                            value={item.value}
                            next={item.next}
                            disabled={!item.next}
                        />
                    })}
                </View> : <View>
                    {menuIsLocked.map((item, index) => {
                        return <MenuItem key={index}
                            icon={item.icon}
                            name={item.name}
                            onPress={item.onPress}
                            value={item.value}
                            next={item.next}
                            disabled={!item.next}
                        />
                    })}
                    <AutoLock />
                    <FingerPrint />
                </View>}

                <Modal style={tw`h-full w-full ${modeColor}`} isOpen={modalPincode.show} onClose={() => setShowModalPincode(defaultModalPinCode)}>
                    <View style={tw`h-full w-full`}>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => setShowModalPincode(defaultModalPinCode)} style={tw`w-8 h-8 items-center justify-center w-left-5 top-3 p-1 bg-gray-200 rounded-full`}>
                            <XIcon size={25} color="black" />
                        </TouchableOpacity>

                        <Modal.Body style={tw`h-96 w-full items-center justify-center `}>
                            {modalPincode.type === PinRequiredEnum.ENABLE_PIN_CODE && <EnableAppLock onSuccess={handleOnSuccess} />}
                            {modalPincode.type === PinRequiredEnum.DISABLE_PIN_CODE && <DisableAppLock onSuccess={handleOnSuccess} />}
                            {modalPincode.type === PinRequiredEnum.CHANGE_PIN_CODE && <ChangePinCode onSuccess={handleOnSuccess} />}
                        </Modal.Body>
                    </View>
                </Modal>
            </View>
        </View>
    );
};
export default AppLock;
