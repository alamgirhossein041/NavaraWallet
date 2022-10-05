import { atom } from "recoil";

const seedPhraseData = atom({
  key: "seedPhraseData",
  default: [] as string[],
});

export { seedPhraseData };
