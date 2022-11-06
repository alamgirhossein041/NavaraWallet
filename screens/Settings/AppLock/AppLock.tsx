import { KeyboardAvoidingView, Modal } from "native-base";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { LockClosedIcon, XIcon } from "react-native-heroicons/solid";
import MenuItem from "../../../components/UI/MenuItem";
import SignPinCode from "../../../components/UI/SignPinCode";
import { primaryColor } from "../../../configs/theme";
import { PinRequiredEnum } from "../../../enum";
import { getFromKeychain } from "../../../utils/keychain";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";
import AutoLock from "./AutoLock";
import ChangePassword from "./ChangePassword";
import DisableAppLock from "./DisableAppLock";
import EnableAppLock from "./EnableAppLock";
import FaceId from "./FaceId";
import FingerPrint from "./FingerPrintScan";

const AppLock = () => {
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
    // {
    //   icon: (
    //     <IconKeyPassword width="100%" height="100%" stroke={primaryColor} />
    //   ),
    //   name: 'Change Password',
    //   value: '',
    //   onPress: () =>
    //     setShowModalPincode({
    //       show: true,
    //       type: PinRequiredEnum.CHANGE_PIN_CODE,
    //     }),
    //   next: true,
    // },
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
  const { t } = useTranslation();

  const menuDefault = [
    {
      icon: <LockClosedIcon width="100%" height="100%" fill={primaryColor} />,
      name: t("setting.apps_lock.enable_app_lock"),
      value: "",
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
    toastr.success("Success");
  };

  return (
    <View style={tw`w-full h-full `}>
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
          style={tw`w-full h-full `}
          isOpen={modalPincode.show}
          onClose={() => setShowModalPincode(defaultModalPinCode)}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={tw`flex-row items-center justify-center w-full h-full `}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setShowModalPincode(defaultModalPinCode)}
              style={tw`absolute items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full w-left-5 ios:top-10 android:top-1 `}
            >
              <XIcon size={25} color="black" />
            </TouchableOpacity>
            <Modal.Content
              style={tw`flex items-center justify-center w-full h-full`}
            >
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
