import { Actionsheet, CheckCircleIcon, useDisclose } from "native-base";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import IconAutoLock from "../../../assets/icons/icon-auto-lock.svg";
import MenuItem from "../../../components/UI/MenuItem";
import { primaryColor } from "../../../configs/theme";
import { getFromKeychain } from "../../../core/keychain";
import { appLockState } from "../../../data/globalState/appLock";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";
const autoLock = () => {};

export default function AutoLock() {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const password = useMemo(async () => {
    return await getFromKeychain();
  }, []);
  if (!appLock) {
    return null;
  }
  const { isOpen, onOpen, onClose } = useDisclose();
  const { t } = useTranslation();

  const options = [
    {
      time: 0,
      label: t("setting.apps_lock.immediate"),
    },
    {
      time: 30,
      label: `30 ${t("setting.apps_lock.second")}`,
    },
    {
      time: 60,
      label: `1 ${t("setting.apps_lock.minutes")}`,
    },
    {
      time: 300,
      label: `5 ${t("setting.apps_lock.minutes")}`,
    },
    {
      time: 600,
      label: `10 ${t("setting.apps_lock.minutes")}`,
    },
  ];

  const menu = useMemo(() => {
    return (
      appLock &&
      password && {
        icon: <IconAutoLock width="100%" height="100%" fill={primaryColor} />,
        name: `${t("setting.apps_lock.auto_lock")}`,
        value: options.find(
          (option) => option.time === appLock.autoLockAfterSeconds
        )?.label,
        next: false,
        onPress: () => onOpen(),
      }
    );
  }, [appLock]);

  const handleSelectOption = useCallback((index) => {
    setAppLock({ ...appLock, autoLockAfterSeconds: options[index].time });
    onClose();
    toastr.success(`${t("setting.apps_lock.changed")}`);
  }, []);

  return (
    <View>
      <MenuItem {...menu} />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw``}>
          {options.map((item, index) => {
            const isSelected = item.time === appLock.autoLockAfterSeconds;
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => handleSelectOption(index)}
                key={index}
                style={tw`flex-row items-center justify-between w-full p-3`}
              >
                <Text style={tw`dark:text-white text-lg `}>{item.label}</Text>
                {isSelected && <CheckCircleIcon color={primaryColor} />}
              </TouchableOpacity>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
