import {IWallet} from './../../types/index';
import {atom, selector} from 'recoil';
import API, {URL_GET_PRICE} from '../../api';
import {listWalletsState} from '../listWallets';
import {NETWORK_COINGEKO_IDS} from '../../../configs/bcNetworks';
import {NETWORKS} from '../../../enum/bcEnum';

const currency = 'usd';
const priceTokenState = selector({
  key: 'priceToken',
  get: async ({get}) => {
    const ids = Object.keys(NETWORKS)
      .map(key => NETWORKS[key])
      .reduce((total, network) => {
        return (total += `,${NETWORK_COINGEKO_IDS[network]}`);
      });

    const response: any = await API.get(URL_GET_PRICE, {
      params: {
        ids,
        vs_currencies: currency,
      },
    });
    return response;
  },
});
const balanceChainsState = atom({
  key: 'balanceChainState',
  default: {},
});
export {priceTokenState, balanceChainsState};
