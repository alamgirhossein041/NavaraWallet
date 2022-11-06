import React, { useEffect } from "react";

import { RefreshControl, ScrollView, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilRefresher_UNSTABLE, useRecoilState } from "recoil";
import TabBarMenu from "../../components/UI/TabBarMenu";

import { reloadingWallets } from "../../data/globalState/listWallets";
import { priceTokenState } from "../../data/globalState/priceTokens";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";

import HeaderHome from "./HeaderHome";
import ListChainsChart from "./ListChainsChart";
import ListNFT from "./ListNFT";
import News from "./News";
import SelectWallets from "./SelectWallets";

export interface ButtonProps {
  icon: JSX.Element;
  label: string;
  path: string;
  onPress?: () => void;
}

const WalletDashboard = () => {
  const scheme = useColorScheme();
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  const insets = useSafeAreaInsets();
  const { enabledNetworks, index } = useWalletSelected();

  const refresh = useRecoilRefresher_UNSTABLE(priceTokenState);
  const [walletEnvironment, setWalletEnvironment] = useRecoilState(
    walletEnvironmentState
  );
  const onRefresh = React.useCallback(() => {
    refresh();
    setReloading(true);
  }, [refresh, setReloading]);

  useEffect(() => {
    if (!reloading) {
      onRefresh();
    }
  }, [JSON.stringify(enabledNetworks), index, scheme]);

  useEffect(() => {
    if (!reloading) {
      onRefresh();
    }
  }, [walletEnvironment]);

  const [tabSelected, setTabSelected] = React.useState(0);

  return (
    <View style={tw`flex flex-col h-full`}>
      <View style={tw`pt-[${insets.top}] bg-white dark:bg-[#18191A]   flex-1`}>
        <ScrollView
          scroll={false}
          refreshControl={
            <RefreshControl refreshing={reloading} onRefresh={onRefresh} />
          }
        >
          <HeaderHome />
          <SelectWallets />
          {/* <BonusCryptoCard /> */}
          <TabBarMenu
            tabSelected={tabSelected}
            setTabSelected={(index) => setTabSelected(index)}
          />
          {tabSelected === 0 ? (
            <ListChainsChart next="DetailChain" />
          ) : (
            <ListNFT />
          )}
          {!reloading && <News keyword="blockchain" />}
        </ScrollView>
      </View>
    </View>
  );
};

export default WalletDashboard;
