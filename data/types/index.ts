import { Connection } from "@solana/web3.js";
import { ethers } from "ethers";
import * as nearApi from "near-api-js";
import * as nearAPI from "near-api-js";
import { NETWORKS } from "../../enum/bcEnum";

export type WalletType = {
  icon?: JSX.Element;
  name: string | JSX.Element;
  onPress?: () => void;
  value?: string | JSX.Element;
  next?: boolean;
  iconPadding?: string;
  disabled?: boolean;
};

export type WalletInterface = {
  near?: nearApi.Near | undefined;
  address: string;
  error: string;
  connection?: Connection;
  getBalanceOf: (publicKey: string) => Promise<string>;
  transfer: (receiver: string, amount: string) => Promise<any>;
  // getGasPrice?: () => Promise<String>,
  estimateGas?: (transaction: {
    receiver: string;
    amount: string;
  }) => Promise<string>;
  getWallet?: () => any;
  provider?: ethers.providers.JsonRpcProvider | undefined;
};

export type WalletProps = {
  mnemonic?: string;
  network?: NETWORKS;
  privateKey?: any;
  address?: string;
};

export interface IPinCode {
  code: number;
  updatedAt: string;
}

export interface IHistory {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}
export interface IToken {
  address: string;
  decimals: number;
  symbol: string;
  chainId?: number;
  logoURI?: string;
  img?: string;
  name?: string;
}

export interface IAppLockState {
  updatedAt: Date;
  openAt: Date;
  isLock: boolean;
  autoLockAfterSeconds: number;
  typeBioMetric: string;
  transactionSigning?: boolean;
}

export interface IChain {
  address: string;
  isEnable: boolean;
  network: string;
  privateKey: string;
  publicKey: string;
  symbol: string;
  balance?: number;
  price?: number;
}

export interface IDriveFile {
  id?: string;
  kind?: string;
  mimeType?: string;
  name?: string;
}

export interface IFileData {
  id?: string;
  fileName?: string;
  date?: string;
}

export interface IBackupData {
  hint?: string;
  data?: string;
}

export interface ITab {
  id: string;
  url: string;
  title: string | null;
  screenShot?: string;
  icon?: string;
  colorTheme?: string;
}

export interface IBrowser {
  tabs: ITab[];
  currentTabId: number;
  loaded: boolean;
  isFocus: boolean;
}

export interface IHistoryBrowser extends ITab {
  createdAt: Date;
}

export interface INEAR_CONFIG {
  networkId: string;
  walletUrl: string;
  nodeUrl: string;
  helperUrl: string;
  explorerUrl: string;
}

export interface INearInstance {
  near: nearAPI.Near;
  accountId: string;
  keyStore: nearAPI.keyStores.InMemoryKeyStore;
  publicKey: string;
}

export interface INearInstanceByNetwork {
  mainnet: INearInstance;
  testnet: INearInstance;
}

export interface IDapp {
  chain: string;
  name: string;
  logo: string;
  link: string;
  category: string;
}
