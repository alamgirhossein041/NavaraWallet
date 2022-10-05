import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { LightningBoltIcon } from 'react-native-heroicons/solid'
import { primaryColor } from '../../../configs/theme'
import MenuItem from '../../../components/MenuItem'
import { Actionsheet, CheckCircleIcon, useDisclose } from 'native-base'
import { tw } from '../../../utils/tailwind'
import toastr from '../../../utils/toastr'
import { useRecoilState } from 'recoil'
import { appLockState } from '../../../data/globalState/appLock'
import { useDarkMode } from '../../../hooks/useDarkMode'

const autoLock = () => {

}

export default function AutoLock() {
    const [appLock, setAppLock] = useRecoilState(appLockState)
    if (!appLock) {
        return null
    }
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    const options = [
        {
            time: 0,
            label: "Immediate",
        },
        {
            time: 30,
            label: "30 second",
        },
        {
            time: 60,
            label: "1 mins",
        },
        {
            time: 300,
            label: "5 mins",
        },
        {
            time: 600,
            label: "10 mins"
        },
    ]

    const menu = useMemo(() => {
        return appLock && !!appLock.pinCode && {
            icon: <LightningBoltIcon width="100%" height="100%" fill={primaryColor} />,
            name: "Auto lock",
            value: options.find((option) => option.time === appLock.autoLockAfterSeconds).label,
            next: false,
            onPress: () => onOpen()
        }

    }, [appLock])



    const handleSelectOption = useCallback((index) => {
        setAppLock({ ...appLock, autoLockAfterSeconds: options[index].time })
        onClose()
        toastr.success("Changed")
    }, [])
    
    return (
        <View>
            <MenuItem
                {...menu}
            />
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    {options.map((item, index) => {
                        const isSelected = item.time === appLock.autoLockAfterSeconds
                        return (
                            <TouchableOpacity activeOpacity={0.6}
                                onPress={() => handleSelectOption(index)}
                                key={index}
                                style={tw`w-full p-3 justify-between items-center flex-row`}
                            >
                                <Text
                                    style={tw`text-[${isSelected ? primaryColor : "#999999"
                                        }] text-lg`}
                                >
                                    {item.label}
                                </Text>
                                {isSelected && <CheckCircleIcon color={primaryColor} />}
                            </TouchableOpacity>
                        );
                    })}
                </Actionsheet.Content>
            </Actionsheet>
        </View>

    )
}
