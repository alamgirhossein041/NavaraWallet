import { NETWORKS } from "./bcEnum";

export enum PlatFormEnum {
  ANDROID = "android",
  IOS = "ios",
}

export enum PinRequiredEnum {
  ENABLE_PIN_CODE = "ENABLE_PIN_CODE",
  DISABLE_PIN_CODE = "DISABLE_PIN_CODE",
  CHANGE_PIN_CODE = "CHANGE_PIN_CODE",
  NULL = "",
}

export enum BiometricTypeEnum {
  BIOMETRIC_TYPE_FACE = "BIOMETRIC_TYPE_FACE",
  BIOMETRIC_TYPE_FINGERPRINT = "BIOMETRIC_TYPE_FINGERPRINT",
  ONLY_PIN_CODE = "ONLY_PIN_CODE", // default
}

export enum TabFilterEnum {
  NFT = "NFT",
  TOKEN = "TOKEN",
  HISTORY = "HISTORY",
}

export enum GoogleClientIdEnum {
  IOS = "210953684920-0krjsjs7emopu816dmmv2ljtmtioifmv.apps.googleusercontent.com",
  WEB = "210953684920-idqecm0v1u70mtvrgdrjoae27uca3hg8.apps.googleusercontent.com",
}

export enum SupportedSwapChainsEnum {
  OPTIMISM = NETWORKS.ETHEREUM,
  POLYGON = NETWORKS.POLYGON,
  BINANCE_SMART_CHAIN = NETWORKS.BINANCE_SMART_CHAIN,
  AVALANCHE = NETWORKS.AVALANCHE,
  FANTOM = NETWORKS.FANTOM,
  // HARMONY = NETWORKS.HARMONY,
  ArBITRUM = NETWORKS.ARBITRUM,
}

export enum ParaswapEnum {
  PARTNER_ADDRESS = "0xD5ee7482cd8Da604bCF11b654d706A733C7867D0",
  PARTNER_FEE_BPS = 10,
}

export enum Web3Provider {
  ETHEREUM = "ethereum-provider",
  SOLANA = "solana-provider",
}
