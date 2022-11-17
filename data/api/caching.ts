import CryptoJS from "crypto-js";
import { localStorage } from "../../utils/storage";

export const cacheCoinId = (params: any, data: any) => {
  try {
    localStorage.set(`coin-${CryptoJS.MD5(params.symbol).toString()}`, {
      ...data[0],
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn("Cache Coin Id Failed", error);
  }
};

export const getCachedCoinId = async (symbol: string) => {
  try {
    const CachedCoin = (await localStorage.get(
      `coin-${CryptoJS.MD5(symbol.toLowerCase()).toString()}`
    )) as any;
    return (CachedCoin.id as string) || null;
  } catch (error) {
    console.warn("get Cached Coin Failed", error);
    return null;
  }
};

export const cachePriceChart = (tokenId: string, data: any) => {
  try {
    localStorage.set(`chart-${CryptoJS.MD5(tokenId).toString()}`, {
      prices: data?.prices,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn("Cache chart Failed", error);
  }
};

export const getCachedPriceChart = (tokenId: string): Promise<any> => {
  try {
    return localStorage.get(`chart-${CryptoJS.MD5(tokenId).toString()}`);
  } catch (error) {
    console.warn("Get cached chart Failed", error);
    return null;
  }
};
