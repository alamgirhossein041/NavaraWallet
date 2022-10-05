import "react-native-get-random-values";
import "@ethersproject/shims";
import { BigNumber, ethers } from "ethers";
import { NETWORKS } from "../../enum/bcEnum";
import { NativeSafeAreaProviderProps } from "react-native-safe-area-context";
import * as nearApi from 'near-api-js';

export interface IWallet {
  label: string;
  value: string;
  id?: string;
  seedPhrase: any;
  isSelected: boolean;
  listChains?: any[],
  createdAt: Date;
  updatedAt?: Date,
  domain?: string
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
export interface ITokenData {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface IAppLockState {
  updatedAt: Date;
  pinCode: string,
  openAt: Date,
  isLock: boolean,
  autoLockAfterSeconds: number
  typeBioMetric: "none" | "faceId" | "touchId"
}