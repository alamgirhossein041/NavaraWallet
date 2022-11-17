import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRecoilState } from "recoil";
import { eventHub } from "../App";
import { NETWORK_CONFIG_BY_CHAIN_ID } from "../configs/bcNetworks";
import { NOTIFICATION_NAMES } from "../constants/AppConstant";
import API from "../data/api";
import { browserApprovedHost } from "../data/globalState/browser";
import { useBrowserActions } from "../data/globalState/browser/browser.actions";
import { listWalletsState } from "../data/globalState/listWallets";
import { Web3Provider } from "../enum";
import { NETWORKS } from "../enum/bcEnum";
import { useWalletSelected } from "../hooks/useWalletSelected";
import { DISPATCH_NOTIFICATION } from "../utils/storage";
import { JS_POST_MESSAGE_TO_PROVIDER } from "./browserScripts";
import { confirmEvent } from "./eventConfirm";
import { EVENT_APPROVED_ACTION_RESPONSE, EVENT_TYPE } from "./eventHub";
import { createResponseMessage } from "./web3Message";

export class Port {
  private webviewRef: any;

  constructor(webviewRef) {
    this.webviewRef = webviewRef;
  }

  postMessage(msg, origin = "*") {
    const js = JS_POST_MESSAGE_TO_PROVIDER(msg, origin);
    if (this.webviewRef && this.webviewRef.current) {
      // webviewRef.current.postMessage(JSON.stringify(msg));
      this.webviewRef.current.injectJavaScript(js);
    }
  }
}

