import {useState, useEffect} from 'react';
import {WalletInterface, WalletProps} from '../data/types';
import {DEVIVERATION_PATH} from '../configs/bcNetworks';
import * as nearAPI from 'near-api-js';
import BN from 'bn.js';
import axios from 'axios';
import {NETWORKS, NETWORK_ENVIRONMENT_ENUM} from '../enum/bcEnum';
import {derivePath} from 'near-hd-key';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import {getNearConfig, useBcNetworks} from './useBcNetworks';

const ACCOUNT_ID_REGEX =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

const {keyStores, KeyPair} = nearAPI;

async function getAccountIds(publicKey: string, helperUrl: string) {
  try {
    const accountApiUrl = `${helperUrl}/publicKey/${publicKey}/accounts`;
    const res = await axios.get(accountApiUrl);
    return res.data;
  } catch (e) {
    console.log(e);
    return [];
  }
}

function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export const createNearWallet = async (
  seed: Buffer,
  accountIndex = 0,
  helperUrl: string,
) => {
  const path = DEVIVERATION_PATH[NETWORKS.NEAR](accountIndex);
  const {key} = derivePath(path, seed.toString('hex'));

  const keyPair = nacl.sign.keyPair.fromSeed(key);

  const publicKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.publicKey));
  const privateKey = 'ed25519:' + bs58.encode(Buffer.from(keyPair.secretKey));

  const implicitBuffer = nearAPI.utils.PublicKey.fromString(publicKey).data;
  const implicitAccountId = buf2hex(implicitBuffer);

  const accountIds = await getAccountIds(publicKey, helperUrl);

  const keyPairResult = {
    address: implicitAccountId,
    publicKey,
    privateKey,
  };
  if (accountIds.length) {
    keyPairResult.address = accountIds[0];
  }
  return {...keyPairResult, network: NETWORKS.NEAR};
};

export const getNearBalance = async (
  address: string,
  env: NETWORK_ENVIRONMENT_ENUM,
) => {
  const {keyStores, connect} = nearAPI;
  const keyStore = new keyStores.InMemoryKeyStore();
  const NEAR_CONFIG = getNearConfig(env);

  const config = {
    ...NEAR_CONFIG,
    keyStore,
    headers: {},
  };
  let balance;
  try {
    const near = await connect(config);
    const account = await near.account(address);
    const totalBalance = await account.getAccountBalance();
    balance = nearAPI.utils.format.formatNearAmount(
      totalBalance?.available || '0',
    );
  } catch (e) {
    console.log(e);
    balance = '0';
  }
  return {
    address,
    balance: balance,
    network: NETWORKS.NEAR,
  };
};

const isImplicitAccount = accountId =>
  accountId.length === 64 && !accountId.includes('.');

const isLegitAccountId = accountId => {
  return ACCOUNT_ID_REGEX.test(accountId);
};

export const validateAccountId = async (
  accountId: string,
  env: NETWORK_ENVIRONMENT_ENUM,
): Promise<boolean> => {
  try {
    if (!accountId) return false;
    if (!isLegitAccountId(accountId)) {
      return false;
    }
    const {keyStores, connect} = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const NEAR_CONFIG = getNearConfig(env);

    const config = {
      ...NEAR_CONFIG,
      keyStore,
      headers: {},
    };
    const near = await connect(config);
    const account = await near.account(accountId);
    const state = await account.state();
    return true;
  } catch (e) {
    if (
      isImplicitAccount(accountId) &&
      e.toString().includes('does not exist while viewing')
    ) {
      return true;
    }
    return false;
  }
};

const useNEAR = (privateKey: string): WalletInterface => {
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState('');
  const [near, setNear] = useState<nearAPI.Near>();
  const {NEAR_CONFIG} = useBcNetworks();

  useEffect(() => {
    (async () => {
      try {
        const {keyStores, KeyPair, connect} = nearAPI;
        const keyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(privateKey);

        const implicitBuffer = nearAPI.utils.PublicKey.fromString(
          keyPair.getPublicKey().toString(),
        ).data;
        const implicitAccountId = buf2hex(implicitBuffer);

        const accountIds = await getAccountIds(
          keyPair.getPublicKey().toString(),
          NEAR_CONFIG.helperUrl,
        );

        const accountId = accountIds[0] ? accountIds[0] : implicitAccountId;
        setAddress(accountId);

        await keyStore.setKey('testnet', accountId, keyPair);

        const config = {
          ...NEAR_CONFIG,
          keyStore,
          headers: {},
        };
        const near = await connect(config);

        setNear(near);
      } catch (error) {}
    })();
  }, []);

  const getBalanceOf = async (publicKey: string) => {
    try {
      const account = await near?.account(publicKey);
      const balance = await account?.getAccountBalance();
      return nearAPI.utils.format.formatNearAmount(balance?.available || '0');
    } catch (e) {
      return '0';
    }
  };

  const transfer = async (receiver: string, amount: string) => {
    try {
      const account = await near?.account(address);
      const tranferBN = nearAPI.utils.format.parseNearAmount(amount.toString());
      const tx = await account?.sendMoney(receiver, new BN(tranferBN));
      return tx;
    } catch (e) {
      throw e;
    }
  };

  const estimateGas = async ({
    receiver,
    amount,
  }: {
    receiver: string;
    amount: string;
  }) => {
    return '0.000045';
  };

  return {
    near,
    address,
    error,
    getBalanceOf,
    transfer,
    // getGasPrice,
    estimateGas,
  };
};

export default useNEAR;
