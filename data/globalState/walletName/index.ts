import { atom } from "recoil";

const walletNameData = atom({
  key: "walletNameData",
  default: "" as string,
});
const listWalletAddedRecoil = atom({
  key: "listWalletAddedRecoil",
  default: [] as any[],
});

export { walletNameData, listWalletAddedRecoil };
