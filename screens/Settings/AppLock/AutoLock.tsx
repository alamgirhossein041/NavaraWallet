import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {LightningBoltIcon} from 'react-native-heroicons/solid';
import {primaryColor} from '../../../configs/theme';
import MenuItem from '../../../components/MenuItem';
import {Actionsheet, CheckCircleIcon, useDisclose} from 'native-base';
import {tw} from '../../../utils/tailwind';
import toastr from '../../../utils/toastr';
import {useRecoilState} from 'recoil';
import {appLockState} from '../../../data/globalState/appLock';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../../hooks/useModeDarkMode';
import {getFromKeychain} from '../../../utils/keychain';
import IconAutoLock from '../../../assets/icons/icon-auto-lock.svg';
const autoLock = () => {};

export default function AutoLock() {
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const password = useMemo(async () => {
    return await getFromKeychain();
  }, []);
  if (!appLock) {
    return null;
  }
  const {isOpen, onOpen, onClose} = useDisclose();

  //text darkmode

  //grid, shadow darkmode

  const options = [
    {
      time: 0,
      label: 'Immediate',
    },
    {
      time: 30,
      label: '30 second',
    },
    {
      time: 60,
      label: '1 mins',
    },
    {
      time: 300,
      label: '5 mins',
    },
    {
      time: 600,
      label: '10 mins',
    },
  ];

  const menu = useMemo(() => {
    return (
      appLock &&
      password && {
        icon: <IconAutoLock width="100%" height="100%" fill={primaryColor} />,
        name: 'Auto lock',
        value: options.find(
          option => option.time === appLock.autoLockAfterSeconds,
        )?.label,
        next: false,
        onPress: () => onOpen(),
      }
    );
  }, [appLock]);

  const handleSelectOption = useCallback(index => {
    setAppLock({...appLock, autoLockAfterSeconds: options[index].time});
    onClose();
    toastr.success('Changed');
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
                style={tw`flex-row items-center justify-between w-full p-3`}>
                <Text
                  style={tw`
                                        }] text-lg `}>
                  {item.label}
                </Text>
                {isSelected && <CheckCircleIcon color={primaryColor} />}
              </TouchableOpacity>
            );
          })}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}
