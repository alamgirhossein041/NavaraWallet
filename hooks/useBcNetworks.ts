import { clusterApiUrl } from "@solana/web3.js";
import { useRecoilValue } from "recoil";
import {
  ALCHEMY_MAINNET_NETWORK,
  EVM_MAINNET_CONFIG,
  NEAR_MAINNET_CONFIG,
} from "../configs/bcMainnets";
import {
  ALCHEMY_TESTNET_NETWORK,
  EVM_TESTNET_CONFIG,
  NEAR_TESTNET_CONFIG,
} from "../configs/bcTestnets";
import { walletEnvironmentState } from "../data/globalState/userData";
import { NETWORK_ENVIRONMENT_ENUM } from "../enum/bcEnum";
import { ENVIRONMENT } from "../global.config";

export const useBcNetworks = () => {
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const NETWORK_ENVIRONMENT = getNetworkEnvironment(walletEnvironment);

  const NETWORK_CONFIG = getNetworkConfig(NETWORK_ENVIRONMENT);
  const SOLANA_CLUSTER_API_URL = getSolanaClusterApiUrl(NETWORK_ENVIRONMENT);
  const POLKADOT_WS_ENDPOINT = getPolkadotWsEndpoint(NETWORK_ENVIRONMENT);
  const NEAR_CONFIG = getNearConfig(NETWORK_ENVIRONMENT);
  const ALCHEMY_NETWORKS = getAlchemyNetworks(NETWORK_ENVIRONMENT);

  return {
    NETWORK_CONFIG,
    SOLANA_CLUSTER_API_URL,
    POLKADOT_WS_ENDPOINT,
    NEAR_CONFIG,
    ALCHEMY_NETWORKS,
  };
};

export const getNetworkEnvironment = (env: ENVIRONMENT) => {
  return env === ENVIRONMENT.DEVELOPMENT
    ? NETWORK_ENVIRONMENT_ENUM.TESTNET
    : NETWORK_ENVIRONMENT_ENUM.MAINNET;
};

export const getNetworkConfig = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? EVM_MAINNET_CONFIG
    : EVM_TESTNET_CONFIG;
};

export const getSolanaClusterApiUrl = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? clusterApiUrl("mainnet-beta")
    : clusterApiUrl("testnet");
};

export const getPolkadotWsEndpoint = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? "wss://rpc.polkadot.io"
    : "wss://kusama-rpc.polkadot.io";
};

export const getNearConfig = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? NEAR_MAINNET_CONFIG
    : NEAR_TESTNET_CONFIG;
};

const getAlchemyNetworks = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? ALCHEMY_MAINNET_NETWORK
    : ALCHEMY_TESTNET_NETWORK;
};
