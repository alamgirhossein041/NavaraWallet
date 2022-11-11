import { useLinkTo } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useRecoilState, useRecoilValue } from "recoil";
import ReceiveIcon from "../../assets/icons/icon-recevie.svg";
import SendIcon from "../../assets/icons/icon-send.svg";
import SwapIcon from "../../assets/icons/icon-swap.svg";
import { Wallet } from "../../data/database/entities/wallet";
import {
  idWalletSelected,
  listWalletsState,
} from "../../data/globalState/listWallets";
import { localStorage, SELECTED_WALLET } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import CardWallet from "./CardWallet";

const SelectWallets = () => {
  const listWallets = useRecoilValue(listWalletsState);
  const [indexWalletSelected, setIndexWalletSelected] =
    useRecoilState(idWalletSelected);

  const { width: viewportWidth } = Dimensions.get("window");

  useEffect(() => {
    (async () => {
      const wallets: any = (await localStorage.get(SELECTED_WALLET)) || 0;
      if (wallets !== 0) {
        setIndexWalletSelected(wallets);
      }
    })();
  }, []);

  const handleSelectWallet = (index: number) => {
    if (indexWalletSelected !== index && index !== 0) {
      setIndexWalletSelected(index);
      localStorage.set(SELECTED_WALLET, index);
    }
  };

  return (
    <View style={tw`relative mb-5 h-55`}>
      <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
        <View style={tw`flex-row flex-1`}>
          <Carousel
            firstItem={indexWalletSelected}
            activeOpacity
            layout={"default"}
            data={listWallets}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth - 45}
            renderItem={({ item }: { item: Wallet }) => (
              <CardWallet wallet={item} />
            )}
            onSnapToItem={handleSelectWallet}
          />
        </View>
      </SafeAreaView>
      <ButtonActions />
    </View>
  );
};

const ButtonActions = () => {
  const { t } = useTranslation();
  const buttons = [
    {
      label: `${t("home.send")}`,
      icon: <SendIcon height={28} width={28} />,
      path: "/ViewListWallet",
    },
    {
      label: `${t("home.receive")}`,
      icon: <ReceiveIcon height={28} width={28} />,
      path: "/ReceiveToken",
    },
    {
      label: `${t("home.swap")}`,
      icon: <SwapIcon height={28} width={28} />,
      path: "/SwapToken",
    },
    // {
    //   label: 'Secirity',
    //   icon: <SearchShieldIcon height={28} width={28} />,
    //   path: '/ReceiveToken',
    // },
  ];
  let linkTo = useLinkTo();
  return (
    <View style={tw`absolute flex-row justify-center w-full -bottom-5`}>
      <View
        style={tw`flex-row w-3/4 p-2 bg-white dark:bg-[#202122]  shadow z-100 rounded-2xl`}
      >
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.label}
            onPress={() => linkTo(button.path)}
            style={tw`flex-col items-center justify-center w-1/${buttons.length} `}
          >
            {button.icon}
            {/* <View style={tw`relative bg-blue-100 rounded-full w-7 h-7`}>
           
          </View> */}
            <Text style={tw`font-bold dark:text-white `}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default SelectWallets;
