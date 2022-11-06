import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { EyeOffIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import { CHAIN_ICONS, TOKEN_SYMBOLS } from "../../configs/bcNetworks";
import showTotalAssets from "../../data/globalState/showTotalAssets";
import { IChain } from "../../data/types";
import { getKeyByValue } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import CurrencyFormat from "./CurrencyFormat";

export default function ShowBalanceChain({ chain }: { chain: IChain }) {
  const [inVisible, setInVisible] = useRecoilState(showTotalAssets);
  const balance = chain.balance;
  const IconToken = CHAIN_ICONS[getKeyByValue(TOKEN_SYMBOLS, chain.symbol)];
  return (
    <View>
      <TouchableOpacity onPress={() => setInVisible(!inVisible)}>
        {inVisible ? (
          <View style={tw`flex-row items-center justify-center mb-4`}>
            <EyeOffIcon fill={"gray"} width={30} height={30} />
          </View>
        ) : (
          <CurrencyFormat
            value={balance * +chain.price}
            style="text-center text-3xl mb-4  font-bold"
          />
        )}
      </TouchableOpacity>
      <View style={tw`flex-row justify-center w-full`}>
        <View
          style={tw`flex-row items-center justify-center w-full mb-4 bg-white dark:bg-[#18191A]  rounded-full shadow h-17 w-17`}
        >
          <IconToken height={50} width={50} />
        </View>
      </View>
      {!inVisible ? (
        <Text style={tw`mb-4 text-2xl font-bold text-center dark:text-white`}>
          {balance === 0 ? 0 : balance?.toFixed(4)} {chain.symbol}
        </Text>
      ) : (
        <Text style={tw`mb-4 text-2xl font-bold text-center dark:text-white`}>
          ••••• {chain.symbol}
        </Text>
      )}
    </View>
  );
}
