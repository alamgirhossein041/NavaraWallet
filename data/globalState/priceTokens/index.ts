import { atom } from "recoil";

const priceTokenState = atom({
  key: "priceTokenState",
  default: null as any,
});

export { priceTokenState };
