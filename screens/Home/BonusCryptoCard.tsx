import React from "react";
import { Text, View } from "react-native";
import BonusIcon from "../../assets/icons/bonus.svg";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { tw } from "../../utils/tailwind";
export default function BonusCryptoCard(props) {
  return (
    <View style={tw`px-4 `}>
      <PressableAnimated style={tw`p-4 px-4 bg-[#F0F9FF]  flex flex-row `}>
        <View style={tw`w-1/4`}>
          <BonusIcon style={tw``} width={60} height={60} />
        </View>

        <View style={tw`w-3/4`}>
          <Text style={tw`dark:text-white  text-lg font-bold text-blue-500`}>
            Bonus Crypto
          </Text>
          <Text style={tw`text-xs text-gray-400 sm:text-base`}>
            {props.description}
          </Text>
        </View>
      </PressableAnimated>
    </View>
  );
}
