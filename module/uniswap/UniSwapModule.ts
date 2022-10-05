import _ from "lodash";
import { AlphaRouter } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import JSBI from "jsbi"; // jsbi@3.2.5
import { ITokenData } from "../../data/types";

export const createToken = (tokenData: ITokenData): Token => {
  const { chainId, address, decimals, symbol, name } = tokenData;
  return new Token(chainId, address, decimals, symbol, name);
};

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const alphaRouterSwap = async (
  provider: any,
  wallet: any,
  fromToken: Token,
  toToken: Token,
  fromAmount: string
) => {
  try {
    const walletAddress = wallet?.address;
    const route = await getRouter(
      provider,
      wallet,
      fromToken,
      toToken,
      fromAmount
    );

    const transaction = {
      data: route?.methodParameters?.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route?.methodParameters?.value),
      from: walletAddress,
      gasPrice: BigNumber.from(route?.gasPriceWei),
      gasLimit: ethers.utils.hexlify(1000000),
    };
    const connectedWallet = wallet.connect(provider);

    const approvalAmount = ethers.utils.parseUnits("1", 18).toString();
    const ERC20ABI = require("./abi.json");
    const contract0 = new ethers.Contract(
      fromToken.address,
      ERC20ABI,
      provider
    );
    await contract0
      .connect(connectedWallet)
      .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

    const tradeTransaction = await connectedWallet.sendTransaction(transaction);
    let receipt = await tradeTransaction.wait();
    //Logs the information about the transaction it has been mined.
    if (receipt) {
      console.log(
        " - Transaction is mined - " + "\n" + "Transaction Hash:",
        tradeTransaction.hash +
          "\n" +
          "Navigate to https://rinkeby.etherscan.io/tx/" +
          tradeTransaction.hash,
        "to see your transaction"
      );
    } else {
      console.log("Error submitting transaction");
    }
  } catch (err) {
    console.log(err);
    return "failed";
  }
  return "success";
};

const getRouter = async (
  provider: any,
  wallet: any,
  fromToken: Token,
  toToken: Token,
  fromAmount: string
) => {
  const walletAddress = wallet?.address;
  const { chainId } = await provider.getNetwork();

  const router = new AlphaRouter({
    chainId: chainId,
    provider: provider,
  });

  const wei = ethers.utils.parseUnits(fromAmount.toString().trim(), 18);
  const inputAmount = CurrencyAmount.fromRawAmount(fromToken, JSBI.BigInt(wei));

  const route = await router.route(
    inputAmount,
    toToken,
    TradeType.EXACT_INPUT,
    {
      recipient: walletAddress,
      slippageTolerance: new Percent(25, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    }
  );

  return route;
};

const getSwapDetails = async (
  provider: any,
  wallet: any,
  fromToken: Token,
  toToken: Token,
  fromAmount: string
) => {
  try {
    const route = await getRouter(
      provider,
      wallet,
      fromToken,
      toToken,
      fromAmount
    );
    const quote = route?.quote.toFixed(10);
    return {
      quote: quote,
    };
  } catch (err) {
    console.log(err);
    return {
      quote: "",
    };
  }
};
const getTokenBalance = async (
  provider: any,
  wallet: any,
  tokenAddress: string,
  decimal: number
) => {
  try {
    const ERC20ABI = require("./abi.json");
    const contract = new ethers.Contract(tokenAddress, ERC20ABI, provider);
    const balance = await contract.balanceOf(wallet.address);

    return ethers.utils.formatUnits(balance, decimal);
  } catch (err) {
    console.log(err);
    return "0";
  }
};

const UniswapModule = {
  alphaRouterSwap,
  getSwapDetails,
  getTokenBalance,
};

export default UniswapModule;
