import axios from "axios";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { OptimalRate, SwapSide } from "paraswap-core";
import { URL_SWAP } from "../../data/api";
import { IToken } from "../../data/types";
import { ParaswapEnum } from "../../enum";

interface MinTokenData {
  decimals: number;
  symbol: string;
  address: string;
}

type NumberAsString = string;

interface TransactionParams {
  to: string;
  from: string;
  value: NumberAsString;
  data: string;
  gasPrice: NumberAsString;
  gas?: NumberAsString;
  chainId: number;
  error?: string;
}

interface Swapper {
  getRate(params: {
    srcToken: Pick<MinTokenData, "address" | "decimals">;
    destToken: Pick<MinTokenData, "address" | "decimals">;
    srcAmount: NumberAsString;
    partner?: string;
  }): Promise<OptimalRate>;
  buildSwap(params: {
    srcToken: Pick<MinTokenData, "address" | "decimals">;
    destToken: Pick<MinTokenData, "address" | "decimals">;
    srcAmount: NumberAsString;
    minAmount: NumberAsString;
    priceRoute: OptimalRate;
    userAddress: string;
    receiver?: string;
    partner?: string;
  }): Promise<TransactionParams>;
}

interface BuildTxBody {
  srcToken: string;
  destToken: string;
  srcAmount: NumberAsString;
  destAmount: NumberAsString;
  priceRoute: OptimalRate;
  userAddress: string;
  partner?: string;
  partnerAddress?: string;
  partnerFeeBps?: string;
  receiver?: string;
  srcDecimals?: number;
  destDecimals?: number;
}
export interface GetSwapTxInput {
  srcToken: IToken;
  destToken: IToken;
  srcAmount: NumberAsString; // in srcToken denomination
  networkID: number;
  slippage?: number;
  partner?: string;
  userAddress: string;
  receiver?: string;
}

function createSwapper(networkID: number, apiURL: string): Swapper {
  type PriceQueryParams = {
    srcToken: string;
    destToken: string;
    srcDecimals: string;
    destDecimals: string;
    amount: string;
    side: SwapSide;
    network: string;
    partner?: string;
  };

  const getRate: Swapper["getRate"] = async ({
    srcToken,
    destToken,
    srcAmount,
    // partner = PARTNER,
  }) => {
    try {
      const queryParams: PriceQueryParams = {
        srcToken: srcToken.address,
        destToken: destToken.address,
        srcDecimals: srcToken.decimals.toString(),
        destDecimals: destToken.decimals.toString(),
        amount: srcAmount,
        side: SwapSide.SELL,
        network: networkID.toString(),
        //   partner,
      };

      const searchString = new URLSearchParams(queryParams);

      const pricesURL = `${apiURL}/prices/?${searchString}`;

      const {
        data: { priceRoute },
      } = await axios.get<{ priceRoute: OptimalRate }>(pricesURL);

      return priceRoute;
    } catch (error) {
      console.error(error);
    }
  };

  const buildSwap: Swapper["buildSwap"] = async ({
    srcToken,
    destToken,
    srcAmount,
    minAmount,
    priceRoute,
    userAddress,
    receiver,
    // partner,
  }) => {
    const txURL = `${apiURL}/transactions/${networkID}`;
    const partnerFeeBps = ParaswapEnum.PARTNER_FEE_BPS.toString();
    const partnerAddress = ParaswapEnum.PARTNER_ADDRESS.toString();
    const txConfig: BuildTxBody = {
      priceRoute,
      srcToken: srcToken.address,
      srcDecimals: srcToken.decimals,
      destToken: destToken.address,
      destDecimals: destToken.decimals,
      partnerFeeBps: partnerFeeBps,
      partnerAddress: partnerAddress,
      srcAmount,
      destAmount: minAmount,
      userAddress,
      // partner,
      receiver,
    };

    const { data } = await axios.post<TransactionParams>(txURL, txConfig);
    return data;
  };

  return { getRate, buildSwap };
}

export async function getSwapTransaction({
  srcToken,
  destToken,
  srcAmount,
  networkID,
  slippage,
  ...rest
}: GetSwapTxInput): Promise<TransactionParams> {
  try {
    const bigNumSrcAmount = new BigNumber(srcAmount)
      .times(10 ** srcToken.decimals)
      .toFixed(0);

    const swapper = createSwapper(networkID, URL_SWAP);

    const priceRoute = await swapper.getRate({
      srcToken,
      destToken,
      srcAmount: bigNumSrcAmount,
    });

    const minAmount = new BigNumber(priceRoute.destAmount)
      .times(1 - slippage / 100)
      .toFixed(0);

    const transactionRequest = await swapper.buildSwap({
      srcToken,
      destToken,
      srcAmount: bigNumSrcAmount,
      minAmount,
      priceRoute,
      ...rest,
    });

    return transactionRequest;
  } catch (error: any) {
    console.error(error.response.data);
    return error.response.data as TransactionParams;
  }
}
export interface IGetSwapRate {
  srcToken: IToken;
  destToken: IToken;
  srcAmount: NumberAsString;
  networkID: number;
}
export async function getSwapRate({
  srcToken,
  destToken,
  srcAmount,
  networkID,
}: IGetSwapRate): Promise<OptimalRate> {
  try {
    const bigNumSrcAmount = new BigNumber(srcAmount)
      .times(10 ** srcToken.decimals)
      .toFixed(0);

    const swapper = createSwapper(networkID, URL_SWAP);

    const priceRoute = await swapper.getRate({
      srcToken,
      destToken,
      srcAmount: bigNumSrcAmount,
    });

    return priceRoute;
  } catch (error: any) {
    console.error(error);
    // throw new Error(error.response.data.error);
    return error.response.data;
  }
}

export const getTokenBalance = async (
  provider: any,
  walletAddress: any,
  tokenAddress: string,
  decimal: number
) => {
  try {
    const ERC20ABI = require("./abi.json");
    const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const balance = await contract.balanceOf(walletAddress);

    return ethers.utils.formatUnits(balance, decimal);
  } catch (err) {
    console.error(err);
    return "0";
  }
};
