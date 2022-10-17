import {ethers} from 'ethers';
import {NETWORKS} from '../../enum/bcEnum';
import * as nearApi from 'near-api-js';
import {Connection} from '@solana/web3.js';

export interface IWallet {
  name: any;
  label: string;
  value: string;
  id?: string;
  seedPhrase: any;
  isSelected: boolean;
  listChains?: any[];
  createdAt: Date;
  updatedAt?: Date;
  domain?: any;
  isBackedUp?: boolean;
}
export interface IUser {
  id: number;
  name: string;
  wallets: IWallet[];
}

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
