import * as nearApiJs from 'near-api-js';
import {parseSeedPhrase} from 'near-seed-phrase';

import {NEAR_CONFIG} from '../configs/bcNetworks';

const {ACCOUNT_HELPER_URL} = NEAR_CONFIG;

export let controller;

export async function getAccountIds(publicKey) {
  controller = new AbortController();
  return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, {
    signal: controller.signal,
  }).then(res => res.json());
}

export async function getAccountIdsBySeedPhrase(seedPhrase) {
  const {secretKey} = parseSeedPhrase(seedPhrase);
  const keyPair = nearApiJs.KeyPair.fromString(secretKey);
  const publicKey = keyPair.publicKey.toString();
  return getAccountIds(publicKey);
}

export function isUrlNotJavascriptProtocol(url) {
  if (!url) {
    return true;
  }

  const urlProtocol = new URL(url).protocol;
  if (urlProtocol === 'javascript:') {
    //
    return false;
  }

  return true;
}
