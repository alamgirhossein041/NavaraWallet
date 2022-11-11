import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  GestureResponderEvent,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { WebView } from "react-native-webview";
import { NEAR_MAINNET_CONFIG } from "../../configs/bcMainnets";
import { NEAR_TESTNET_CONFIG } from "../../configs/bcTestnets";
import { newTabDefaultData, NEW_TAB } from "../../data/globalState/browser";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { JS_WEBVIEW_URL } from "../../utils/browserScripts";
import { tw } from "../../utils/tailwind";
import AddressBar from "./AddressBar";
import useApprovalNearAccessModal from "./ApprovalNearAccessModal";
import useNearApprovalTransactionModal from "./ApprovalNearTransactionModal";
import { useBackgroundBridge } from "./core/useBackgroundBridge";
import HomePageBrowser from "./HomePageBrowser";
import NavigationBarBrowser from "./NavigationBarBrowser";

const BrowserTab = (props) => {
  const { tabId, updateTabData, scrollEnabled, InPageScript } = props;
  const navigation = useNavigation();
  const viewShotRef: any = useRef();
  const [offset, setOffset] = useState(0);
  const [isShow, setIsShow] = useState(true);
  const [initialUrl, setInitialUrl] = useState(props.initialUrl);
  const webviewRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const { data: selectedWallet } = useWalletSelected();
  const [tab, setTab] = useState<any>();
  const [entryScriptWeb3, setEntryScriptWeb3] = useState<string>();
  const [firstUrlLoaded, setFirstUrlLoaded] = useState(false);
  const [navigateState, setNavigateState] = useState({
    canGoBack: false,
    canGoForward: false,
  });
  const scheme = useColorScheme();
  const defaultTheme = scheme === "light" ? "white" : "#18191A";
  const [colorTheme, setColorTheme] = useState(defaultTheme);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onLoadProgress = ({ nativeEvent: { progress } }) => {
    setProgress(progress);
  };

  // const go = (url: string) => {
  //   setInitialUrl(url);
  // };

  const go = useCallback(async (url) => {
    const { current } = webviewRef;
    setInitialUrl(url);
    setFirstUrlLoaded(true);

    current &&
      current.injectJavaScript(
        `(function(){window.location.href = '${url}' })()`
      );
    return null;
  }, []);

  const reload = useCallback(() => {
    const { current } = webviewRef;
    current && current.reload();
  }, []);

  /**
   * Handle go back browser
   */
  const goBack = useCallback(() => {
    const { current } = webviewRef;
    current && current.goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateState]);

  /**
   * handle event listener back native android
   */
  const onAndroidBackPress = useCallback(() => {
    goBack();
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateState]);

  useEffect(() => {
    setEntryScriptWeb3(InPageScript);
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
    }
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onAndroidBackPress);
    };
  }, []);

  const backgroundBridge = useBackgroundBridge({
    webviewRef
  });

  const {
    selectedAddress,
    gasPrice,
    ApproveAccessModal,
    closeApproveAccessModal,
    ConfirmTransactionModal,
    closeConfirmTransactionModal,
  } = backgroundBridge;

  /**
   * Handle go foward browser
   */
  const goForward = useCallback(() => {
    const { current } = webviewRef;
    current && current.goForward();
  }, []);

  const gotoHomePage = useCallback(() => {
    setInitialUrl(NEW_TAB);
    setProgress(0);
    setIsShow(true);
    updateTabData(newTabDefaultData);
  }, [updateTabData]);

  const onLoadEnd = () => {
    const { current } = webviewRef;
    current && current.injectJavaScript(JS_WEBVIEW_URL);
  };

  const onLoadStart = ({ nativeEvent }) => {};

  const openManageTabs = useCallback(async () => {
    const imageURI = await viewShotRef.current.capture();
    navigation.navigate(
      "ManageTabs" as never,
      {
        imageURI,
      } as never
    );
  }, [navigation]);

  /**
   * Detect event scrol webview
   * @param event
   */
  const onTouchStart = (e: GestureResponderEvent) => {
    const { nativeEvent } = e;
    setOffset(nativeEvent.locationY);
    scrollEnabled(false);
  };

  /**
   * Detect event scrol webview
   * @param event
   */
  const onTouchEnd = (e: GestureResponderEvent) => {
    const { nativeEvent } = e;
    const direction = nativeEvent.locationY > offset;
    if (
      direction !== isShow &&
      Math.abs(nativeEvent.locationY - offset) > 3 &&
      initialUrl !== NEW_TAB
    ) {
      setIsShow(direction);
    }
    scrollEnabled(true);
  };

  const {
    openModal: openNearApprovalTransactionModal,
    closeModal: closeNearApprovalTransactionModal,
    Modal: NearApprovalTransactionModal,
  } = useNearApprovalTransactionModal({
    redirect: go,
  });

  const {
    openModal: openApprovalNearAccessModal,
    closeModal: closeApprovalNearAccessModal,
    Modal: ApprovalNearAccessModal,
  } = useApprovalNearAccessModal({
    redirect: go,
  });

  /**
   * Handle event listener from webview
   * @param event
   */
  const onMessage = async ({ nativeEvent }) => {
    const data =
      typeof nativeEvent.data === "string"
        ? JSON.parse(nativeEvent.data)
        : nativeEvent.data;
    const { origin } = data;

    if (data.type) {
      const { type, payload } = data;
      switch (type) {
        case "GET_WEBVIEW_URL": {
          updateTabData(payload);
          setTab(payload);
          if (payload.colorTheme) {
            setColorTheme(payload.colorTheme);
          } else {
            setColorTheme(defaultTheme);
          }
          break;
        }
        case "NAV_CHANGE": {
          break;
        }
      }
    }

    if (data.name) {
      backgroundBridge.onMessage(data, origin);
    }
  };

  /**
   * Handle event redirect to NEAR SSO
   * @param requestUrl
   * @param network
   */

  const nearRequestHandler = (requestUrl: string, network: string) => {
    const url = new URL(requestUrl);
    switch (url.pathname) {
      case "/login/":
        openApprovalNearAccessModal(url, network);
        break;
      case "/sign":
        openNearApprovalTransactionModal(url, network);
        break;
      default: {
      }
    }
  };

  /**
   * handle event onShouldStartLoadWithRequest webview
   * @param event
   * @returns boolean
   */
  const onShouldStartLoadWithRequest = (event) => {
    console.log(event);

    const { url } = event;
    if (url.startsWith(NEAR_MAINNET_CONFIG.walletUrl)) {
      nearRequestHandler(url, NEAR_MAINNET_CONFIG.networkId);
      return false;
    } else if (url.startsWith(NEAR_TESTNET_CONFIG.walletUrl)) {
      nearRequestHandler(url, NEAR_TESTNET_CONFIG.networkId);
      return false;
    }
    return true;
  };

  const theme = useColorScheme();
  return (
    <View style={tw`flex-1 bg-white dark:bg-[#18191A]`}>
      <AddressBar
        colorTheme={colorTheme}
        progress={progress}
        contextUrl={initialUrl}
        onGotoHomePage={gotoHomePage}
        onGotoUrl={go}
        onReload={reload}
        {...props}
      />
      <ViewShot ref={viewShotRef}>
        <View
          style={[tw`h-full pt-12 `]}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {initialUrl === NEW_TAB ? (
            <HomePageBrowser openLink={(url) => go(url)} />
          ) : (
            <View style={[tw`h-full`]}>
              {!!entryScriptWeb3 && (
                <WebView
                  onNavigationStateChange={({ canGoBack, canGoForward }) =>
                    setNavigateState({ canGoBack, canGoForward })
                  }
                  pullToRefreshEnabled // only IOS
                  // scrollEnabled={false}
                  setSupportMultipleWindows={false}
                  showsVerticalScrollIndicator={true}
                  originWhitelist={["*"]}
                  decelerationRate={"normal"}
                  ref={webviewRef}
                  source={{
                    uri: initialUrl,
                  }}
                  // Inject Web3 script before content loaded
                  injectedJavaScriptBeforeContentLoaded={entryScriptWeb3}
                  onMessage={onMessage}
                  onLoadProgress={onLoadProgress}
                  onLoadEnd={onLoadEnd}
                  renderLoading={() => <></>}
                  allowsInlineMediaPlayback
                  javascriptEnabled
                  sendCookies
                  forceDarkOn={theme === "dark"} // only Android, ios default enable
                  useWebkit={false}
                  onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                  style={tw`bg-white dark:bg-[#18191A]`}
                  allowsFullscreenVideo // only Android, ios default enable
                  cacheEnabled
                  cacheMode="LOAD_DEFAULT"
                  onLoadStart={onLoadStart}
                />
              )}
            </View>
          )}
        </View>
      </ViewShot>
      <NavigationBarBrowser
        tabId={tabId}
        navigateState={navigateState}
        goBack={goBack}
        url={initialUrl}
        goForward={goForward}
        onReload={reload}
        gotoHomePage={gotoHomePage}
        isShow={isShow}
        openManageTabs={openManageTabs}
        tabData={tab}
      />
      {tab && ( //Tab is loaded to run script auto confirm transaction modal
        <View>
          <ApproveAccessModal
            url={initialUrl}
            closeModal={closeApproveAccessModal}
            selectedAddress={selectedAddress}
            selectedWallet={selectedWallet}
            favicon={tab?.icon}
          />
          <ConfirmTransactionModal
            url={initialUrl}
            closeModal={closeConfirmTransactionModal}
            selectedAddress={selectedAddress}
            selectedWallet={selectedWallet}
            gasPrice={gasPrice}
            favicon={tab?.icon}
          />
          <ApprovalNearAccessModal
            favicon={tab?.icon}
            url={initialUrl}
            closeModal={closeApprovalNearAccessModal}
          />
          <NearApprovalTransactionModal
            closeModal={closeNearApprovalTransactionModal}
          />
        </View>
      )}
    </View>
  );
};

export default BrowserTab;
