import { atom, selector } from "recoil";

export const selectedTokenState = atom({
  key: "selectedToken",
  default: [] as string[],
});
