import {selector, selectorFamily} from 'recoil';
import axios from 'axios';
import {NETWORKS, NETWORK_ENVIRONMENT_ENUM} from '../../enum/bcEnum';
import {NETWORK_ENVIRONMENT} from '../../configs/bcNetworks';
import API from '.';
import {ethers} from 'ethers';
import {LAMPORTS_PER_SOL} from '@solana/web3.js';
import {intersection} from 'lodash';

const scannerApikey = '6HUJP4G9JHY72ZTY9ZQHXR3166GV463DB8';

interface IParamsRequest {
  page?: number;
  offset?: number;
  sort?: string;
  address?: string;
  action?: string;
  before?: string;
  module?: string;
}

export enum scannerAction {
  tokentx = 'tokentx',
  txlist = 'txlist',
}

export const getFetchHistoryAction = (network: string): string => {
  if (network === NETWORKS.AURORA) return scannerAction.txlist;
  return scannerAction.tokentx;
};

export enum scannerModule {
  account = 'account',
}

const scannerUrlsMainnet = {
  [NETWORKS.ETHEREUM]: 'https://api.etherscan.io/api',
  // [NETWORKS.POLYGON]: 'https://api.polygonscan.com/api',
  [NETWORKS.BINANCE_SMART_CHAIN]: 'https://api.bscscan.com/api',
  [NETWORKS.FANTOM]: 'https://api.ftmscan.com/api',
  [NETWORKS.AVALANCHE]: 'https://api.snowtrace.io/api',
  [NETWORKS.CRONOS]: 'https://api.cronoscan.com/api',
  [NETWORKS.AURORA]: 'https://api.aurorascan.dev/api',
  [NETWORKS.SOLANA]: 'https://api.solscan.io/account',
  [NETWORKS.NEAR]: 'https://api.kitwallet.app',
};

const scannerUrlTestnet = {
  [NETWORKS.ETHEREUM]: 'https://api-ropsten.etherscan.io/api',
  // [NETWORKS.POLYGON]: 'https://api-testnet.polygonscan.com/api',
  [NETWORKS.BINANCE_SMART_CHAIN]: 'https://api-testnet.bscscan.com/api',
  [NETWORKS.FANTOM]: 'https://api-testnet.ftmscan.com/api',
  [NETWORKS.AVALANCHE]: 'https://api-testnet.snowtrace.io/api',
  [NETWORKS.CRONOS]: 'https://api-testnet.cronoscan.com/api',
  [NETWORKS.AURORA]: 'https://api-testnet.aurorascan.dev/api',
  [NETWORKS.SOLANA]: 'https://api-testnet.solscan.io',
  [NETWORKS.NEAR]: 'https://testnet-api.kitwallet.app',
};

const getUrlByEnvironment = (optionMainnet: any, optionTestnet: any): any => {
  return NETWORK_ENVIRONMENT === NETWORK_ENVIRONMENT_ENUM.MAINNET
    ? optionMainnet
    : optionTestnet;
};

const getScannerUrl = (network: NETWORKS): string => {
  return getUrlByEnvironment(
    scannerUrlsMainnet[network],
    scannerUrlTestnet[network],
  );
};

interface txFormatted {
  from: string;
  intruction: string;
  timeStamp: number;
  to: string;
  value: string;
}

export const commonFetchHistory = async (
  url,
  {page = 0, offset = 0, address, action, module}: IParamsRequest,
): Promise<txFormatted[]> => {
  const params = {
    module,
    action,
    page,
    offset,
    sort: 'desc',
    address,
    apikey: scannerApikey,
    tag: 'latest',
    startblock: 0,
    endblock: 99999999,
  };
  try {
    const res = await API.get(url, {params});
    const {result, message} = res;

    const formattedResult = result.map(tx => {
      return {
        from: tx.from,
        to: tx.to,
        intruction: 'transfer',
        value: ethers.utils.formatUnits(tx.value),
        timeStamp: tx.timeStamp,
      };
    });
    return formattedResult;
  } catch (e) {
    return [];
  }
};

export const nearFetchHistory = async (
  accountId: string,
  page?: string,
  limit?: string,
): Promise<txFormatted[]> => {
  try {
    const url = `${getScannerUrl(NETWORKS.NEAR)}/account/${accountId}/activity`;

    const txs = await API.get(url);
    let formattedResult = txs.map(tx => {
      return {
        from: tx.signer_id,
        to: tx.receiver_id,
        intruction: tx.action_kind,
        value: (tx?.args?.deposit || 0).toString(),
        timeStamp: tx.block_timestamp / 10 ** 9,
      };
    });
    return formattedResult;
  } catch (e) {
    return [];
  }
};

export const solanaFetchHistory = async (
  address: string,
  before?: string,
): Promise<txFormatted[]> => {
  try {
    const res = await API.get(
      `${getScannerUrl(NETWORKS.SOLANA)}/account/transaction`,
      {
        params: {address, before, type: 'sol-transfer'},
      },
    );
    const {data, success} = res;
    const formattedResult = data.map(tx => {
      return {
        from: tx.signer.join(','),
        to: '',
        intruction: tx.parsedInstruction
          .map(intruction => intruction.type)
          .join(','),
        value: (tx.lamport / LAMPORTS_PER_SOL).toString(),
        timeStamp: tx.blockTime,
      };
    });
    return formattedResult;
  } catch (e) {
    return [];
  }
};
export const fetchHistory = (
  network: NETWORKS,
  {page, offset, address, before}: IParamsRequest,
) => {
  const action = scannerAction.txlist;
  const module = scannerModule.account;
  if (network === NETWORKS.SOLANA) {
    return solanaFetchHistory(address, before);
  } else if (network === NETWORKS.NEAR) {
    return nearFetchHistory(address);
  } else if (!!getScannerUrl(network)) {
    return commonFetchHistory(getScannerUrl(network), {
      page,
      offset,
      address,
      action,
      module,
    });
  } else {
    return new Promise(resolve => {
      resolve([]);
    });
  }
};
