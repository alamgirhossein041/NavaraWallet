export enum NETWORK_ENVIRONMENT_ENUM {
  MAINNET,
  TESTNET,
}

export enum RpcProviderMethod {
  getDefaultProvider = 'getDefaultProvider',
  JsonRpcProvider = 'JsonRpcProvider',
}

export enum NETWORKS {
  ETHEREUM = 'ETHEREUM',
  // POLYGON = 'POLYGON',
  BINANCE_SMART_CHAIN = 'BINANCE_SMART_CHAIN',
  AVALANCHE = 'AVALANCHE',
  FANTOM = 'FANTOM',
  AURORA = 'AURORA',
  // HARMONY = 'HARMONY',
  HUOBI_CHAIN = 'HUOBI_CHAIN',
  CRONOS = 'CRONOS',
  OPTIMISM = 'OPTIMISM',
  ARBITRUM = 'ARBITRUM',

  NEAR = 'NEAR',
  SOLANA = 'SOLANA',

  // BITCOIN = 'BITCOIN'
}

export const defaultEnabledNetworks = [
  NETWORKS.ETHEREUM,
  NETWORKS.SOLANA,
  NETWORKS.NEAR,
];
