import React, { useEffect } from "react";

import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState, useRecoilValue } from "recoil";
import TabBarMenu from "../../components/UI/TabBarMenu";

import { reloadingWallets } from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";

import HeaderHome from "./HeaderHome";
import ListChainsChart from "./ListChainsChart";
import ListNFT from "./ListNFT";
import SelectWallets from "./SelectWallets";
import { TelegramLinking } from "./TelegramLinking";

export interface ButtonProps {
  icon: JSX.Element;
  label: string;
  path: string;
  onPress?: () => void;
}

const WalletDashboard = () => {
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  const insets = useSafeAreaInsets();
  const { enabledNetworks, index } = useWalletSelected();
  const walletEnvironment = useRecoilValue(walletEnvironmentState);

  const onRefresh = React.useCallback(() => {
    setReloading(true);
  }, [setReloading]);

  useEffect(() => {
    if (!reloading) {
      onRefresh();
    }
  }, [JSON.stringify(enabledNetworks), index, walletEnvironment]);

  return (
    <View style={tw`flex flex-col h-full`}>
      <View style={tw`pt-[${insets.top}] flex-1`}>
        <ScrollView
          scroll={false}
          refreshControl={
            <RefreshControl refreshing={reloading} onRefresh={onRefresh} />
          }
        >
          <HeaderHome />
          <SelectWallets />
          {/* <BonusCryptoCard /> */}
          <TabBarMenu itemTabBar={["Token", "NFT"]}>
            <View style={tw`flex-col items-center w-full pb-24 ios:pb-52`}>
              <ListChainsChart next="DetailChain" />
              {/* <News keyword="blockchain" isPreview /> */}
            </View>
            <ListNFT />
          </TabBarMenu>
          <TelegramLinking />
        </ScrollView>
      </View>
    </View>
  );
};

export default WalletDashboard;
