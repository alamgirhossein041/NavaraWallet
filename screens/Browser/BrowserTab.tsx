import {useNavigation} from '@react-navigation/native';
import {ethers} from 'ethers';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, GestureResponderEvent, useColorScheme, View} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {WebView} from 'react-native-webview';
import {NETWORK_CONFIG_BY_CHAIN_ID} from '../../configs/bcNetworks';
import {NEW_TAB} from '../../data/globalState/browser';
import {NETWORKS} from '../../enum/bcEnum';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {
  JS_POST_MESSAGE_TO_PROVIDER,
  SPA_urlChangeListener,
  JS_WEBVIEW_URL,
} from '../../utils/browserScripts';
import {tw} from '../../utils/tailwind';
import AddressBar from './AddressBar';
import HomePageBrowser from './HomePageBrowser';
import NavigationBarBrowser from './NavigationBarBrowser';
import InpageBridgeWeb3 from '../../core/InpageBridgeWeb3';
import queryString from 'query-string';
import API from '../../data/api';
import {useRecoilState} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import {ethErrors} from 'eth-rpc-errors';
import GrantAccessWeb3 from './GrantAccessWeb3';
import ConnectWallet from './ConnectWallet';

const webInject3Script = InpageBridgeWeb3 + SPA_urlChangeListener;

