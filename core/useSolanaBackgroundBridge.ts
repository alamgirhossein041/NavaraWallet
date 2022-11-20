import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { browserApprovedHost } from "../data/globalState/browser";
import { listWalletsState } from "../data/globalState/listWallets";
import { NETWORKS } from "../enum/bcEnum";
import { ENVIRONMENT } from "../global.config";
import { useWalletSelected } from "../hooks/useWalletSelected";
import { isSameNetwork } from "../utils/network";
import { JS_EMIT_EVENT_TO_WEBVIEW } from "./browserScripts";

export const useSolanaBackgroundBridge = (props) => {
  const [approvedHosts] = useRecoilState(browserApprovedHost);

  const { webviewRef } = props;
  const [network, setNetwork] = useState<ENVIRONMENT>(ENVIRONMENT.PRODUCTION);
  const [address, setAddress] = useState("");
  const [connection, setConnection] = useState<Connection>();
  const [keypair, setKeypair] = useState<Keypair>();
  const [accounts, setAccounts] = useState<string[]>([]);

  const { data: selectedWallet } = useWalletSelected();
  const [listWallets] = useRecoilState(listWalletsState);

  const postMessage = useCallback(
    (msg, channel) => {
      const js = JS_EMIT_EVENT_TO_WEBVIEW(msg, channel);
      if (webviewRef && webviewRef.current) {
        webviewRef.current.injectJavaScript(js);
      }
    },
    [webviewRef]
  );

  useEffect(() => {
    const { chains } = selectedWallet;
    const solanaWallet = chains.find((chain) =>
      isSameNetwork(chain.network, NETWORKS.SOLANA)
    );

    let _keypair = Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(solanaWallet.privateKey))
    );

    const cluster =
      network === ENVIRONMENT.PRODUCTION
        ? clusterApiUrl("mainnet-beta")
        : clusterApiUrl("testnet");

    const _connection = new Connection(cluster);
    setKeypair(_keypair);
    setAddress(_keypair.publicKey.toBase58());
    setConnection(_connection);

    const accountsList = listWallets.map((wallet) => {
      const { chains: chainsList } = wallet;
      const ethAddress = chainsList.find((chain) =>
        isSameNetwork(chain.network, NETWORKS.SOLANA)
      ).address;
      return ethAddress;
    });
    setAccounts(accountsList);
  }, [listWallets, network, selectedWallet]);

  const onMessage = async (data, information: any) => {
    const { host, favicon } = information;
    const { payload, channel } = data;
    const { params, method: rpcMethod } = payload;
    let message = {
      method: rpcMethod,
      params: {},
      id: payload.id,
    };
    switch (rpcMethod) {
      case "connect": {
        message.params = {
          publicKey: address,
          autoApprove: true,
        };
        break;
      }
      default: {
        break;
      }
    }
    postMessage(message, channel);
  };

  return { onMessage };
};
