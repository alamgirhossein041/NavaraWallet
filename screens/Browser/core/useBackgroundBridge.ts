import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { NETWORK_CONFIG_BY_CHAIN_ID } from "../../../configs/bcNetworks";
import { NOTIFICATION_NAMES } from "../../../constants/AppConstant";
import API from "../../../data/api";
import { browserApprovedHost } from "../../../data/globalState/browser";
import { listWalletsState } from "../../../data/globalState/listWallets";
import { NETWORKS } from "../../../enum/bcEnum";
import { useWalletSelected } from "../../../hooks/useWalletSelected";
import { JS_POST_MESSAGE_TO_PROVIDER } from "../../../utils/browserScripts";
import { createResponseMessage } from "../../../utils/web3Message";
import useApproveAccessModal from "../ApprovalAccessModal";
import useConfirmTransactionModal from "../ConfirmTransactionModal";

export const useBackgroundBridge = (props) => {
  const [approvedHosts] = useRecoilState(browserApprovedHost);
  const { webviewRef } = props;
  const [chainId, setChainId] = useState("1");
  const { data: selectedWallet } = useWalletSelected();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();
  const [ethWallet, setEthWallet] = useState<ethers.Wallet>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [rpcEndpoint, setRpcEndpoint] = useState<string>();
  const [listWallets] = useRecoilState(listWalletsState);
  const [accounts, setAccount] = useState<string[]>([]);
  const [gasPrice, setGasPrice] = useState<ethers.utils.BigNumber>();

  const postMessage = useCallback(
    (msg, origin = "*") => {
      const js = JS_POST_MESSAGE_TO_PROVIDER(msg, origin);
      if (webviewRef && webviewRef.current) {
        // webviewRef.current.postMessage(JSON.stringify(msg));
        webviewRef.current.injectJavaScript(js);
      }
    },
    [webviewRef]
  );

  const onDisconnect = useCallback(() => {
    postMessage({
      name: "metamask-provider",
      data: null,
    });
  }, [postMessage]);

  const sendNotification = useCallback(
    (data) => {
      postMessage({
        name: "metamask-provider",
        data,
      });
    },
    [postMessage]
  );

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
    setAccount(accountsList);
    const numApprovedHosts = Object.keys(approvedHosts).length;
    if (numApprovedHosts === 0) {
      sendNotification({
        method: NOTIFICATION_NAMES.ACCOUNTS_CHANGES,
        params: [],
      }); // notification should be sent regardless of approval status
    }

    if (numApprovedHosts > 0) {
      sendNotification({
        method: NOTIFICATION_NAMES.ACCOUNTS_CHANGES,
        params: [wallet.address],
      });
    }
  }, [selectedWallet, approvedHosts, chainId, listWallets, sendNotification]);

  useEffect(() => {
    let chainIdHex = `0x${parseInt(chainId, 10).toString(16)}`;
    sendNotification({
      method: NOTIFICATION_NAMES.CHAIN_CHAINED,
      params: {
        networkVersion: chainId,
        chainId: chainIdHex,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  const getGasPrice = () => {
    provider?.getGasPrice().then((gasPriceRes) => setGasPrice(gasPriceRes));
  };

  useEffect(() => {
    if (provider) {
      getGasPrice();
      const interval = setInterval(getGasPrice, 30000);
      return function () {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const {
    isOpen: isApproveAccessModalOpen,
    openModal: openApproveAccessModal,
    closeModal: closeApproveAccessModal,
    Modal: ApproveAccessModal,
  } = useApproveAccessModal({ reply: postMessage, selectedAddress });

  const {
    openModal: openConfirmTransactionModal,
    closeModal: closeConfirmTransactionModal,
    Modal: ConfirmTransactionModal,
  } = useConfirmTransactionModal({
    provider,
    wallet: ethWallet,
    reply: postMessage,
  });

  const onMessage = async (data, origin) => {
    const { data: payload } = data;
    const { method: rpcMethod } = data.data;
    let currentChainId = chainId;
    let result;
    let error;
    let requireReply = true;
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
      case "eth_requestAccounts": {
        const hostname = new URL(origin).hostname;
        if (!isApproveAccessModalOpen && !approvedHosts[hostname]) {
          openApproveAccessModal(data);
          requireReply = false;
        } else {
          result = [selectedAddress];
        }
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
          requireReply = false;
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
      case "wallet_addEthereumChain": {
        // TODO add ethereum chain feature
        break;
      }
      case "eth_sendTransaction": {
        openConfirmTransactionModal(data);
        requireReply = false;
        break;
      }
      case "eth_signTransaction": {
        // methodNotSupported
        error = { message: "Method not supported.", code: 32004 };
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
    if (requireReply) {
      let msg = createResponseMessage(
        data.name,
        payload.id,
        payload.jsonrpc,
        result,
        error
      );
      postMessage(msg, origin);
    }
    return;
  };

  return {
    onMessage,
    onDisconnect,
    selectedAddress,
    gasPrice,
    ApproveAccessModal,
    closeApproveAccessModal,
    ConfirmTransactionModal,
    closeConfirmTransactionModal,
  };
};
