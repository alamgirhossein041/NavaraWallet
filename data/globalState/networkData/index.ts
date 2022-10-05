import { atom } from "recoil";

const enabledNetworkState = atom({
  key: "enabledNetwork",
  default: [] as string[],
});
const selectedNetworkState = atom({
  key: "selectedNetwork",
  default: "all" as string,
});
export { enabledNetworkState, selectedNetworkState };
