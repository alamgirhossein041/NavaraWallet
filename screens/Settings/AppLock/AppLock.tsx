import React, {useEffect, useMemo, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {tw} from '../../../utils/tailwind';
import MenuItem from '../../../components/MenuItem';
import {primaryColor} from '../../../configs/theme';
import {
  LockClosedIcon,
  LockOpenIcon,
  PencilAltIcon,
  XIcon,
} from 'react-native-heroicons/solid';
import {KeyboardAvoidingView, Modal} from 'native-base';
import EnableAppLock from './EnableAppLock';
import DisableAppLock from './DisableAppLock';
import toastr from '../../../utils/toastr';
import ChangePassword from './ChangePassword';
import {PinRequiredEnum} from '../../../enum';
import FingerPrint from './FingerPrintScan';
import AutoLock from './AutoLock';
import {useRecoilState, useRecoilValue} from 'recoil';
import {appLockState} from '../../../data/globalState/appLock';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import SignPinCode from '../../../components/SignPinCode';
import FaceId from './FaceId';
import {localStorage, STORAGE_APP_LOCK} from '../../../utils/storage';
import {getFromKeychain} from '../../../utils/keychain';
import IconKeyPassword from "../../../assets/icons/icon-key.svg"

const AppLock = ({navigation}) => {
  const password = useMemo(async () => {
    return await getFromKeychain();
  }, []);
  const defaultModalPinCode = {
    show: false,
    type: PinRequiredEnum.NULL,
  };

  const [modalPincode, setShowModalPincode] = useState(defaultModalPinCode);
  const menuIsLocked = [
    // {
    //     icon: <LockOpenIcon width="100%" height="100%" fill={primaryColor} />,
    //     name: "Disable App Lock",
    //     value: "",
    //     onPress: () => setShowModalPincode({ show: true, type: PinRequiredEnum.DISABLE_PIN_CODE }),
    //     next: true,
    // },
    {
      icon: <IconKeyPassword width="100%" height="100%" stroke={primaryColor} />,
      name: 'Change Password',
      value: '',
      onPress: () =>
        setShowModalPincode({
          show: true,
          type: PinRequiredEnum.CHANGE_PIN_CODE,
        }),
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
  ];

  const menuDefault = [
    {
      icon: <LockClosedIcon width="100%" height="100%" fill={primaryColor} />,
      name: 'Enable App Lock',
      value: '',
      onPress: () =>
        setShowModalPincode({
          show: true,
          type: PinRequiredEnum.ENABLE_PIN_CODE,
        }),
      next: true,
    },
  ];

  const handleOnSuccess = () => {
    setShowModalPincode(defaultModalPinCode);
    toastr.success('Success');
  };
  const modeColor = useDarkMode();
  return (
    <View style={tw`h-full w-full ${modeColor}`}>
      <SignPinCode />
      <View style={tw`px-3`}>
        {!password ? (
          <View>
            {menuDefault.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  name={item.name}
                  onPress={item.onPress}
                  value={item.value}
                  next={item.next}
                  disabled={!item.next}
                />
              );
            })}
          </View>
        ) : (
          <View>
            {menuIsLocked.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  name={item.name}
                  onPress={item.onPress}
                  value={item.value}
                  next={item.next}
                  disabled={!item.next}
                />
              );
            })}
            <AutoLock />
            <FingerPrint />
            <FaceId />
          </View>
        )}

        <Modal
          style={tw`h-full w-full ${modeColor}`}
          isOpen={modalPincode.show}
          onClose={() => setShowModalPincode(defaultModalPinCode)}>
          <KeyboardAvoidingView
            behavior="padding"
            style={tw`flex-row items-center justify-center w-full h-full `}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowModalPincode(defaultModalPinCode)}
              style={tw`absolute items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full w-left-5 ios:top-10 android:top-1 `}>
              <XIcon size={25} color="black" />
            </TouchableOpacity>
            <Modal.Content
              style={tw`flex items-center justify-center w-full h-full`}>
              {modalPincode.type === PinRequiredEnum.ENABLE_PIN_CODE && (
                <EnableAppLock onSuccess={handleOnSuccess} />
              )}
              {modalPincode.type === PinRequiredEnum.DISABLE_PIN_CODE && (
                <DisableAppLock onSuccess={handleOnSuccess} />
              )}
              {modalPincode.type === PinRequiredEnum.CHANGE_PIN_CODE && (
                <ChangePassword onSuccess={handleOnSuccess} />
              )}
            </Modal.Content>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </View>
  );
};
export default AppLock;
