import React, { useEffect } from "react";
import { eventHub } from "../../App";
import {
  EVENT_HANDLE_RPC_REQUEST,
  EVENT_HANDLE_RPC_RESPONSE,
} from "../../core/eventHub";
import { useEthereumBackgroundBridge } from "../../core/useEthereumBackgroundBridge";

export default function WalletConnect() {
  const backgroundBridge = useEthereumBackgroundBridge({
    isWalletConnect: true,
  });

  useEffect(() => {
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
