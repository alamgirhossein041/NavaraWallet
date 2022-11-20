import { useLinkTo } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useRecoilState, useRecoilValue } from "recoil";
import ReceiveIcon from "../../assets/icons/icon-recevie.svg";
import SendIcon from "../../assets/icons/icon-send.svg";
import SwapIcon from "../../assets/icons/icon-swap.svg";
import { triggerHapticFeedback } from "../../components/UI/PressableHapticFeedback";
import { Wallet } from "../../data/database/entities/wallet";
import {
  idWalletSelected,
  listWalletsState,
} from "../../data/globalState/listWallets";
import { ID_WALLET_SELECTED, localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import CardWallet from "./CardWallet";

const SelectWallets = () => {
  const listWallets = useRecoilValue(listWalletsState);
  const colorScheme = useColorScheme();
  const [indexWalletSelected, setIndexWalletSelected] =
    useRecoilState(idWalletSelected);

  const { width: viewportWidth } = Dimensions.get("window");

  const handleSelectWallet = async (index: number) => {
    setIndexWalletSelected(index);
    triggerHapticFeedback();
    await localStorage.set(
      ID_WALLET_SELECTED,
      listWallets[indexWalletSelected].id
    );
  };

  return (
    <View style={tw`relative mb-5 h-55`}>
      <SafeAreaView style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
        <View style={tw`flex-row flex-1 bg-white dark:bg-[#18191A]`}>
          <Carousel
            firstItem={indexWalletSelected}
            activeOpacity
            enableMomentum={true}
            decelerationRate={0.9}
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
            <Text style={tw`font-bold text-black dark:text-white `}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default SelectWallets;
