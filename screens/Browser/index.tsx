import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { cloneDeep } from "lodash";
import { View } from "native-base";
import React, { useEffect, useMemo, useRef } from "react";
import { StatusBar, useColorScheme } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { useRecoilState, useRecoilValue } from "recoil";
import BackButton from "../../components/UI/BackButton";
import { SPA_urlChangeListener } from "../../core/browserScripts";
import useDatabase from "../../data/database/useDatabase";
import {
  browserState,
  currentTabState,
  NEW_TAB,
} from "../../data/globalState/browser";
import { useBrowserActions } from "../../data/globalState/browser/browser.actions";
import useNearInstanceAction from "../../data/globalState/nearInstance/nearInstance.actions";
import { NETWORKS } from "../../enum/bcEnum";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { BROWSER_TABS, localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import BrowserHistory from "./BrowserHistory";
import BrowserTab from "./BrowserTab";
import InpageBridgeWeb3 from "./core/InpageBridgeWeb3";
import SolanaInpageBridge from "./core/SolanaInpageBridge";
import FavoritesList from "./FavoritesList";
import ManageTabs from "./ManageTabs";
import SearchEngine from "./Settings/SearchEngine";
import SettingsMenu from "./Settings/SettingsMenu";

const InPageScript =
  InpageBridgeWeb3 + SolanaInpageBridge + SPA_urlChangeListener;

const MainBrowser = ({ route }) => {
  const { params } = route;
  const { historyBrowserController } = useDatabase();
  const { createTabBrowser } = useBrowserActions();
  const tabsRef = useRef(null);
  const [browser, setBrowser] = useRecoilState(browserState);
  const currentTab = useRecoilValue(currentTabState);

  const { data: selectedWallet } = useWalletSelected();

  const { setInstance } = useNearInstanceAction();

  useEffect(() => {
    const { chains } = selectedWallet;
    const nearWallet = chains.find((chain) => chain.network === NETWORKS.NEAR);
    setInstance(nearWallet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWallet]);

  const setToPage = (index) => {
    const { current } = tabsRef;
    if (!!current) {
      current.setPageWithoutAnimation(index);
    }
  };

  useEffect(() => {
    setToPage(currentTab);
  }, [currentTab]);

  const updateTabData = (data, index, isReloading) => {
    const dataUpdate = cloneDeep(browser);
    dataUpdate[index] = { ...dataUpdate[index], ...data };
    setBrowser(dataUpdate);
    if (isReloading || data.url === NEW_TAB) return;

    //update to history browser if not reloading
    historyBrowserController.createHistoryBrowser(data);
  };

  useEffect(() => {
    if (!!params?.url) {
      setBrowser([
        { url: params.url, id: uuid.v4() as string, title: "New tab" },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (browser.length > 0) {
      localStorage.set(BROWSER_TABS, browser);
    }
  }, [browser]);
  const scheme = useColorScheme();
  const statusBarStyle = useMemo(() => {
    let backgroundColor = "white";
    let barStyle = "dark-content";
    if (!browser[currentTab]?.colorTheme) {
      return;
    }
    if (
      browser[currentTab].colorTheme === "#000000" ||
      browser[currentTab].url === NEW_TAB
    ) {
      // black
      backgroundColor = "white";
    }
    // Default or white
    else if (
      browser[currentTab].colorTheme === null ||
      browser[currentTab].colorTheme === "#ffffff"
    ) {
      barStyle = "dark-content";
      // set background with web color
    } else {
      backgroundColor = browser[currentTab].colorTheme;
      barStyle = "light-content";
    }
    return {
      backgroundColor,
      barStyle,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser[currentTab]]);
  return (
    <View style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
      {scheme === "light" && <StatusBar {...(statusBarStyle as any)} />}
      <SafeAreaView style={tw`flex-1`} edges={["top"]}>
        <PagerView
          testID="pager-view"
          ref={tabsRef}
          scrollEnabled={false}
          style={tw`flex-1`}
          overdrag
          initialPage={currentTab}
        >
          {browser.map((tab, index) => (
            <BrowserTab
              key={tab.id}
              initialUrl={tab.url}
              updateTabData={(data, isReloading) =>
                updateTabData(data, index, isReloading)
              }
              InPageScript={InPageScript}
              scrollEnabled={() => {}}
              tabId={tab.id}
              {...tab}
            />
          ))}
        </PagerView>
      </SafeAreaView>
    </View>
  );
};

const Stack = createStackNavigator();
const StackBrowser = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        headerLeft: () => (
          <View style={tw`px-3`}>
            <BackButton />
          </View>
        ),
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MainBrowser"
        component={MainBrowser}
      />
      <Stack.Screen
        options={{
          title: "History",
        }}
        name="BrowserHistory"
        component={BrowserHistory}
      />
      <Stack.Screen
        options={{
          title: "Favorites List",
        }}
        name="FavoritesList"
        component={FavoritesList}
      />
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
        name="ManageTabs"
        component={ManageTabs}
      />
      <Stack.Screen
        name="SettingsBrowser"
        options={{
          title: "Browser settings",
        }}
        component={SettingsMenu}
      />
      <Stack.Screen
        name="SearchEngine"
        options={{
          title: "Default search engine",
        }}
        component={SearchEngine}
      />
    </Stack.Navigator>
  );
};
export { MainBrowser };
export default React.memo(StackBrowser);
