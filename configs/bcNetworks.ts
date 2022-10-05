import { ENVIRONMENT, WALLET_ENVIRONMENT } from '../global.config';
import mainnetConfig from './bcMainnets';
import testnetConfig from './bcTestnets';
import {
    NETWORK_ENVIRONMENT_ENUM,
    NETWORKS
} from '../enum/bcEnum'

import {
    clusterApiUrl,
} from '@solana/web3.js';

// import Near from ".../assets/icons/icon-near.svg";
import Solana from "../assets/icons/icon-solana.svg";
import Terra from "../assets/icons/icon-terra.svg";
import Bitcoin from "../assets/icons/icon-btc.svg";
import Binance from "../assets/icons/icon-bsc.svg";
import Ethereum from "../assets/icons/icon-ethereum.svg";
// import Dnet from "../assets/icons/icon-dnet.svg";
import Hamony from '../assets/icons/harmony-one-logo.svg'
import Cromos from '../assets/icons/crypto-com-coin-cro-logo.svg'
import Polygon from '../assets/icons/polygon-matic-logo.svg'
import Fantom from '../assets/icons/fantom-ftm-logo.svg'
import Celo from '../assets/icons/celo-celo-logo.svg'
import Alavanche from '../assets/icons/avalanche-avax-logo.svg'
import Near from '../assets/icons/icon-near.svg'
import Aurora from '../assets/icons/icon-aurora.svg'
import Houbi from  '../assets/icons/icon-houbi.svg'

// import Polygon from '../assets/icons/polygon-matic-logo.svg'

export const CHAIN_ICONS = {
    [NETWORKS.ETHEREUM]: Ethereum,
    [NETWORKS.POLYGON]: Polygon,
    [NETWORKS.BINANCE_SMART_CHAIN]: Binance,
    [NETWORKS.FANTOM]: Fantom,
    // [NETWORKS.AURORA]: "",
    [NETWORKS.AVALANCHE]: Alavanche,
    [NETWORKS.HARMONY]: Hamony,
    [NETWORKS.AURORA]: Aurora,
    // [NETWORKS.CELO]: Celo,
    [NETWORKS.HUOBI_CHAIN]: Houbi,
    [NETWORKS.CRONOS]: Cromos,
    [NETWORKS.SOLANA]: Solana,
    "BITCOIN": Bitcoin,
    [NETWORKS.NEAR]: Near
}

export const TOKEN_SYMBOLS = {
    [NETWORKS.ETHEREUM]: "ETH",
    [NETWORKS.POLYGON]: "MATIC",
    [NETWORKS.BINANCE_SMART_CHAIN]: "BNB",
    [NETWORKS.FANTOM]: "FTM",
    // [NETWORKS.AURORA]: "",
    [NETWORKS.AVALANCHE]: "AVAX",
    [NETWORKS.HARMONY]: "ONE",
    // [NETWORKS.CELO]: "CELO",
    [NETWORKS.AURORA]: "ETH",
    [NETWORKS.HUOBI_CHAIN]: "HT",
    [NETWORKS.CRONOS]: "CRO",
    [NETWORKS.SOLANA]: "SOL",
    "BITCOIN": "BTC",
    [NETWORKS.NEAR]: "NEAR"
}

export const EVM_CHAINS: string[] = [
    NETWORKS.ETHEREUM,
    NETWORKS.POLYGON,
    NETWORKS.BINANCE_SMART_CHAIN,
    NETWORKS.AVALANCHE,
    NETWORKS.FANTOM,
    NETWORKS.AURORA,
    NETWORKS.HARMONY,
    // NETWORKS.CELO,
    NETWORKS.HUOBI_CHAIN,
    NETWORKS.CRONOS
]

export const NETWORK_COINGEKO_IDS = {
    [NETWORKS.ETHEREUM]: 'ethereum',
    [NETWORKS.POLYGON]: 'matic-network',
    [NETWORKS.BINANCE_SMART_CHAIN]: 'binancecoin',
    [NETWORKS.AVALANCHE]: 'avalanche-2',
    [NETWORKS.FANTOM]: 'fantom',
    [NETWORKS.AURORA]: 'aurora-near',
    [NETWORKS.HARMONY]: 'harmony',
    // [NETWORKS.CELO]: 'celo',
    [NETWORKS.HUOBI_CHAIN]: 'huobi-token',
    [NETWORKS.CRONOS]: 'crypto-com-chain',

    [NETWORKS.NEAR]: 'near',
    // POLKADOT = 'POLKADOT',
    // TERRA = 'TERRA',
    [NETWORKS.SOLANA]: 'solana',
    BITCOIN: 'bitcoin'
}

export const NETWORK_ENVIRONMENT = WALLET_ENVIRONMENT === ENVIRONMENT.DEVELOPMENT ?
    NETWORK_ENVIRONMENT_ENUM.TESTNET : NETWORK_ENVIRONMENT_ENUM.MAINNET;

export const NETWORK_CONFIG = NETWORK_ENVIRONMENT === NETWORK_ENVIRONMENT_ENUM.MAINNET ? mainnetConfig : testnetConfig;

export const SOLANA_CLUSTER_API_URL = NETWORK_ENVIRONMENT === NETWORK_ENVIRONMENT_ENUM.MAINNET ? clusterApiUrl('mainnet-beta') : clusterApiUrl('testnet')

export const POLKADOT_WS_ENDPOINT = NETWORK_ENVIRONMENT === NETWORK_ENVIRONMENT_ENUM.MAINNET ? 'wss://rpc.polkadot.io' : 'wss://kusama-rpc.polkadot.io'

export const NEAR_CONFIG = NETWORK_ENVIRONMENT === NETWORK_ENVIRONMENT_ENUM.MAINNET ?
    {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
    }
    :
    {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    }