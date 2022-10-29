import {useRecoilValue} from 'recoil';
import {walletEnvironmentState} from '../data/globalState/userData';
import {NETWORK_ENVIRONMENT_ENUM} from '../enum/bcEnum';
import {ENVIRONMENT} from '../global.config';
import mainnetConfig from '../configs/bcMainnets';
import testnetConfig from '../configs/bcTestnets';
import {clusterApiUrl} from '@solana/web3.js';

export const useBcNetworks = () => {
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const NETWORK_ENVIRONMENT = getNetworkEnvironment(walletEnvironment);

  const NETWORK_CONFIG = getNetworkConfig(NETWORK_ENVIRONMENT);
  const SOLANA_CLUSTER_API_URL = getSolanaClusterApiUrl(NETWORK_ENVIRONMENT);
  const POLKADOT_WS_ENDPOINT = getPolkadotWsEndpoint(NETWORK_ENVIRONMENT);
  const NEAR_CONFIG = getNearConfig(NETWORK_ENVIRONMENT);

  return {
    NETWORK_CONFIG,
    SOLANA_CLUSTER_API_URL,
    POLKADOT_WS_ENDPOINT,
    NEAR_CONFIG,
  };
};

export const getNetworkEnvironment = (env: ENVIRONMENT) => {
  return env === ENVIRONMENT.DEVELOPMENT
    ? NETWORK_ENVIRONMENT_ENUM.TESTNET
    : NETWORK_ENVIRONMENT_ENUM.MAINNET;
};

export const getNetworkConfig = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? mainnetConfig
    : testnetConfig;
};

export const getSolanaClusterApiUrl = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? clusterApiUrl('mainnet-beta')
    : clusterApiUrl('testnet');
};

export const getPolkadotWsEndpoint = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? 'wss://rpc.polkadot.io'
    : 'wss://kusama-rpc.polkadot.io';
};

export const getNearConfig = (env: NETWORK_ENVIRONMENT_ENUM) => {
  return env === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      }
    : {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        helperUrl: 'https://testnet-api.kitwallet.app',
        explorerUrl: 'https://explorer.testnet.near.org',
      };
};
