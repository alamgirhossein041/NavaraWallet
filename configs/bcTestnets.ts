import { RpcProviderMethod, NETWORKS } from "../enum/bcEnum";

export default {
  [NETWORKS.ETHEREUM]: {
    name: "ROPSTEN",
    provider: "ropsten",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    rpc: "https://ropsten.infura.io/v3/a383cc1a30ed4d64ab93408862cdf8d7",
    chainId: 3
  },
  [NETWORKS.POLYGON]: {
    name: "MUMBAI",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 80001,
    rpc: "https://rpc-mumbai.matic.today/",
  },
  [NETWORKS.BINANCE_SMART_CHAIN]: {
    name: "Smart Chain - Testnet",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 97,
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  [NETWORKS.FANTOM]: {
    name: "Fantom Testnet",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 4002,
    rpc: "https://rpc.testnet.fantom.network/",
  },
  [NETWORKS.AURORA]: {
      name: "Aurora Testnet",
      providerMethod: RpcProviderMethod.JsonRpcProvider,
      chainId: 1313161555,
      rpc: "https://testnet.aurora.dev/"
  },
  [NETWORKS.AVALANCHE]: {
    name: "Avalanche FUJI C-Chain",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 43113,
    rpc: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  [NETWORKS.HARMONY]: {
    name: "Harmony Testnet",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 1666700000,
    rpc: "https://api.s0.b.hmny.io",
  },
  // [NETWORKS.CELO]: {
  //   name: "Celo (Alfajores Testnet)",
  //   providerMethod: RpcProviderMethod.JsonRpcProvider,
  //   chainId: 44787,
  //   rpc: "https://alfajores-forno.celo-testnet.org",
  // },
  [NETWORKS.HUOBI_CHAIN]: {
      name: "HuobiChain Testnet (International)",
      providerMethod: RpcProviderMethod.JsonRpcProvider,
      chainId: 256,
      rpc: "https://http-testnet.hecochain.com"
  },
  [NETWORKS.CRONOS]: {
    name: "Cronos Testnet",
    providerMethod: RpcProviderMethod.JsonRpcProvider,
    chainId: 338,
    rpc: "https://evm-t3.cronos.org",
  },
};
