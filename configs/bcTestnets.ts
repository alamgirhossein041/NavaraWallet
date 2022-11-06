import {RpcProviderMethod, NETWORKS} from '../enum/bcEnum';

export const EVM_TESTNET_CONFIG = {
  [NETWORKS.ETHEREUM]: {
    name: 'ROPSTEN',
    provider: 'ropsten',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    rpc: 'https://ropsten.infura.io/v3/a383cc1a30ed4d64ab93408862cdf8d7',
    chainId: 3,
  },
  // [NETWORKS.POLYGON]: {
  //   name: "MUMBAI",
  //   providerMethod: RpcProviderMethod.JsonRpcProvider,
  //   chainId: 80001,
  //   rpc: "https://rpc-mumbai.matic.today",
  // },
  [NETWORKS.BINANCE_SMART_CHAIN]: {
    name: 'Smart Chain - Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 97,
    rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  },
  [NETWORKS.FANTOM]: {
    name: 'Fantom Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 4002,
    rpc: 'https://rpc.testnet.fantom.network',
  },
  [NETWORKS.AURORA]: {
    name: 'Aurora Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 1313161555,
    rpc: 'https://testnet.aurora.dev',
  },
  [NETWORKS.AVALANCHE]: {
    name: 'Avalanche FUJI C-Chain',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 43113,
    rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  [NETWORKS.HUOBI_CHAIN]: {
    name: 'HuobiChain Testnet (International)',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 256,
    rpc: 'https://http-testnet.hecochain.com',
  },
  [NETWORKS.CRONOS]: {
    name: 'Cronos Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 338,
    rpc: 'https://evm-t3.cronos.org',
  },
  [NETWORKS.OPTIMISM]: {
    name: 'Optimism Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 420,
    rpc: 'https://goerli.optimism.io',
  },
  [NETWORKS.ARBITRUM]: {
    name: 'Arbitrum Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 421611,
    rpc: 'https://rinkeby.arbitrum.io/rpc',
  },
};

export const NEAR_TESTNET_CONFIG = {
  networkId: 'testnet',
  walletUrl: 'https://wallet.testnet.near.org',
  nodeUrl: 'https://rpc.testnet.near.org',
  helperUrl: 'https://testnet-api.kitwallet.app',
  explorerUrl: 'https://explorer.testnet.near.org',
};