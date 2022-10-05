import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import _ from "lodash";
import { tw } from "../../utils/tailwind";
import { primaryGray, secondaryGray } from "../../configs/theme";
import SelectToken from "./SelectToken";
import Button from "../../components/Button";
import { NETWORKS } from "../../enum/bcEnum";
import { SwitchVerticalIcon } from "react-native-heroicons/solid";
import { Token } from "@uniswap/sdk-core";
import axios from "axios";
import { IOption } from "../../components/ModalSelectOption";
import { Spinner } from "native-base";
import UniswapModule from "../../module/uniswap/UniSwapModule";
import { ITokenData } from "../../data/types";
import ModalResult from "./ModalResult";
import { useSelectedWallet } from "../../hooks/useSelectedWallet";
import { NETWORK_CONFIG } from "../../configs/bcNetworks";
import { ethers } from "ethers";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";

const SwapScreen = () => {
  const defaultTokenData: ITokenData = {
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    decimals: 18,
    logoURI: "",
    name: "",
    symbol: "",
  };

  const [fromToken, setFromToken] = useState<ITokenData>(defaultTokenData);
  const [toToken, setToToken] = useState<ITokenData>(defaultTokenData);
  const [fromBalance, setFromBalance] = useState<string>("0");
  const [toBalance, setToBalance] = useState<string>("0");
  const [price, setPrice] = useState("1");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("0.0");
  const [error, setError] = useState("Enter an amount");
  const [loading, setLoading] = useState("");
  const [showingModal, setShowingModal] = useState("");
  const [listTokens, setListTokens] = useState<ITokenData[]>();
  const [options, setOptions] = useState<IOption[]>();
  const network = NETWORKS.ETHEREUM;
  const selectedWallet = useSelectedWallet();
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);

  const config = NETWORK_CONFIG[network];

  useEffect(() => {
    if (selectedWallet) {
      try {
        let provider = new ethers.providers.JsonRpcProvider(config.rpc);
        setProvider(provider);
        let mnemonicWallet = ethers.Wallet.fromMnemonic(selectedWallet);
        const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider);
        setWallet(wallet);
      } catch (e) {
        console.log(e);
      }
    }
  }, [selectedWallet]);

  const init = async () => {
    const { chainId } = await provider.getNetwork();
    const url = "https://gateway.ipfs.io/ipns/tokens.uniswap.org";
    const response = await axios.get(url);
    const _listTokens = response.data.tokens;
    const networkListTokens = _listTokens.map((token: ITokenData) => {
      let logoURI = _listTokens.find(
        (t: ITokenData) => t.symbol === token.symbol
      )?.logoURI;
      logoURI = logoURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      return {
        ...token,
        logoURI,
      };
    });
    const filteredListTokens = networkListTokens.filter(
      (token: ITokenData) => token.chainId === chainId
    );
    setListTokens(filteredListTokens);

    const _options = filteredListTokens.map((token: ITokenData) => {
      return {
        label: token.symbol,
        value: token.address,
        iconUri: token.logoURI,
      };
    });
    setOptions(_options);
  };

  const fetchPrice = async () => {
    setLoading("price");
    const swapDetails = await UniswapModule.getSwapDetails(
      provider,
      wallet,
      createToken(fromToken),
      createToken(toToken),
      "1"
    );
    if (swapDetails.quote) setPrice(Number(swapDetails.quote).toString());

    setLoading("");
  };

  const checkError = () => {
    if (Number(fromValue) === 0) {
      setError("Enter an amount");
      return;
    }

    if (toToken.symbol === defaultTokenData.symbol) {
      setError("Select a to Token");
      return;
    }

    if (fromToken.symbol === defaultTokenData.symbol) {
      setError("Select a from Token");
      return;
    }
    if (Number(fromValue) > Number(fromBalance)) {
      setError("Insufficient Balance");
      return;
    }
  };

  useEffect(() => {
    if (provider) {
      (async () => {
        await init();
      })();
    }
  }, [provider]);

  useEffect(() => {
    checkError();
    setToValue(
      Number((Number(fromValue) * Number(price))?.toFixed(20)).toString()
    );
  }, [fromValue, fromToken, toToken, price]);

  const getBalance = async (token: ITokenData) => {
    setLoading("balance");
    const balance = await UniswapModule.getTokenBalance(
      provider,
      wallet,
      token.address,
      token.decimals
    );
    setLoading("");
    return Number(Number(balance).toFixed(6)).toString();
  };

  const fetchFromBalance = async () => {
    const balance = await getBalance(fromToken);
    setFromBalance(balance);
  };

  const fetchToBalance = async () => {
    const balance = await getBalance(toToken);
    setToBalance(balance);
  };

  useEffect(() => {
    (async () => {
      if (
        fromToken.symbol !== defaultTokenData.symbol &&
        toToken.symbol !== defaultTokenData.symbol
      ) {
        await fetchPrice();
      }
      if (fromToken.symbol !== defaultTokenData.symbol) {
        await fetchFromBalance();
      }
      if (toToken.symbol !== defaultTokenData.symbol) {
        await fetchToBalance();
      }
    })();
  }, [fromToken, toToken]);

  const swapPosition = async () => {
    const fromTokenTemp = toToken;
    const fromValueTemp = toValue;
    setToValue(fromValue);
    setToToken(fromToken);
    setFromValue(fromValueTemp);
    setFromToken(fromTokenTemp);
  };

  const createToken = (tokenData: ITokenData): Token => {
    const { chainId, address, decimals, symbol, name } = tokenData;
    return new Token(chainId, address, decimals, symbol, name);
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const buttonSize = 42;
  return (
    <View style={tw`h-full  flex flex-col ${modeColor}`}>
      <View style={tw`p-4`}>
        <View style={tw`relative`}>
          <View style={tw`flex px-4 py-8`}>
            <View
              style={tw`w-full flex flex-row items-center justify-between mb-2`}
            >
              <SelectToken
                options={options}
                value={fromToken.symbol}
                disabledValue={toToken.symbol}
                iconUri={fromToken.logoURI}
                onSetValue={async (value) => {
                  const token = listTokens.find((t) => t.address === value);
                  setFromToken(token);
                }}
              />
              <View>
                <TextInput
                  style={tw`text-gray-700 font-semibold text-xl`}
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
                // onEndEditing={async () => {
                //   setFromValue(min(Number(fromValue), Number(fromBalance)));
                //   setError("");
                // }}
                />
              </View>
            </View>
            <View style={tw`flex flex-row items-center`}>
              <Text style={tw`${textColor}`}>
                Balance: {fromBalance} {fromToken.symbol}
              </Text>
              <TouchableOpacity activeOpacity={0.6}
                style={tw`bg-red-500/20 rounded-full py-1 px-2 ml-2`}
                onPress={async () => {
                  setFromValue(fromBalance);
                }}
              >
                <Text style={tw`text-red-500 font-bold ${textColor}`}>Max</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`flex px-4 py-8 rounded-t-2xl  ${gridColor} `}>
            <View
              style={tw`w-full flex flex-row items-center justify-between mb-2`}
            >
              <SelectToken
                options={options}
                value={toToken.symbol}
                disabledValue={fromToken.symbol}
                iconUri={toToken.logoURI}
                onSetValue={async (value) => {
                  const token = listTokens.find((t) => t.address === value);
                  setToToken(token);
                }}
              />
              <View>
                <Text
                  style={tw` text-${Number(toValue) === 0 ? `[${primaryGray}]` : `gray-700`
                    } font-semibold text-xl ${textColor}`}
                >
                  {Number(toValue) === 0 ? "0.0" : toValue}
                </Text>
              </View>
            </View>
            <Text>
              {" "}
              Balance: {toBalance} {toToken.symbol}
            </Text>
          </View>
          <TouchableHighlight
            underlayColor={primaryGray}
            style={[
              tw`absolute z-10 left-1/2 top-1/2 p-1 rounded-2xl  ${gridColor} border-4 border-white`,
              {
                width: buttonSize,
                height: buttonSize,
                transform: [
                  { translateX: -buttonSize / 2 },
                  { translateY: -buttonSize / 2 },
                ],
              },
            ]}
            onPress={async () => {
              await swapPosition();
            }}
          >
            <SwitchVerticalIcon width="100%" height="100%" fill="gray" />
          </TouchableHighlight>
        </View>
        <View style={tw`w-full flex flex-col p-4 rounded-b-2xl ${gridColor}`}>
          <View
            style={tw`w-full flex flex-row py-4 items-center justify-end border-t border-gray-400`}
          >
            {loading === "price" ? (
              <View style={tw`flex flex-row`}>
                <Text style={tw`text-[${secondaryGray}] mr-1`}>
                  Fetching best price...
                </Text>
                <Spinner color={secondaryGray} />
              </View>
            ) : (
              <Text>
                1 {fromToken.symbol} ~{" "}
                {Number(Number(price).toFixed(6)).toString()} {toToken.symbol}
              </Text>
            )}
          </View>
          <Button
            buttonStyle={`rounded-2xl`}
            stringStyle={"font-semibold"}
            loading={loading.length > 0}
            disabled={error !== ""}
            onPress={() => {
              if (error === "") {
                setShowingModal("confirmation");
              }
            }}
          >
            {error !== "" ? error : "Swap"}
          </Button>
        </View>
      </View>

      <ModalResult
        showingModal={showingModal}
        setShowingModal={setShowingModal}
        loading={loading}
        fromSymbol={fromToken.symbol}
        toSymbol={toToken.symbol}
        message={
          showingModal === "confirmation"
            ? `Are you sure you want to swap ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}?`
            : `Swapping ${fromToken.symbol} for ${toToken.symbol}...`
        }
        onConfirm={async () => {
          setLoading("swap");
          const message = await UniswapModule.alphaRouterSwap(
            provider,
            wallet,
            createToken(fromToken),
            createToken(toToken),
            fromValue
          );
          setShowingModal(message);
          setLoading("");
        }}
      />
    </View>
  );
};

export default SwapScreen;
