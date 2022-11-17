import React, { useEffect, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import IconHistory from "../../assets/icons/icon-history.svg";
import IconRecevie from "../../assets/icons/icon-recevie.svg";
import IconSend from "../../assets/icons/icon-send.svg";
import IconSwap from "../../assets/icons/icon-swap.svg";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import PressableAnimated from "../../components/UI/PressableAnimated";
import ShowBalanceChain from "../../components/UI/ShowBalanceChain";
import { SupportedSwapChainsEnum } from "../../enum";

import { useTranslation } from "react-i18next";

import DappView from "../../components/UI/Dapp";
import { NETWORKS } from "../../enum/bcEnum";
import { tw } from "../../utils/tailwind";
import News from "./News";
import { ButtonProps } from "./WalletDashboard";

export default function DetailChain({ route, navigation }) {
  const { token } = route.params;
  const { t } = useTranslation();

  const buttonsAction = [
    {
      icon: <IconRecevie />,
      label: `${t("home.receive")}`,
      path: "/ReceiveToken",
      onPress: () => navigation.navigate("ReceiveSpecificToken", { token }),
    },
    {
      icon: <IconSend />,
      label: `${t("home.send")}`,
      path: "/ViewListWallet",
      onPress: () => navigation.navigate("SendingToken", { token }),
    },
    {
      icon: <IconSwap />,
      label: `${t("home.swap")}`,
      path: "/SwapToken",
      onPress: () => navigation.navigate("SwapScreen", { token }),
    },
    {
      icon: <IconHistory />,
      label: `${t("home.history")}`,
      path: "/HistoryWallets",
      onPress: () => navigation.navigate("HistoryWallets", { token }),
    },
  ];
  const isSupportedSwap = Object.keys(SupportedSwapChainsEnum).includes(
    token.network
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${token.network.split("_")[0]} Network`,
      headerRight: () => (
        <CurrencyFormat
          value={token.price}
          style="text-gray-400 text-sm flex-row items-center px-1"
        />
      ),
    });
  }, [token]);
  const keyWordNews = useMemo(() => {
    if (token.network === NETWORKS.NEAR) {
      return "near protocol";
    } else if (token.network === NETWORKS.BINANCE_SMART_CHAIN) {
      return "binance";
    }
    return token.network.toLowerCase() || "blockchain";
  }, [token]);

  return (
    <ScrollView style={tw`w-full h-full `}>
      <ShowBalanceChain chain={token} />
      <View style={tw`flex flex-row justify-center mb-10 items-centerm`}>
        {buttonsAction.map((item, index) => (
          <>
            {!isSupportedSwap && item.label === "Swap" ? (
              <></>
            ) : (
              <ButtonAction key={index} {...item} />
            )}
          </>
        ))}
      </View>
      <DappView chain={token.network} />
      <News keyword={keyWordNews} />
    </ScrollView>
  );
}
const ButtonAction = ({ icon, label, onPress }: ButtonProps) => {
  return (
    <View style={tw`items-center mx-2 text-center h-18 w-18 `}>
      <PressableAnimated
        activeOpacity={0.6}
        style={tw`items-center justify-center mx-3 mb-3 bg-gray-100 dark:bg-gray-800 shadow h-16=5 w-16=5 rounded-3xl`}
        onPress={onPress}
      >
        {icon}
      </PressableAnimated>
      <Text style={tw`dark:text-white `}>{label}</Text>
    </View>
  );
};
