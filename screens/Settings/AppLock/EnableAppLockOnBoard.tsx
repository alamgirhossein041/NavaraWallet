import { View, Text } from 'react-native'
import React from 'react'
import { tw } from '../../../utils/tailwind'
import EnableAppLock from './EnableAppLock'
import Logo from "../../../assets/logo/logo.svg";
export default function EnableAppLockOnBoard({ navigation }) {
    return (
        <View style={tw`h-full w-full bg-white p-4 items-center justify-center relative`}>
            <Logo />
            <EnableAppLock onSuccess={() => {
                navigation.replace("WalletID")
            }
            } />
        </View>
    )
}