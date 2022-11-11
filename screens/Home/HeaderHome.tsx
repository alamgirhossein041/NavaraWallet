import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRecoilState } from "recoil";
import Logo from "../../assets/logo/logo.svg";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { tw } from "../../utils/tailwind";
export default function HeaderHome() {
  const navigation = useNavigation();
  const [walletEnvironment] = useRecoilState(walletEnvironmentState);
  return (
    <View style={tw`flex-row items-center px-3 pr-6 mb-3`}>
      <View style={tw`flex-row items-center justify-between w-full mt-0`}>
        <View style={tw`flex-row items-center`}>
          <Logo width={45} height={45} />
          <Text style={tw`mr-1 text-3xl font-bold text-black dark:text-white `}>
            Navara
          </Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile" as never)}
            style={tw`flex-row items-center p-1 mx-3 text-xs bg-black rounded borders`}
          >
            <Text style={tw`text-xs font-bold text-white`}>
              {walletEnvironment == ENVIRONMENT.PRODUCTION
                ? "Mainnet"
                : "Testnet"}
            </Text>

            {/* <TouchableOpacity>
          <IconNotification width={25} height={25} onPress={()=>{navigation.navigate("Notification")}}/>
        </TouchableOpacity> */}
          </TouchableOpacity>
          {/* <Notification /> */}
        </View>
      </View>
    </View>
  );
}
