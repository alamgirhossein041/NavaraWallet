import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { eventHub } from "../../App";
import {
  BACKGROUND_BRIDGE_UPDATED,
  EVENT_CONNECTED_SESSION,
  EVENT_HANDLE_RPC_REQUEST,
  EVENT_HANDLE_RPC_RESPONSE,
  UPDATE_BACKGROUND_BRIDGE,
} from "../../core/eventHub";
import { useEthereumBackgroundBridge } from "../../core/useEthereumBackgroundBridge";
import { isConnectedState } from "../../data/globalState/walletConnect";

export default function WalletConnect() {
  const backgroundBridge = useEthereumBackgroundBridge({
    isWalletConnect: true,
  });
  const { setChainId } = backgroundBridge;

  useEffect(() => {
    eventHub.emit(BACKGROUND_BRIDGE_UPDATED, {
      chainId: backgroundBridge.chainId,
    });
  }, [backgroundBridge.chainId]);

  const setIsConnected = useSetRecoilState(isConnectedState);

  useEffect(() => {
    eventHub.removeAllListeners(EVENT_CONNECTED_SESSION);
    eventHub.on(EVENT_CONNECTED_SESSION, (params) => {
      setIsConnected(params.isConnected);
    });

    eventHub.removeAllListeners(UPDATE_BACKGROUND_BRIDGE);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    eventHub.on(UPDATE_BACKGROUND_BRIDGE, ({ chainId }) => {
      setChainId(chainId);
    });

    if (backgroundBridge) {
      eventHub.removeAllListeners(EVENT_HANDLE_RPC_REQUEST);
      eventHub.on(EVENT_HANDLE_RPC_REQUEST, async (data) => {
        const { origin, icon, peerId, method } = data;
        const response = await backgroundBridge.onMessage(data, {
          host: origin,
          favicon: icon,
        });
        eventHub.emit(`${EVENT_HANDLE_RPC_RESPONSE}:${peerId}`, {
          ...response,
          peerId,
          method,
        });
      });
    }
  }, [backgroundBridge]);
  return <></>;
}
