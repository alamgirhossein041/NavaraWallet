import { ethers } from "ethers";
import { KeyboardAvoidingView, Skeleton, Switch } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "react-query";
import IconSwap from "../../assets/icons/icon-swap.svg";
import Button from "../../components/UI/Button";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { defaultToken } from "../../configs/defaultValue";
import { primaryColor, primaryGray } from "../../configs/theme";
import API from "../../data/api";
import { IToken } from "../../data/types";
import { NETWORKS } from "../../enum/bcEnum";
import { useBcNetworks } from "../../hooks/useBcNetworks";
import useEvm from "../../hooks/useEvm";
import {
  getSwapRate,
  getSwapTransaction,
  getTokenBalance,
  IGetSwapRate,
} from "../../module/swap/ParaswapModule";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import ModalResult from "./ModalResult";
import SelectToken from "./SelectToken";
import WalletsCard from "./WalletsCard";

const SwapScreen = ({ route, navigation }) => {
  const [srcToken, setSrcToken] = useState<IToken>(defaultToken);
  const [destToken, setDestToken] = useState<IToken>(defaultToken);
  const [fromBalance, setFromBalance] = useState<string>("0");
  const [toAmount, setToBalance] = useState<string>("0");
  const [price, setPrice] = useState("1");
  const [gasCost, setGasCost] = useState("0");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { t } = useTranslation();

  const [error, setError] = useState(t("swap.enter_an_amount"));
  const [loading, setLoading] = useState("");
  const [showingModal, setShowingModal] = useState("");
  const { NETWORK_CONFIG } = useBcNetworks();

  const { token: chain } = route?.params;
  const network = chain?.network || NETWORKS.ETHEREUM;
  const balanceChain = chain?.balance;

  const config = NETWORK_CONFIG[network];

  const evm = useEvm(network, chain?.privateKey);
  const wallet: ethers.Wallet = evm.getWallet();
  const provider = evm.provider;
  const Icon = CHAIN_ICONS[chain.network];

  const [searchValue, setSearchValue] = useState("");

  const {
    isLoading,
    data: listTokens,
    isError,
    refetch,
  } = useQuery(
    [`tokens`, config?.chainId, searchValue],
    async (): Promise<IToken[]> => {
      const params =
        searchValue.length > 0
          ? {
              chainId: config?.chainId,
              symbol: searchValue.length > 0 && searchValue.toLowerCase(),
            }
          : {
              chainId: config?.chainId,
            };

      const response = await API.get("/tokens", {
        params: params,
      });

      const _listTokens = response as any;

      return _listTokens;
    }
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={tw`border rounded-full border-[${primaryColor}]`}>
            <Icon width={36} height={36} />
          </View>
        );
      },
    });
  }, [navigation, chain.network, Icon]);

  useEffect(() => {
    if (srcToken.symbol === defaultToken.symbol) {
      setError(t("swap.select_a_from_token"));
      return;
    }

    if (destToken.symbol === defaultToken.symbol) {
      setError(t("swap.select_a_to_token"));
      return;
    }

    if (Number(fromValue) === 0) {
      setError(t("swap.enter_an_amount"));
      return;
    }
    if (Number(fromValue) > Number(fromBalance)) {
      setError(t("swap.insufficient_balance"));
      return;
    }
    setToValue(
      Number((Number(fromValue) * Number(price))?.toFixed(20)).toString()
    );
  }, [fromValue, srcToken, destToken, price, fromBalance]);

  const resets = useCallback(() => {
    setFromValue("");
    setToValue("");
    setSrcToken(defaultToken);
    setDestToken(defaultToken);
    setFromBalance("0");
    setToBalance("0");
    setPrice("1");
    setGasCost("0");
  }, []);

  const getBalance = useCallback(
    async (tk: IToken) => {
      setLoading("balance");

      if (tk.symbol === chain?.symbol) {
        setLoading("");
        return +(+balanceChain).toFixed(6);
      }
      const balance = await getTokenBalance(
        provider,
        evm.address,
        tk.address,
        tk.decimals
      );

      setLoading("");
      return Number(Number(balance).toFixed(6)).toString();
    },
    [chain?.symbol, provider, evm?.address, balanceChain]
  );

  const fetchPrice = useCallback(async () => {
    setLoading("price");

    const params: IGetSwapRate = {
      srcToken: srcToken,
      destToken: destToken,
      srcAmount: "1",
      networkID: config?.chainId,
    };

    const swapRate = await getSwapRate(params);
    if (swapRate === undefined) {
      toastr.error(t("swap.can_not_find_swap_pool_for_selected_pair"), {
        duration: 2000,
      });
      resets();
      return;
    }

    const destAmount = ethers.utils.formatUnits(
      swapRate.destAmount,
      swapRate.destDecimals
    );
    setPrice(Number(destAmount).toFixed(10).toString());
    // setGasCost(swapRate.gasCostUSD);
    setLoading("");
  }, [srcToken, destToken, config?.chainId, resets]);

  const fetchGasCost = useCallback(async () => {
    setLoading("Gas");

    const params: IGetSwapRate = {
      srcToken: srcToken,
      destToken: destToken,
      srcAmount: fromValue,
      networkID: config?.chainId,
    };

    const swapRate = await getSwapRate(params);
    const _gasCost = ethers.utils.formatEther(swapRate.gasCost);
    const finalFee = _gasCost;
    // const finalFee = (
    //   Number(_gasCost) +
    //   Number(fromValue) * (ParaswapEnum.PARTNER_FEE_BPS / 10000)
    // ).toFixed(10);
    setGasCost(finalFee);

    setLoading("");
  }, [srcToken, destToken, fromValue, config?.chainId]);

  const paraSwap = async () => {
    setLoading("swap");
    try {
      const slippage = 1;
      const params = {
        srcToken,
        destToken,
        srcAmount: fromValue,
        networkID: config?.chainId,
        userAddress: evm.address,
        slippage,
      };

      const resTransaction = await getSwapTransaction(params);
      const transaction = {
        data: resTransaction.data,
        to: resTransaction.to,
        value: resTransaction.value,
        from: resTransaction.from,
        gasPrice: resTransaction.gasPrice,
        gasLimit: ethers.utils.hexlify(1000000),
      };
      if (resTransaction?.error) {
        toastr.error(resTransaction.error, {
          duration: 2000,
        });
        setLoading("");
        return;
      }
      if (transaction) {
        const tradeTransaction = await wallet.sendTransaction(transaction);
        let receipt = await tradeTransaction.wait();
        //Logs the information about the transaction it has been mined.
        if (receipt) {
          console.info(
            `https://${config?.name.toLowerCase()}.etherscan.io/tx/${
              tradeTransaction.hash
            }`
          );
          if (srcToken.symbol !== chain?.symbol) {
            await getBalance(srcToken);
          }
          await getBalance(destToken);

          setFromValue("");
          setToValue("");
          setGasCost("0");
          setShowingModal("success");
        } else {
          console.error(t("swap.error_submitting_transaction"));
          setShowingModal("failed");
        }
      }
    } catch (err) {
      console.error(err);
      setLoading("");
      setShowingModal("failed");
    }
    setLoading("");
  };

  useEffect(() => {
    (async () => {
      if (
        srcToken.symbol !== defaultToken.symbol &&
        destToken.symbol !== defaultToken.symbol
      ) {
        await fetchPrice();
      }
      if (srcToken.symbol !== defaultToken.symbol) {
        const balance = await getBalance(srcToken);
        setFromBalance(balance.toString());
      }
      if (destToken.symbol !== defaultToken.symbol) {
        const balance = await getBalance(destToken);
        setToBalance(balance.toString());
      }
    })();
  }, [srcToken, destToken, getBalance, fetchPrice, fromValue, fetchGasCost]);

  const swapPosition = async () => {
    const fromTokenTemp = destToken;
    setToValue(fromValue);
    setDestToken(srcToken);
    setSrcToken(fromTokenTemp);
  };

  const min = (value1: number, value2: number) => {
    return value1 < value2 ? value1 : value2;
  };

  return (
    <View style={tw`flex flex-col h-full `}>
      <ScrollView style={tw`p-4`}>
        <View style={tw`flex flex-col mt-5`}>
          <WalletsCard address={evm?.address} />
        </View>
        <View style={tw`relative`}>
          <View style={tw`flex px-4 py-8`}>
            <View
              style={tw`flex flex-row items-center justify-between w-full mb-2 `}
            >
              <View>
                <Text
                  style={tw`text-base font-light text-gray-500 dark:text-white`}
                >
                  {t("swap.you_send")}
                </Text>
                <TextInput
                  style={tw`text-xl font-semibold text-gray-700`}
                  placeholder="0.0"
                  placeholderTextColor={primaryGray}
                  value={fromValue}
                  maxLength={20}
                  onChangeText={(value) => {
                    var reg = /^\d*\.?\d*$/;
                    if (reg.test(value) || value === "") {
                      setFromValue(value);
                    }
                  }}
                  onEndEditing={async () => {
                    setFromValue(
                      min(Number(fromValue), Number(fromBalance)).toString()
                    );
                    await fetchGasCost();
                    setError(null);
                  }}
                />
              </View>
              <View style={tw`flex-col items-end`}>
                <SelectToken
                  chainId={config?.chainId}
                  value={srcToken.symbol}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  listTokens={listTokens}
                  isError={isError}
                  isLoading={isLoading}
                  refetch={refetch}
                  disabledValue={destToken.symbol}
                  iconUri={srcToken.img}
                  onSetValue={(value) => {
                    setSrcToken(value);
                  }}
                />
                <Text style={tw`dark:text-white `}>
                  {fromBalance} {srcToken.symbol} {t("swap.available")}
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-1 mx-4 border-t border-gray-200`} />
            <TouchableOpacity
              underlayColor={primaryGray}
              style={[
                tw`w-8 h-8`,
                {
                  transform: [{ rotate: "90deg" }],
                },
              ]}
              onPress={async () => {
                await swapPosition();
              }}
            >
              <IconSwap width="100%" height="100%" />
            </TouchableOpacity>
            <View style={tw`flex-1 mx-4 border-t border-gray-200`} />
          </View>
          <View style={tw`flex px-4 py-8 rounded-t-2xl`}>
            <View
              style={tw`flex flex-row items-center justify-between w-full mb-2`}
            >
              <View>
                <Text
                  style={tw`text-base font-light text-gray-500 dark:text-white`}
                >
                  {t("swap.you_receive")}
                </Text>
                <Text
                  style={tw` text-${
                    Number(toValue) === 0 && ``
                  } font-semibold text-xl dark:text-white `}
                >
                  {Number(toValue) === 0 ? "0.0" : toValue}
                </Text>
              </View>
              <View style={tw`flex-col items-end`}>
                <SelectToken
                  chainId={config?.chainId}
                  value={destToken.symbol}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  listTokens={listTokens}
                  isError={isError}
                  isLoading={isLoading}
                  refetch={refetch}
                  disabledValue={srcToken.symbol}
                  iconUri={destToken.img}
                  onSetValue={(value) => {
                    setDestToken(value);
                  }}
                />
                <Text style={tw`text-right dark:text-white`}>
                  {toAmount} {destToken.symbol} {t("swap.available")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={tw`flex flex-col w-full p-4`}>
          <View style={tw`flex flex-row items-center justify-end w-full py-4`}>
            <View style={tw`flex flex-col items-center w-full`}>
              {loading === "price" ? (
                <Skeleton rounded="lg" w={"16"} h={"4"} />
              ) : (
                <View style={tw`flex-row items-center`}>
                  <View style={tw`h-2 w-2 rounded-full bg-[${primaryColor}]`} />
                  <Text style={tw`text-lg text-gray-400 dark:text-white`}>
                    {" "}
                    1 {srcToken.symbol} ~{" "}
                    {Number(Number(price).toFixed(6)).toString()}{" "}
                    {destToken.symbol}
                  </Text>
                </View>
              )}
              {/* {loading === 'Gas' ? (
                <Skeleton rounded="lg" w={'32'} h={'4'} />
              ) : (
                 <Text style={tw`dark:text-white 0`}>
                  Fee ~ {Number(gasCost).toString()} {chain?.symbol}
                </Text>
              )} */}
              <View
                style={tw`flex-row items-center justify-around w-full mt-8`}
              >
                <Text style={tw`text-xl dark:text-white`}>
                  {t("swap.optimized_gas_fee")}
                </Text>
                <Switch
                  trackColor={{ false: primaryGray, true: primaryColor }}
                  thumbColor="white"
                />
              </View>
              <View
                style={tw`flex-row items-center justify-around w-full mt-8`}
              >
                <View
                  style={tw`flex-row flex-wrap items-center justify-center`}
                >
                  <Text
                    style={tw`flex items-center text-center text-gray-400 dark:text-white`}
                  >
                    {t("swap.click_here_for")}
                  </Text>
                  <TouchableOpacity style={tw`ml-1`}>
                    <Text
                      style={tw`dark:text-white  text-[${primaryColor}] font-semibold`}
                    >
                      {t("swap.term_&_conditions")}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={tw`flex items-center text-center text-gray-400 dark:text-white`}
                  >
                    {t("swap.for_this_transactions_fee_will_be_taken")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        style={tw`absolute bottom-0 w-full px-4 mb-3`}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <Button
          buttonStyle={"rounded-2xl"}
          stringStyle={"font-semibold"}
          loading={loading?.length > 0}
          disabled={error?.length > 0}
          variant={error === null ? "primary" : "secondary"}
          onPress={() => {
            if (error === null) {
              setShowingModal("confirmation");
            }
          }}
        >
          {error ? error : t("swap.swap")}
        </Button>
      </KeyboardAvoidingView>

      <ModalResult
        showingModal={showingModal}
        setShowingModal={setShowingModal}
        loading={loading}
        fromSymbol={srcToken.symbol}
        toSymbol={destToken.symbol}
        message={
          showingModal === "confirmation"
            ? `${t("swap.are_you_sure_you_want_to_swap")} ${fromValue} ${
                srcToken.symbol
              } ${t("swap.for")} ${toValue} ${destToken.symbol}?`
            : `${t("swap.swapping")} ${srcToken.symbol} ${t("swap.for")} ${
                destToken.symbol
              }...`
        }
        onConfirm={async () => {
          await paraSwap();
        }}
      />
    </View>
  );
};

export default SwapScreen;
