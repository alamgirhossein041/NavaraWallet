import { Text } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import MiniAreaChart from "../../components/UI/MiniAreaChart";
import { ChartData } from "../../components/UI/MiniLineChart";
import SearchBar from "../../components/UI/SearchBar";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
const SubInvest = () => {
  const { width: viewportWidth, height: viewportHeight } =
    Dimensions.get("window");
  const SLIDE_WIDTH = Math.round(viewportWidth / 2.8);
  const ITEM_HORIZONTAL_MARGIN = 15;
  const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
  const SLIDER_WIDTH = viewportWidth;
  const walletSelected = useWalletSelected();
  const COIN_GECKO_URL = "https://api.coingecko.com/api/v3/coins/";
  const listChains = walletSelected.data.chains || [];
  const [price, setPrice] = React.useState<ChartData[]>([]);
  const [loadingPrices, setLoadingPrices] = React.useState(false);
  const [loadingBalance, setLoadingBalance] = React.useState(false);

  // const getPrice = useCallback(async () => {
  //   setLoadingPrices(true);
  //   const tokenId = await (
  //     await axios.get(`${apiUrl}/coin/`, {
  //       params: {
  //         symbol: chain.symbol.toLowerCase(),
  //       },
  //     })
  //   )?.data[0];

  //   const url = `${COIN_GECKO_URL}${await tokenId?.id}/market_chart`;
  //   const response = await axios.get(url, {
  //     params: {
  //       id: tokenId.id,
  //       vs_currency: 'usd',
  //       days: '14',
  //       interval: 'daily',
  //     },
  //   });

  //   const data = await response?.data?.prices;
  //   const _price: ChartData[] = data.map((item: any[], index: number) => {
  //     return {
  //       x: index,
  //       y: item[1] as number,
  //     };
  //   });
  //   setPrice(_price);
  //   setLoadingPrices(false);
  // }, [chain.symbol]);

  // useEffect(() => {
  //   (async () => {
  //     await getPrice();
  //   })();
  // }, [getPrice]);

  const RenderItem = (props) => {
    const Icon = CHAIN_ICONS[props.item.network];
    // const getPrice = useCallback(async () => {
    //   setLoadingPrices(true);
    //   const tokenId = await (
    //     await axios.get(`${apiUrl}/coin/`, {
    //       params: {
    //         symbol: props.item.symbol.toLowerCase(),
    //       },
    //     })
    //   )?.data[0];

    //   const url = `${COIN_GECKO_URL}${await tokenId?.id}/market_chart`;
    //   const response = await axios.get(url, {
    //     params: {
    //       id: tokenId.id,
    //       vs_currency: 'usd',
    //       days: '14',
    //       interval: 'daily',
    //     },
    //   });

    //   const data = await response?.data?.prices;
    //   const _price: ChartData[] = data.map((item: any[], index: number) => {
    //     return {
    //       x: index,
    //       y: item[1] as number,
    //     };
    //   });
    //   setPrice(_price);
    //   setLoadingPrices(false);
    // }, [props.item.symbol]);

    // useEffect(() => {
    //   (async () => {
    //     await getPrice();
    //   })();
    // }, [getPrice]);
    return (
      <View style={tw`m-2 `}>
        <View
          style={[
            tw`relative p-2 mb-3 
               bg-[#E2E8F0]
              rounded-3xl h-50`,
          ]}
        >
          <View style={tw`flex-row`}>
            <View style={tw`w-1/2`}>
              <Icon width={40} height={40} />
            </View>
            <View style={tw`flex w-1/2`}>
              <Text style={tw`dark:text-white  font-bold`}>
                {props.item.symbol}
              </Text>
              <Text style={tw`dark:text-white  capitalize text-regular`}>
                {props.item.network}
              </Text>
            </View>
          </View>
          <MiniAreaChart data={price} />
          <View style={tw`flex-row`}>
            {/* <View style={tw`flex-row items-end w-1/2 mr-3 `}>
              <CurrencyFormat
                value={price[price.length - 1]?.y}
                style=" font-bold text-[12px] m-0"
              />
            </View> */}
            <View style={tw`flex w-1/2 mt-1 mr-auto`}>
              <Text style={tw`dark:text-white  text-[14px] text-green-500 `}>
                +1,56%
                {/* {`${+balance.toFixed(4)} ${chain.symbol}`} */}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const { t } = useTranslation();
  return (
    <View style={tw`mb-10`}>
      <ScrollView style={tw`flex flex-col w-full p-3 `}>
        <SearchBar
          placeholder={t("search_bar.search")}
          // list={listChains}

          filterProperty={["network", "symbol"]}
          // onListFiltered={(list: any[]) => {
          //   setListChainsFiltered(list);
          // }}
        />
        <View style={tw`flex flex-row w-full px-2 `}>
          <View style={tw`mr-auto`}>
            <Text
              style={tw`dark:text-white  font-thin text-[12px] text-[#8E9BAE]`}
            >
              Market Cap
            </Text>
            <Text
              style={tw`dark:text-white  text-lg font-bold dark:text-white `}
            >
              $2.5B
            </Text>
            <Text style={tw`dark:text-white  text-xs text-green-500`}>
              +6.15%
            </Text>
          </View>
          <View style={tw`mx-auto`}>
            <Text
              style={tw`dark:text-white  font-thin text-[12px] text-[#8E9BAE]`}
            >
              24th Volumn
            </Text>
            <Text
              style={tw`dark:text-white  text-lg font-bold dark:text-white `}
            >
              $219B
            </Text>
            <Text style={tw`dark:text-white  text-xs text-green-500`}>
              +1.15%
            </Text>
          </View>
          <View style={tw`ml-auto`}>
            <Text
              style={tw`dark:text-white  font-thin text-[12px] text-[#8E9BAE]`}
            >
              BTC Dominance
            </Text>
            <Text
              style={tw`dark:text-white  text-lg font-bold dark:text-white `}
            >
              $60%
            </Text>
            <Text style={tw`dark:text-white  text-xs text-green-500`}>
              +0.45%
            </Text>
          </View>
        </View>

        <View style={tw`flex flex-row w-full px-2 my-5`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>Favorites</Text>
          <Text style={tw`dark:text-white  ml-auto text-[${primaryColor}]`}>
            See All
          </Text>
        </View>

        <Carousel
          data={listChains}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          activeSlideAlignment={"start"}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          renderItem={(props) => <RenderItem {...props} />}
        />
        {/* {listChains.map((chain: ChainWallet, index) => {
          return (
            <PriceChartsFavorites
              key={index}
              chain={chain}
            />
          );
        })} */}
        <View style={tw`flex flex-row w-full px-2 py-5`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>
            Live Prices
          </Text>
        </View>
        {/* {listChains.map((chain: ChainWallet, index) => {
          return (
            <Loading type="spin">
              <PricesChart key={index} chain={chain} next="DetailPrice" />
            </Loading>
          );
        })} */}
      </ScrollView>
    </View>
  );
};

export default SubInvest;
