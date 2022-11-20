import { atom } from "recoil";

const walletConnectState = atom({
  key: "walletConnectState",
  default: {} as any,
});

const isConnectedState = atom({
  default: false,
  key: "isConnectedState",
});

export { walletConnectState, isConnectedState };
