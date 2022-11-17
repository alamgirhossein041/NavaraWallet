import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import API, { URL_GET_PRICE } from ".";
import { checkDateIsToday } from "../../utils/stringsFunction";
import {
  cachePriceChart,
  getCachedCoinId,
  getCachedPriceChart,
} from "./caching";

export const checkNetworkAvailable = async () => {
  const { isConnected } = await NetInfo.fetch();
  return isConnected;
};

const COIN_GECKO_URL = "https://api.coingecko.com/api/v3/coins/";
const currency = "usd";

export const fetchMarketChart = async (symbol: string) => {
  let tokenId = "";
  const isNetworkAvailable = await checkNetworkAvailable();
  const cachedId = await getCachedCoinId(symbol);

  if (cachedId) {
    tokenId = cachedId;
  } else if (isNetworkAvailable) {
    const resTokenId = await API.get("/coin", {
      params: {
        symbol: symbol.toLowerCase(),
      },
    });

    tokenId = resTokenId[0]?.id;
  }

  if (!tokenId) {
    return null;
  }

  const cachedChart = await getCachedPriceChart(tokenId);
  const url = `${COIN_GECKO_URL}${tokenId}/market_chart`;

  if (isNetworkAvailable) {
    if (!cachedChart?.prices) {
      const response = await axios.get(url, {
        params: {
          id: tokenId,
          vs_currency: currency,
          days: "14",
          interval: "daily",
        },
      });
      cachePriceChart(tokenId, await response.data);
      return response.data;
    } else if (checkDateIsToday(cachedChart?.updatedAt)) {
      const response: any = await API.get(URL_GET_PRICE, {
        params: {
          ids: tokenId,
          vs_currencies: currency,
        },
      });

      if (response) {
        if (response[tokenId]) {
          const latest = response[tokenId][currency];
          cachedChart.prices.pop();
          cachedChart.prices.push([Date.now(), latest]);
        }
      }
    } else {
      const response = await axios.get(url, {
        params: {
          id: tokenId,
          vs_currency: currency,
          days: "2",
          interval: "daily",
        },
      });

      const LatestPricesData = await response?.data?.prices;
      cachedChart.prices.slice();
      cachedChart.prices.pop();
      const newPricesData = [...LatestPricesData, ...cachedChart.prices];
      cachePriceChart(tokenId, newPricesData);
      return newPricesData;
    }
  }
  return cachedChart;
};
