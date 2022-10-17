import React, {useState, useEffect, FC} from 'react';
import {WalletInterface, WalletProps} from '../data/types';
import {NEAR_CONFIG} from '../configs/bcNetworks';
import * as nearAPI from 'near-api-js';
const {parseSeedPhrase} = require('near-seed-phrase');
import BN from 'bn.js';
import axios from 'axios';
import {NETWORKS} from '../enum/bcEnum';

const ACCOUNT_ID_REGEX =
  /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;

const {keyStores, KeyPair} = nearAPI;

async function getAccountIds(publicKey: string) {
  try {
    const accountApiUrl = `${NEAR_CONFIG.helperUrl}/publicKey/${publicKey}/accounts`;

    const res = await axios.get(accountApiUrl);
    return res.data;
  } catch (e) {
    return [];
  }
}

function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export const getNearKeypair = async (mnemonic: string) => {
  const {secretKey} = parseSeedPhrase(mnemonic);
  const keyPair = KeyPair.fromString(secretKey);
  const implicitBuffer = nearAPI.utils.PublicKey.fromString(
    keyPair.getPublicKey().toString(),
  ).data;
  const implicitAccountId = buf2hex(implicitBuffer);

  const accountIds = await getAccountIds(keyPair.getPublicKey().toString());

  const keyPairResult = {
    address: implicitAccountId,
    publicKey: keyPair.getPublicKey().toString().split(':')[1],
    privateKey: secretKey.split(':')[1],
  };
  if (accountIds.length) {
    keyPairResult.address = accountIds[0];
  }
  return {...keyPairResult, network: NETWORKS.NEAR};
};

export const getNearBalance = async (address: string) => {
  const {keyStores, KeyPair, connect} = nearAPI;
  const keyStore = new keyStores.InMemoryKeyStore();
  const config = {
    ...NEAR_CONFIG,
    keyStore,
    headers: {},
  };
  let balance;
  try {
    const near = await connect(config);
    const account = await near.account(address);
    const totalBalance = await account?.getAccountBalance();
    balance = nearAPI.utils.format.formatNearAmount(
      totalBalance?.available || '0',
    );
  } catch (e) {
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
): Promise<boolean> => {
  try {
    if (!accountId) return false;
    if (!isLegitAccountId(accountId)) {
      return false;
    }
    const {keyStores, connect} = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();

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

const useNEAR = ({mnemonic, privateKey}: WalletProps): WalletInterface => {
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState('');
  const [near, setNear] = useState<nearAPI.Near>();

  useEffect(() => {
    if (!privateKey) {
      setError('privateKey is null');
      return;
    }

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
  }, [mnemonic]);

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
