export enum NETWORK_ENVIRONMENT_ENUM {
    MAINNET,
    TESTNET
};

export enum RpcProviderMethod {
    getDefaultProvider = 'getDefaultProvider',
    JsonRpcProvider = 'JsonRpcProvider'
}

export enum NETWORKS {
    ETHEREUM = 'ETHEREUM',
    POLYGON = 'POLYGON',
    BINANCE_SMART_CHAIN = 'BINANCE_SMART_CHAIN',
    AVALANCHE = 'AVALANCHE',
    FANTOM = 'FANTOM',
    AURORA = 'AURORA',
    HARMONY = 'HARMONY',
    // CELO = 'CELO',
    HUOBI_CHAIN = 'HUOBI_CHAIN',
    CRONOS = 'CRONOS',

    NEAR = 'NEAR',
    // POLKADOT = 'POLKADOT',
    // TERRA = 'TERRA',
    SOLANA = 'SOLANA',
    // BITCOIN = 'BITCOIN'
};

export const defaultEnabledNetworks = [NETWORKS.ETHEREUM, NETWORKS.BINANCE_SMART_CHAIN, NETWORKS.SOLANA, NETWORKS.NEAR];