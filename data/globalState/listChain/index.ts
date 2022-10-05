import { atom } from "recoil";

const listChain = atom({
  key: "listChain",
  default: [] as string[],
});

export {listChain };
