import axios from "axios";
import { ethers } from "ethers";
import { apiUrl } from "../../configs/apiUrl";
import { cacheCoinId } from "./caching";

const formatMessage = (address) => {
  const rawMessage = {
    signerAddress: address,
    nonce: Date.now(),
  };

  return JSON.stringify(rawMessage);
};

const signMessage = async (wallet, messageContent) => {
  const messageByte = ethers.utils.toUtf8Bytes(messageContent);
  const dataHashBin = ethers.utils.arrayify(messageByte);
  const signature = await wallet.signMessage(dataHashBin);

  return signature;
};

const API = axios.create({ baseURL: apiUrl });
API.interceptors.request.use(
  async (request) => {
    return request;
    // const chainWalletController = new ChainWalletController();
    // const idWalletSelected = (await localStorage.get(ID_WALLET_SELECTED)) || 0;
    // const ETHPrivateKey = await chainWalletController.getPrivateKey(
    //   idWalletSelected as string
    // );

    // const wallet = new ethers.Wallet(ETHPrivateKey);

    // const message = formatMessage(wallet.address);
    // const signature = await signMessage(wallet, message);
    // request.headers["signature"] = signature;
    // request.headers["message"] = message;
  },
  (error) => {
    return Promise.reject(error);
  }
);
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
