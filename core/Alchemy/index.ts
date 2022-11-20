import axios from "axios";
import allSettled from "promise.allsettled";
import API from "../../data/api";
import { ITokenMetadata } from "../../data/types";

export const getTokenMetadata = async (network: string, token: any) => {
  try {
    const metadataResponse = (await API.get("/assets", {
      params: {
        network: network,
        contractAddress: token.contractAddress,
      },
    })) as any;

    const tokenBalance =
      +token?.tokenBalance / Math.pow(10, metadataResponse?.decimals) || null;

    return {
      ...metadataResponse,
      tokenBalance: tokenBalance !== null ? tokenBalance?.toFixed(2) : null,
    };
  } catch (error) {
    console.warn(network, token.contractAddress, error);
    return null;
  }
};

export const detectToken = async (
  network: string,
  address: string
): Promise<ITokenMetadata[]> => {
  const baseURL = `https://${network}.g.alchemy.com/v2/9rQCtgvFdNxguyzClS7_jpetXc4VWQIX`;
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    params: [`${address}`, "erc20"],
    id: 42,
  });

  const response = await axios.post(baseURL, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const tokenBalances = await response.data?.result?.tokenBalances;

  const tokensMetadata = await allSettled(
    tokenBalances.map(async (token) => getTokenMetadata(network, token))
  );

  const nonZeroTokensMetadata = tokensMetadata
    .filter((token: any) => token?.value?.tokenBalance > 0)
    .map((token: any) => token.value);

  return nonZeroTokensMetadata;
};
