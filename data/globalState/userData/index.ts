import { atom } from "recoil";
import { ENVIRONMENT } from "../../../global.config";

const walletEnvironmentState = atom({
  key: "walletEnvironmentState",
  default: ENVIRONMENT.PRODUCTION,
});

export { walletEnvironmentState };
