import {RpcProviderMethod, NETWORKS} from '../enum/bcEnum';

export default {
  [NETWORKS.ETHEREUM]: {
    name: 'ethereum mainnet',
    provider: 'homestead',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    rpc: 'https://mainnet.infura.io/v3/a383cc1a30ed4d64ab93408862cdf8d7',
    chainId: 1,
  },
  // [NETWORKS.POLYGON]: {
  //   name: 'Polygon Mainnet',
  //   providerMethod: RpcProviderMethod.JsonRpcProvider,
  //   chainId: 137,
  //   rpc: 'https://rpc-mainnet.maticvigil.com/',
  // },
  [NETWORKS.BINANCE_SMART_CHAIN]: {
    name: 'Binance Smart Chain',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 56,
    rpc: 'https://bsc-dataseed.binance.org/',
  },
  [NETWORKS.FANTOM]: {
    name: 'Fantom Opera',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 250,
    scanner: 'https://api.ftmscan.com/api',
    rpc: 'https://rpc.ftm.tools/',
  },
  [NETWORKS.AURORA]: {
    name: 'Aurora',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 1313161554,
    rpc: 'https://mainnet.aurora.dev/',
  },
  [NETWORKS.AVALANCHE]: {
    name: 'Avalanche Network',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 0xa86a,
    rpc: 'https://api.avax.network/ext/bc/C/rpc',
  },
  [NETWORKS.HUOBI_CHAIN]: {
    name: 'HuobiChain- Mainnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 128,
    rpc: 'https://http-mainnet.hecochain.com',
  },
  [NETWORKS.CRONOS]: {
    name: 'Cronos Mainnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 25,
    rpc: 'https://evm.cronos.org',
  },
  [NETWORKS.OPTIMISM]: {
    name: 'Optimism Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 10,
    rpc: 'https://mainnet.optimism.io',
  },
  [NETWORKS.ARBITRUM]: {
    name: 'Arbitrum Testnet',
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 42161,
    rpc: 'https://arb1.arbitrum.io/rpc',
  },
};
