import React, { FunctionComponent, useEffect } from "react";
import { View } from "react-native";
import { useRecoilState } from "recoil";
import Logo from "../../assets/logo/logo.svg";
import { listWalletsState } from "../../data/globalState/listWallets";
import { IWallet } from "../../data/types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LIST_WALLETS, localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
const Splash = ({ navigation }) => {
    const [listWallets] = useRecoilState(listWalletsState)
    const redirect = (route) => {
        navigation.replace(route)
    }
    useEffect(() => {
        localStorage.get(LIST_WALLETS).then((listWallets) => {
            if (!!listWallets) {
                redirect("TabsNavigation")
            }
            else {
                redirect("OnBoard")
            }
        })
    }, [listWallets])
    return (
        <View style={tw`h-full w-full items-center justify-center`}>
            <Logo />
        </View>
    );
};

export default Splash;
