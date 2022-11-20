import WalletConnect from "@walletconnect/client";
import { eventHub } from "../../App";
import getETHAddressFromChains from "../../utils/getETHAddressFromChains";
import { localStorage, WALLETCONNECT_SESSIONS } from "../../utils/storage";
import toastr from "../../utils/toastr";
import {
  EVENT_CONNECTED_SESSION,
  EVENT_HANDLE_RPC_REQUEST,
  EVENT_HANDLE_RPC_RESPONSE,
  EVENT_SESSION_UPDATED,
} from "../eventHub";

/**
 * Event emit by WalletConnect
 * - docs https://docs.walletconnect.com/quick-start/wallets/react-native
 */

const SESSION_REQUEST_EVENT = "session_request";
const SESSION_UPDATE_EVENT = "session_update";
const CALL_REQUEST = "call_request";
const DISCONNECT = "disconnect";
const OPTION_WALLETCONNECT = {
  clientMeta: {
    description: "Navara Wallet",
    url: "https://navara.network/",
    icons: [
      "https://firebasestorage.googleapis.com/v0/b/navara-network.appspot.com/o/app%20icon.png?alt=media&token=816bd89a-8043-4e03-803c-dade3b1de4e7",
    ],
    name: "Navara",
    ssl: true,
  },
};

/**
 * Get ETH address from list multi chains
 * @param chains
 * @returns
 */

/**
 * Custom Hook handle session WalletConnect connector instance
 * @returns instance
 */

let listConnectors: any[] = [];
const updateSessionToLocalStorage = async () => {
  const sessions = listConnectors
    .filter(
      (wcc: WalletConnectClient) => wcc.connector && wcc.connector.connected
    )
    .map((wcc: WalletConnectClient) => {
      return {
        ...wcc.connector.session,
        lastAccess: new Date(),
      };
    });
  await localStorage.set(WALLETCONNECT_SESSIONS, sessions);
  if (sessions.length === 0) {
    eventHub.emit(EVENT_CONNECTED_SESSION, {
      isConnected: false,
    });
  }
};

const walletConnect = {
  /**
   * get listConnectors value
   */
  listConnectors,
  eventHub,
  initInstance: async () => {
    const oldSessions: any[] =
      ((await localStorage.get(WALLETCONNECT_SESSIONS)) as any[]) || [];
    // reconnect sessions from local storage
    if (oldSessions && oldSessions.length > 0) {
      oldSessions.forEach((session) => {
        const walletConnectClient = new WalletConnectClient({ session }, true);
        listConnectors.push(walletConnectClient);
      });
    }
  },

  /**
   * Create new session WalletConnect with config ({uri?, brige?})
   */
  createSession: (config, wallet) => {
    const address = getETHAddressFromChains(wallet.data.chains);
    if (!address) {
      toastr.error("Cannot get ethereum address, please try again!");
      return;
    }

    listConnectors.push(new WalletConnectClient({ ...config, address }));
  },

  killSession: (peerId) => {
    if (!peerId) {
      return;
    }
    const connectorToKill = listConnectors.find(
      (walletConnectClient) =>
        walletConnectClient &&
        walletConnectClient.connector &&
        walletConnectClient.connector.connected &&
        walletConnectClient.connector.peerId === peerId
    );
    if (!!connectorToKill) {
      connectorToKill.killSession();
      listConnectors = listConnectors.filter(
        (walletConnectClient) => walletConnectClient.connector.peerId !== peerId
      );
    }
    updateSessionToLocalStorage();
  },
};

/**
 * Handle an WalletConnect instance connector
 * @params option
 * @params wallet
 * @params address
 */
class WalletConnectClient {
  public connector: WalletConnect;
  public createdAt;
  private connectorData;
  constructor(option, existing?: boolean) {
    this.connector = new WalletConnect({
      ...option,
      ...OPTION_WALLETCONNECT,
    });
    eventHub.emit(EVENT_CONNECTED_SESSION, {
      isConnected: true,
    });
    this.connectorData = {
      origin: this.connector?.peerMeta?.url,
      icon: this.connector?.peerMeta?.icons[0],
      peerId: this.connector?.peerId,
    };
    this.connector.on(SESSION_REQUEST_EVENT, async (error, payload) => {
      if (error) {
        throw error;
      }
      const param = payload.params[0];
      this.connectorData = {
        origin: param.peerMeta.url,
        peerId: param.peerId,
        icon: param.peerMeta?.icons[0],
      };
      const { id, jsonrpc, method } = payload;

      this.initBackgroundBridgeListener(existing);
      eventHub.emit(EVENT_HANDLE_RPC_REQUEST, {
        data: {
          id,
          jsonrpc,
          method: method,
          toNative: true,
        },
        name: "walletConnect-provider",
        ...this.connectorData,
        method,
      });
    });

    this.connector.on(SESSION_UPDATE_EVENT, (error, payload) => {});

    this.connector.on(CALL_REQUEST, (error, payload) => {
      if (error) {
        throw error;
      }
      const { method, id, jsonrpc, params } = payload;
      let requestPayload = {
        id,
        jsonrpc,
        params,
        method,
        toNative: true,
      };
      eventHub.emit(EVENT_HANDLE_RPC_REQUEST, {
        data: requestPayload,
        name: "walletConnect-provider",
        ...this.connectorData,
        method: CALL_REQUEST,
      });
    });

    this.connector.on(DISCONNECT, (error) => {
      if (error) {
        throw error;
      }
      toastr.info("Session disconnected");

      updateSessionToLocalStorage();
    });
  }
  public killSession() {
    this.connector.killSession();
  }

  private initBackgroundBridgeListener(existing?: boolean) {
    eventHub.removeAllListeners(
      `${EVENT_HANDLE_RPC_RESPONSE}:${this.connectorData.peerId}`
    );
    eventHub.on(
      `${EVENT_HANDLE_RPC_RESPONSE}:${this.connectorData.peerId}`,
      (response) => {
        const { data, method } = response;
        const { result, error } = data;
        switch (method) {
          case SESSION_REQUEST_EVENT: {
            if (result) {
              if (existing) {
                this.connector.updateSession(result);
              } else {
                this.connector.approveSession(result);
                updateSessionToLocalStorage();
              }
              toastr.info("Connected");
            } else {
              this.connector.rejectSession(error.message);
            }
            break;
          }
          case CALL_REQUEST: {
            if (error) {
              this.connector.rejectRequest(data);
            } else {
              this.connector.approveRequest(data);
            }
            break;
          }
        }
      }
    );
    eventHub.on(EVENT_SESSION_UPDATED, (notification) => {
      try {
        this.connector.updateSession(notification);
      } catch (e) {}
    });
  }
}

export { OPTION_WALLETCONNECT };
export default walletConnect;
