import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import Logo from "../../assets/logo/logo.svg";
import walletConnect from "../../core/WalletConnect";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
import ScanQR from "../SendToken/ScanQR";

export default function HeaderHome() {
  const navigation = useNavigation();
  const [walletEnvironment] = useRecoilState(walletEnvironmentState);
  const walletSelected = useWalletSelected();

  const handleQRCodeResult = (uri: string) => {
    if (uri.includes("wc:")) {
      walletConnect.createSession({ uri }, walletSelected);
    } else if (uri.includes("http://") || uri.includes("https://")) {
      navigation.navigate(
        "Browser" as never,
        {
          screen: "MainBrowser",
          params: {
            url: uri,
          },
        } as never
      );
    }
  };

  return (
    <View style={tw`flex-row items-center px-3 pr-6 mb-3`}>
      <View style={tw`flex-row items-center justify-between w-full mt-0`}>
        <View style={tw`flex flex-row items-center`}>
          <View style={tw`flex-row items-center`}>
            <Logo width={45} height={45} />
            <Text style={tw`text-3xl font-bold text-black dark:text-white `}>
              Navara
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile" as never)}
            style={tw`flex-row items-center px-1 py-1 mx-1 text-xs bg-black rounded-lg h-7`}
          >
            <Text style={tw`font-bold text-white text-[10px]`}>
              {walletEnvironment == ENVIRONMENT.PRODUCTION
                ? "Mainnet"
                : "Testnet"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row`}>
          <View style={tw`bg-blue-100 rounded-lg`}>
            <ScanQR onValueScaned={handleQRCodeResult} />
          </View>
        </View>
      </View>
    </View>
  );
}