export const useEthereumBackgroundBridge = (props) => {
  const [approvedHosts] = useRecoilState(browserApprovedHost);
  const { webviewRef, isWalletConnect } = props;
  const [chainId, setChainId] = useState("3");
  const { data: selectedWallet } = useWalletSelected();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();
  const [ethWallet, setEthWallet] = useState<ethers.Wallet>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [rpcEndpoint, setRpcEndpoint] = useState<string>();
  const [listWallets] = useRecoilState(listWalletsState);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [gasPrice, setGasPrice] = useState<ethers.utils.BigNumber>();
  const { addApprovedHost } = useBrowserActions();
  const [isModalConfirmAccessOpen, setModalConfirmAccessOpen] =
    useState<boolean>(false);

  const port = useMemo(() => {
    if (!isWalletConnect) {
      return new Port(webviewRef);
    }
    return { postMessage() {} };
  }, [isWalletConnect, webviewRef]);

  const onDisconnect = useCallback(() => {
    port.postMessage({
      name: Web3Provider.ETHEREUM,
      data: null,
    });
  }, [port]);

  const sendNotification = useCallback(
    (data, currentState) => {
      if (isWalletConnect) {
        const { method, params } = data;
        if (method === NOTIFICATION_NAMES.CHAIN_CHAINED) {
          eventHub.emit(DISPATCH_NOTIFICATION, {
            ...currentState,
            chainId: params.chainId,
          });
          return;
        }
        if (method === NOTIFICATION_NAMES.ACCOUNTS_CHANGES) {
          eventHub.emit(DISPATCH_NOTIFICATION, {
            ...currentState,
            accounts: params,
          });
          return;
        }

        return;
      } else {
        let notification = {
          name: Web3Provider.ETHEREUM,
          data,
        };
        port.postMessage(notification);
      }
    },
    [isWalletConnect, port]
  );

  const currentState = useMemo(() => {
    return {
      accounts: [selectedAddress],
      chainId: `0x${parseInt(chainId, 10).toString(16)}`,
    };
  }, [chainId, selectedAddress]);

  useEffect(() => {
    const { chains } = selectedWallet;
    const ethereumWallet = chains.find(
      (chain) => chain.network === NETWORKS.ETHEREUM
    );

    const accountsList = listWallets.map((wallet) => {
      const { chains: chainsList } = wallet;
      const ethAddress = chainsList.find(
        (chain) => chain.network === NETWORKS.ETHEREUM
      ).address;
      return ethAddress;
    });
    const config = NETWORK_CONFIG_BY_CHAIN_ID[chainId];

    const currentProvider = new ethers.providers.JsonRpcProvider(config.rpc);
    const wallet = new ethers.Wallet(
      ethereumWallet.privateKey,
      currentProvider
    );
    setRpcEndpoint(config.rpc);
    setProvider(currentProvider);
    setEthWallet(wallet);
    setSelectedAddress(wallet.address);
    setAccounts(accountsList);
    const numApprovedHosts = Object.keys(approvedHosts).length;

    if (numApprovedHosts === 0) {
      sendNotification(
        {
          method: NOTIFICATION_NAMES.ACCOUNTS_CHANGES,
          params: [],
        },
        currentState
      ); // notification should be sent regardless of approval status
    }

    if (numApprovedHosts > 0) {
      sendNotification(
        {
          method: NOTIFICATION_NAMES.ACCOUNTS_CHANGES,
          params: [wallet.address],
        },
        currentState
      );
    }
  }, [selectedWallet, approvedHosts, chainId, listWallets, sendNotification]);

  useEffect(() => {
    let chainIdHex = `0x${parseInt(chainId, 10).toString(16)}`;
    sendNotification(
      {
        method: NOTIFICATION_NAMES.CHAIN_CHAINED,
        params: {
          networkVersion: chainId,
          chainId: chainIdHex,
        },
      },
      currentState
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  const getGasPrice = () => {
    provider?.getGasPrice().then((gasPriceRes) => setGasPrice(gasPriceRes));
  };

  useEffect(() => {
    if (provider) {
      getGasPrice();
      const interval = setInterval(getGasPrice, 10000);
      return function () {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const requestAccessHandler = async (host, hostname, favicon, address) => {
    let isApproved = false;
    let result;
    let error;
    if (isModalConfirmAccessOpen) {
      return;
    } else if (!approvedHosts[hostname]) {
      setTimeout(() => {
        setModalConfirmAccessOpen(true);
      }, 0);
      isApproved = await confirmEvent({
        approvalButtonText: "Confirm",
        type: EVENT_TYPE.DAPP_CONNECT_REQUEST,
        payload: { url: host, address, favicon },
      });
      setModalConfirmAccessOpen(false);
    } else {
      isApproved = true;
    }
    if (isApproved) {
      addApprovedHost(hostname);
      result = [address];
    } else {
      error = {
        code: 4001,
        message: "User rejected",
      };
    }
    eventHub.emit(EVENT_APPROVED_ACTION_RESPONSE, {});
    return { result, error };
  };

  const onMessage = async (data, information) => {
    const { host, favicon } = information;
    const { data: payload } = data;
    const { method: rpcMethod } = data.data;
    let currentChainId = chainId;
    let result;
    let error;
    const hostname = new URL(host).hostname;
    switch (rpcMethod) {
      case "metamask_getProviderState":
        let chainIdHex = `0x${parseInt(currentChainId, 10).toString(16)}`;
        result = {
          isUnlocked: true,
          chainId: chainIdHex,
          networkVersion: chainId,
          accounts: [selectedAddress],
        };
        break;
      case "eth_chainId": {
        result = `0x${parseInt(currentChainId, 10).toString(16)}`;
        break;
      }
      case "session_request": {
        const { result: requestResult, error: requestError } =
          await requestAccessHandler(host, hostname, favicon, selectedAddress);
        if (requestResult) {
          result = { accounts: requestResult, chainId: chainId };
        } else {
          error = requestError;
        }
        eventHub.emit(EVENT_APPROVED_ACTION_RESPONSE, {});
        break;
      }
      case "eth_requestAccounts": {
        const { result: requestResult, error: requestError } =
          await requestAccessHandler(host, hostname, favicon, selectedAddress);
        if (requestResult) {
          result = requestResult;
        } else {
          error = requestError;
        }
        eventHub.emit(EVENT_APPROVED_ACTION_RESPONSE, {});
        break;
      }
      case "eth_accounts": {
        result = [selectedAddress];
        break;
      }
      case "eth_getTransactionByBlockNumberAndIndex":
      case "eth_getTransactionByBlockHashAndIndex":
      case "eth_getTransactionByHash":
      case "eth_call":
      case "eth_getCode":
      case "eth_estimateGas": {
        let res: any = await API.post(rpcEndpoint, {
          jsonrpc: payload.jsonrpc,
          method: rpcMethod,
          params: payload.params,
          id: payload.id,
        });
        result = res.result;
        break;
      }
      case "eth_coinbase": {
        result = accounts.length > 0 ? accounts[0] : null;
        break;
      }
      case "wallet_switchEthereumChain": {
        const [chainIdPayload] = payload.params;
        let { chainId: chainIdParam } = chainIdPayload;
        let chainIdDec = parseInt(chainIdParam.toLowerCase(), 16).toString(10);
        const config = NETWORK_CONFIG_BY_CHAIN_ID[chainIdDec];
        result = null;
        error = null;
        if (config) {
          setRpcEndpoint(config.rpc);
          const newProvider = new ethers.providers.JsonRpcProvider(config.rpc);
          const wallet = new ethers.Wallet(ethWallet.privateKey, provider);
          setProvider(newProvider);
          setEthWallet(wallet);
          setSelectedAddress(wallet.address);
          setChainId(chainIdDec);
        } else {
          error = {
            code: 4100,
            message:
              "The requested account and/or method has not been authorized by the user.",
          };
        }
        break;
      }
      case "eth_getBlockByNumber": {
        try {
          result = await provider.getBlock(payload[0], payload[1]);
        } catch (e) {
          error = { message: e.message, code: 32603 };
        }
        break;
      }
      case "eth_blockNumber": {
        try {
          result = await provider.getBlockNumber();
        } catch (e) {
          error = { message: error.message, code: 32603 };
        }
        break;
      }
      case "eth_sendTransaction": {
        let isApproved = false;
        const transaction = payload.params[0];
        if (isModalConfirmAccessOpen) {
          return;
        } else {
          isApproved = await confirmEvent({
            approvalButtonText: "Confirm",
            type: EVENT_TYPE.CONFIRM_TRANSACTION,
            payload: {
              url: host,
              selectedAddress,
              favicon,
              transaction,
              provider,
              gasPrice,
            },
          });
        }

        if (isApproved) {
          try {
            delete transaction.gas;
            delete transaction.from;
            const response = await ethWallet.sendTransaction(transaction);
            const { hash } = response;
            result = hash;
          } catch (e) {
            error = {
              code: 32010,
              message: e.message,
            };
          }
        } else {
          error = {
            code: 4001,
            message: "User rejected",
          };
        }
        eventHub.emit(EVENT_APPROVED_ACTION_RESPONSE, {});
        break;
      }
      case "eth_signTransaction": {
        // methodNotSupported
        error = { message: "Method not supported.", code: 32004 };
        break;
      }
      case "eth_getTransactionReceipt": {
        result = await provider.getTransactionReceipt(payload.params[0]);
        break;
      }
      case "eth_getBalance": {
        try {
          const balance = await provider.getBalance(payload.params[0]);
          result = ethers.utils.formatEther(balance);
        } catch (e) {
          error = { message: e.message, code: 32603 };
        }
        break;
      }
      case "eth_sign": {
        error = { message: "Method not supported.", code: 32004 };
        break;
      }
      case "personal_sign": {
        let dataHash = ethers.utils.arrayify(payload.params[0]);
        const signature = await ethWallet.signMessage(dataHash);
        result = signature;
        break;
      }
      case "wallet_addEthereumChain": {
        const addedChainId = payload.params[0].chainId;
        const chainIdDec = parseInt(addedChainId.toLowerCase(), 16).toString(
          10
        );
        if (NETWORK_CONFIG_BY_CHAIN_ID[chainIdDec]) {
          setChainId(chainIdDec);
          result = null;
        } else {
          Alert.alert("Network not supported.");
          return;
        }
        break;
      }
      case "eth_gasPrice": {
        try {
          const gasPriceBn = await provider.getGasPrice();
          setGasPrice(gasPriceBn);
          result = gasPriceBn.toHexString();
        } catch (e) {
          error = { message: error.message, code: 32603 };
        }
        break;
      }
      default: {
      }
    }
    let msg = createResponseMessage(
      data.name,
      payload.id,
      payload.jsonrpc,
      result,
      error
    );
    if (!isWalletConnect) {
      port.postMessage(msg, host);
    } else {
      return msg;
    }
  };

  return {
    onMessage,
    onDisconnect,
    selectedAddress,
    gasPrice,
  };
};
