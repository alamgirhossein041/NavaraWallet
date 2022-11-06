import { atom, selector } from "recoil";
import { NETWORK_COINGEKO_IDS } from "../../../configs/bcNetworks";
import { NETWORKS } from "../../../enum/bcEnum";
import { localStorage } from "../../../utils/storage";
import API, { URL_GET_PRICE } from "../../api";

const PRICE_TOKEN_STORAGE = "PRICE_TOKEN_STORAGE";
const currency = "usd";

const getCache = async () => {
  return await localStorage.get(PRICE_TOKEN_STORAGE);
};
const priceTokenState = selector({
  key: "priceToken",
  get: async () => {
    const ids = Object.keys(NETWORKS)
      .map((key) => NETWORKS[key])
      .reduce((total, network) => {
        return (total += `,${NETWORK_COINGEKO_IDS[network]}`);
      });

    try {
      const response: any = await API.get(URL_GET_PRICE, {
        params: {
          ids,
          vs_currencies: currency,
        },
      });
      if (!response) {
        // return data from localstorage if response is null
        return getCache();
      } else {
        // Update data price token to localstorage
        localStorage.set(PRICE_TOKEN_STORAGE, response);
        return response;
      }
    } catch (e) {
      // return data from localstorage if api request error
      return getCache();
    }
  },
});

export { priceTokenState };
