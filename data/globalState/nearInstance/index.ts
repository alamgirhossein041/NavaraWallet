import { atom } from "recoil";

const nearInstanceState = atom({
  key: "nearInstance",
  default: { testnet: null, mainnet: null },
});

export { nearInstanceState };
