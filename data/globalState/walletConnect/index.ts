import { atom } from "recoil";

const walletConnectState = atom({
  key: "walletConnectState",
  default: {} as any,
});

export { walletConnectState };
