import axios from "axios";
import { apiUrl } from "../../configs/apiUrl";
import { cacheCoinId } from "./caching";

const API = axios.create({ baseURL: apiUrl });

API.interceptors.response.use(
  async (response) => {
    const config = response?.config;
    if (config?.url) {
      switch (config.url) {
        case "/coin":
          cacheCoinId(config?.params, response?.data);
          break;
        default:
          break;
      }
    }
    return response.data;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      return;
    }
    return Promise.reject(error);
  }
);

const URL_GET_PRICE = "https://api.coingecko.com/api/v3/simple/price";
const URL_SWAP = "https://apiv5.paraswap.io";

export { URL_GET_PRICE, URL_SWAP };

export default API;
