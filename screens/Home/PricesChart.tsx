import { useNavigation } from "@react-navigation/native";
import { isNumber } from "lodash";
import { Skeleton } from "native-base";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/solid";
import { useQuery } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import MiniLineChart, { ChartData } from "../../components/UI/MiniLineChart";
import PressableAnimatedSpin from "../../components/UI/PressableAnimatedSpin";
import { CHAIN_ICONS, NATIVE_TOKEN_ICON } from "../../configs/bcNetworks";
import {
  dangerColor,
  primaryColor,
  safeColor,
  warningColor,
} from "../../configs/theme";
import { fetchMarketChart } from "../../data/api/fetching";
import { ChainWallet } from "../../data/database/entities/chainWallet";
import { priceTokenState } from "../../data/globalState/priceTokens";
import showTotalAssets from "../../data/globalState/showTotalAssets";
import { capitalizeFirstLetter } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";

interface IChainItem {
  chain: ChainWallet;
  next: string;
  caching?: boolean;
  tokenStatus?: "safe" | "warning" | "danger";
}

const PricesChart = ({ chain, next, caching = false }: IChainItem) => {
  const inVisible = useRecoilValue(showTotalAssets);
  const setPriceTokens = useSetRecoilState(priceTokenState);

  const {
    isLoading: loadingPrices,
    data: price,
    isError,
    refetch,
  } = useQuery(
    [`price-${chain.symbol}`, chain.symbol, chain.network, caching],
    async (): Promise<any> => {
      if (caching) {
        return null;
      }

      const response = await fetchMarketChart(chain.symbol);
      const priceData = await response?.prices;
      const latestPrice = priceData?.[priceData.length - 1]?.[1];
      setPriceTokens((prev) => {
        return {
          ...prev,
          [chain.network]: latestPrice,
        };
      });

      const _price: ChartData[] = priceData.map(
        (item: any[], index: number) => {
          return {
            x: index,
            y: item[1] as number,
          };
        }
      );
      return _price;
    }
  );

  const navigation = useNavigation();

  const IconChain = CHAIN_ICONS[chain.network];
  const IconToken = NATIVE_TOKEN_ICON[chain.network];
  const latestPrice = useMemo(
    () => price && price[price?.length - 1]?.y,
    [price]
  );

  const handleOnPress = () => {
    navigation.navigate(
      next as never,
      { token: { ...chain, price: latestPrice } } as never
    );
    return;
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={tw`flex-row items-center mb-4`}
    >
      <View style={tw`w-1/2 flex-row items-start h-full`}>
        <View style={tw`relative flex-row items-end mr-3`}>
          <View style={tw`bg-white dark:bg-[#18191A]  rounded-full`}>
            <IconToken width={40} height={40} />
          </View>
          <View
            style={tw`absolute -right-1 border-[0.4] border-gray-100 ml-0.5 bg-white dark:bg-[#18191A] rounded-full`}
          >
            <IconChain width={18} height={18} />
          </View>
        </View>
        <View>
          <View style={tw`flex-row items-center`}>
            <Text
              style={tw`dark:text-white  font-semibold text-[15px] text-black mr-1`}
            >
              {chain?.symbol}
            </Text>
            {StatusIcon("")}
          </View>
          <Text style={tw`dark:text-white text-gray-800 text-[13px] `}>
            {capitalizeFirstLetter(chain?.network.split("_")[0])}
          </Text>
        </View>
      </View>
      <View style={tw`w-1/2 flex-row items-start`}>
        <View style={tw``}>
          {!caching && (
            <>
              {isError || loadingPrices || !price ? (
                <PressableAnimatedSpin
                  onPress={refetch}
                  spinning={loadingPrices}
                >
                  <ArrowPathIcon color={primaryColor} />
                </PressableAnimatedSpin>
              ) : (
                <MiniLineChart data={price} />
              )}
            </>
          )}
        </View>
        <View style={tw`flex-1 items-end`}>
          {loadingPrices ? (
            <Skeleton rounded="lg" w={"16"} h={"3"} />
          ) : (
            <>
              {!caching && price && (
                <View>
                  <CurrencyFormat
                    value={latestPrice}
                    style="font-semibold text-sm"
                  />
                </View>
              )}
            </>
          )}
          <View>
            {inVisible ? (
              <Text style={tw`dark:text-white  `}>•••••</Text>
            ) : (
              <Text
                style={tw`dark:text-white  text-xs text-gray-600 text-right`}
              >
                {isNumber(chain.balance)
                  ? `${+chain.balance?.toFixed(4)} ${chain.symbol}`
                  : "failed"}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const StatusIcon = (status: string) => {
  switch (status) {
    case "warning":
      return (
        <InformationCircleIcon width={12} height={12} color={warningColor} />
      );
    case "danger":
      return (
        <ExclamationTriangleIcon width={12} height={12} color={dangerColor} />
      );
    default:
      return <CheckCircleIcon width={12} height={12} color={safeColor} />;
  }
};

export default PricesChart;