const BrowserTab = props => {
  const {tabId, updateTabData, scrollEnabled} = props;
  const navigation = useNavigation();
  const viewShotRef: any = useRef();
  const [offset, setOffset] = useState(0);
  const [isShow, setIsShow] = useState(true);
  const [initialUrl, setInitialUrl] = useState(props.initialUrl);
  const webviewRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [chainId, setChainId] = useState('1');
  const {data: selectedWallet} = useWalletSelected();
  const [walletError, setWalletError] = useState<string>();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();
  const [ethWallet, setEthWallet] = useState<ethers.Wallet>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [rpcEndpoint, setRpcEndpoint] = useState<string>();
  const [listWallets] = useRecoilState(listWalletsState);
  const [accounts, setAccount] = useState<string[]>([]);
  const [tab, setTab] = useState<any>();
  useEffect(() => {
    const {chains} = selectedWallet;
    const ethereumWallet = chains.find(
      chain => chain.network === NETWORKS.ETHEREUM,
    );
    if (!ethereumWallet) {
      Alert.alert('Wallet not found');
    } else if (!NETWORK_CONFIG_BY_CHAIN_ID[chainId]) {
      Alert.alert('No supported network.');
    } else {
      const accounts = listWallets.map(wallet => {
        const {chains} = wallet;
        const ethereumWallet = chains.find(
          chain => chain.network === NETWORKS.ETHEREUM,
        );
        return ethereumWallet.address;
      });
      setAccount(accounts);
      const config = NETWORK_CONFIG_BY_CHAIN_ID[chainId];
      setRpcEndpoint(config.rpc);
      const provider = new ethers.providers.JsonRpcProvider(config.rpc);
      const wallet = new ethers.Wallet(ethereumWallet.privateKey, provider);
      setProvider(provider);
      setEthWallet(wallet);
      setSelectedAddress(wallet.address);
    }
  }, [selectedWallet, chainId]);

  const onLoadProgress = ({nativeEvent: {progress}}) => {
    setProgress(progress);
  };

  const go = (url: string, openNewTab: boolean = false) => {
    setInitialUrl(url);
  };

  const reload = useCallback(() => {
    const {current} = webviewRef;
    current && current.reload();
  }, []);

  const goBack = useCallback(() => {
    const {current} = webviewRef;
    current && current.goBack();
    if (!tab.canGoBack) {
      gotoHomePage();
    }
  }, [tab]);

  const goNext = useCallback(() => {
    const {current} = webviewRef;
    current && current.goForward();
  }, []);

  const gotoHomePage = useCallback(() => {
    setInitialUrl(NEW_TAB);
    setProgress(0);
    setIsShow(true);
  }, []);

  const onLoadEnd = ({nativeEvent}) => {
    const {current} = webviewRef;
    current && current.injectJavaScript(JS_WEBVIEW_URL);
    updateTabData({...nativeEvent}, false);
    setTab(nativeEvent);
  };

  const onLoadStart = ({nativeEvent}) => {
    setInitialUrl(nativeEvent.url);
  };

  const openManageTabs = useCallback(async () => {
    const imageURI = await viewShotRef.current.capture();
    navigation.navigate(
      'ManageTabs' as never,
      {
        imageURI,
      } as never,
    );
  }, []);

  const onTouchStart = (e: GestureResponderEvent) => {
    const {nativeEvent} = e;
    setOffset(nativeEvent.locationY);
    scrollEnabled(false);
  };

  const onTouchEnd = (e: GestureResponderEvent) => {
    const {nativeEvent} = e;
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

  const replyMessage = (msg, origin = '*') => {
    const js = JS_POST_MESSAGE_TO_PROVIDER(msg, origin);
    if (webviewRef && webviewRef.current) {
      // webviewRef.current.postMessage(JSON.stringify(msg));
      webviewRef.current.injectJavaScript(js);
    }
  };

  const createResponseMessage = (name, id, jsonrpc, result) => {
    return {
      name: name,
      data: {
        id,
        jsonrpc,
        result,
      },
    };
  };

  const onMessage = async ({nativeEvent}) => {
    const data =
      typeof nativeEvent.data === 'string'
        ? JSON.parse(nativeEvent.data)
        : nativeEvent.data;
    const {origin} = data;

    let currentChainId = chainId;

    if (data.type) {
      const {type, payload} = data;
      switch (type) {
        case 'GET_WEBVIEW_URL': {
          break;
        }
        case 'NAV_CHANGE': {
          break;
        }
      }
    }

    if (data.name) {
      const {data: payload} = data;
      const {method: rpcMethod} = data.data;

      switch (rpcMethod) {
        case 'metamask_getProviderState':
          let chainIdHex = `0x${parseInt(currentChainId).toString(16)}`;
          let result = {
            isUnlocked: true,
            chainId: chainIdHex,
            networkVersion: chainId,
            accounts: [selectedAddress],
          };
          let msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            result,
          );
          replyMessage(msg, origin);
          break;
        case 'eth_chainId': {
          let chainIdHex = `0x${parseInt(currentChainId).toString(16)}`;
          let msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            chainIdHex,
          );
          replyMessage(msg, origin);
          break;
        }
        case 'eth_requestAccounts': {
          let result = [selectedAddress];
          let msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            result,
          );
          replyMessage(msg, origin);
          break;
        }
        case 'eth_accounts': {
          let result = accounts;
          let msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            result,
          );
          replyMessage(msg, origin);
          break;
        }
        case 'eth_getTransactionByBlockNumberAndIndex':
        case 'eth_getTransactionByBlockHashAndIndex':
        case 'eth_getTransactionByHash':
        case 'eth_call':
        case 'eth_estimateGas': {
          API.post(rpcEndpoint, {
            jsonrpc: payload.jsonrpc,
            method: rpcMethod,
            params: payload.params,
            id: payload.id,
          })
            .then((res: any) => {
              let msg = createResponseMessage(
                data.name,
                payload.id,
                payload.jsonrpc,
                res.result,
              );
              replyMessage(msg, origin);
            })
            .catch(e => console.log(e));
          break;
        }

        case 'eth_coinbase': {
          let result = accounts.length > 0 ? accounts[0] : null;
          let msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            result,
          );
          replyMessage(msg, origin);
          break;
        }
        case 'wallet_switchEthereumChain': {
          const [chainIdParam] = payload.params;
          let {chainId} = chainIdParam;
          let chainIdDec = parseInt(chainId.toLowerCase(), 16).toString(10);
          setTimeout(() => setChainId(chainIdDec), 100);
          let result = null;
          if (!NETWORK_CONFIG_BY_CHAIN_ID[chainIdDec]) {
            result = {
              code: 4902,
              message: 'No supported network.',
            };
          }
          const msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            result,
          );
          replyMessage(msg, origin);
          // setTimeout(() => {
          //   webviewRef.current.reload();
          // }, 500);
          break;
        }
        case 'eth_blockNumber': {
          provider
            .getBlockNumber()
            .then(result => {
              const msg = createResponseMessage(
                data.name,
                payload.id,
                payload.jsonrpc,
                result,
              );
              replyMessage(msg, origin);
            })
            .catch(e => {
              console.log(e.msg);
            });
          break;
        }
        case 'wallet_addEthereumChain': {
          // TODO add ethereum chain feature
        }
        case 'eth_sendTransaction': {
          console.log('eth_sendTransaction');
        }
        case 'eth_signTransaction': {
          // methodNotSupported
        }
        case 'eth_getBalance': {
          const balance = await provider.getBalance(payload.params[0]);
          const balanceInEth = ethers.utils.formatEther(balance);
          const msg = createResponseMessage(
            data.name,
            payload.id,
            payload.jsonrpc,
            balanceInEth,
          );
          replyMessage(msg, origin);
        }
        case 'eth_sign': {
        }
        default: {
          console.log(rpcMethod, 'rpcMethod');
        }
      }
    }
  };
  const theme = useColorScheme();
  return (
    <View style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
      <AddressBar
        progress={progress}
        url={initialUrl}
        onGotoHomePage={gotoHomePage}
        onGotoUrl={go}
        onReload={reload}
        {...props}
      />
      <ViewShot ref={viewShotRef}>
        <View
          style={[tw`h-full pt-12 `]}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}>
          {initialUrl === NEW_TAB ? (
            <HomePageBrowser openLink={url => go(url)} />
          ) : (
            <WebView
              pullToRefreshEnabled
              // scrollEnabled={false}
              showsVerticalScrollIndicator={true}
              originWhitelist={['*']}
              decelerationRate={'normal'}
              ref={webviewRef}
              source={{
                uri: initialUrl,
              }}
              injectedJavaScriptBeforeContentLoaded={webInject3Script}
              onMessage={onMessage}
              onLoadProgress={onLoadProgress}
              onLoadEnd={onLoadEnd}
              renderLoading={() => <></>}
              allowsInlineMediaPlayback
              javascriptEnabled
              sendCookies
              forceDarkOn={theme === 'dark'} // only Android
              useWebkit
              style={tw`bg-white dark:bg-[#18191A]`}
              allowsFullscreenVideo // only Android
              cacheEnabled
              cacheMode="LOAD_DEFAULT"
              onLoadStart={onLoadStart}
            />
          )}
        </View>
      </ViewShot>
      <NavigationBarBrowser
        tabId={tabId}
        goBack={goBack}
        url={initialUrl}
        goNext={goNext}
        onReload={reload}
        gotoHomePage={gotoHomePage}
        isShow={isShow}
        openManageTabs={openManageTabs}
        tabData={tab}
      />
      <GrantAccessWeb3 url={initialUrl} />
      <ConnectWallet url={initialUrl} />
    </View>
  );
};

export default BrowserTab;
