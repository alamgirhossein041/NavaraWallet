import {useIsFocused, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {Skeleton} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {useRecoilState, useRecoilValue} from 'recoil';
import CurrencyFormat from '../../components/CurrencyFormat';
import MiniAreaChart, {ChartData} from '../../components/MiniAreaChart';
import {apiUrl} from '../../configs/apiUrl';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import {balanceChainsState} from '../../data/globalState/priceTokens';
import showTotalAssets from '../../data/globalState/showTotalAssets';
import {IChain, WalletInterface} from '../../data/types';
import {useWallet} from '../../hooks/useWallet';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {capitalizeFirstLetter} from '../../utils/stringsFunction';
import {tw} from '../../utils/tailwind';
import Carousel from 'react-native-snap-carousel';
const COIN_GECKO_URL = 'https://api.coingecko.com/api/v3/coins/';

interface IChainItem {
  chain: IChain;
  next: string;
  caching?: boolean;
}

const PriceChartsFavorites = ({chain, next, caching = false}: IChainItem) => {
  const [price, setPrice] = React.useState<ChartData[]>([]);
  const [loadingPrices, setLoadingPrices] = React.useState(false);
  const [loadingBalance, setLoadingBalance] = React.useState(false);
  const inVisible = useRecoilValue(showTotalAssets);
  const walletSelected = useWalletSelected();
  const isFocused = useIsFocused();
  const [balanceChains, setBalanceChains] = useRecoilState(balanceChainsState);
  const balance: number = balanceChains[chain.network] || 0;
  const {getBalanceOf, near, provider}: WalletInterface = useWallet({
    network: chain.network,
    mnemonic: chain,
    privateKey: chain.privateKey,
  });

  const getBalance = address => {
    if (caching) {
      return;
    }
    setLoadingBalance(balanceChains[chain.network] === undefined);
    // setLoadingBalance(true)
    getBalanceOf(address)
      .then((response: any) => {
        // setBalance(+response)
        setBalanceChains(oldState => {
          const newState = {...oldState};
          newState[chain.network] = +response;
          return newState;
        });

        setLoadingBalance(false);
      })
      .catch(e => {
        // load balance err
      })
      .finally(() => {
        setLoadingBalance(false);
      });
  };

  useEffect(() => {
    if (chain.address!) {
      getBalance(chain.address);
    }
  }, [chain.address, near, provider, walletSelected.data.id, isFocused]);

  const getPrice = useCallback(async () => {
    setLoadingPrices(true);
    const tokenId = await (
      await axios.get(`${apiUrl}/coin/`, {
        params: {
          symbol: chain.symbol.toLowerCase(),
        },
      })
    )?.data[0];

    const url = `${COIN_GECKO_URL}${await tokenId?.id}/market_chart`;
    const response = await axios.get(url, {
      params: {
        id: tokenId.id,
        vs_currency: 'usd',
        days: '14',
        interval: 'daily',
      },
    });

    const data = await response?.data?.prices;
    const _price: ChartData[] = data.map((item: any[], index: number) => {
      return {
        x: index,
        y: item[1] as number,
      };
    });
    setPrice(_price);
    setLoadingPrices(false);
  }, [chain.symbol]);

  useEffect(() => {
    (async () => {
      await getPrice();
    })();
  }, [getPrice]);

  const Icon = CHAIN_ICONS[chain.network];
  const navigation = useNavigation();
  const {width: viewportWidth, height: viewportHeight} =
    Dimensions.get('window');
  const SLIDE_WIDTH = Math.round(viewportWidth / 2.8);
  const ITEM_HORIZONTAL_MARGIN = 15;
  const ITEM_WIDTH = SLIDE_WIDTH + ITEM_HORIZONTAL_MARGIN * 2;
  const SLIDER_WIDTH = viewportWidth;
  const listChains = walletSelected.data.chains || [];

  const _renderItem = ({item, index}) => {
    return (
      <View style={tw` m-2`}>
        <View
          style={[
            tw`relative p-2 mb-3 
           bg-[#E2E8F0]
          rounded-3xl h-45`,
          ]}>
          <View style={tw`flex-row`}>
            <View style={tw` w-1/3 flex-row items-end mr-3`}>
              <View style={tw`bg-white rounded-full`}>
                <Icon width={40} height={40} />
              </View>
            </View>
            <View style={tw`w-2/3 flex`}>
              <Text style={tw`text-base font-semibold`}>
                {capitalizeFirstLetter(chain.network.split('_')[0])}
              </Text>
              <Text style={tw`text-xs text-gray-600`}>{chain.symbol}</Text>
            </View>
          </View>

          <View style={tw``}>
            {loadingPrices ? (
              <Skeleton rounded="lg" w={'20'} h={'10'} />
            ) : (
              <MiniAreaChart data={price} />
            )}
          </View>
          <View style={tw`flex-row`}>
            <View style={tw` w-1/2 flex-row items-end mr-3`}>
              <CurrencyFormat
                value={price[price.length - 1]?.y}
                style=" font-bold text-[12px] m-0"
              />
            </View>
            <View style={tw`w-1/2 flex mr-auto mt-1`}>
              <Text style={tw`text-xs text-green-500 `}>
                +1,56%
                {/* {`${+balance.toFixed(4)} ${chain.symbol}`} */}
              </Text>
            </View>
          </View>
          {/* <View style={tw`flex flex-row`}>
            <View style={tw``}>
              {loadingPrices ? (
                <Skeleton rounded="lg" w={'16'} h={'3'} />
              ) : (
                <CurrencyFormat
                  value={price[price.length - 1]?.y}
                  style=" font-semibold text-right m-0"
                />
              )}
            </View>
            <View style={tw`ml-auto`}>
              {loadingBalance ? (
                <Skeleton rounded="lg" w={'8'} h={'3'} />
              ) : (
                <View>
                  <Text style={tw`text-xs text-gray-600 text-right`}>
                    {`${+balance.toFixed(4)} ${chain.symbol}`}
                  </Text>
                </View>
              )}
            </View>
          </View> */}
        </View>
      </View>
    );
  };
  return (
    <>
      <Carousel
        data={listChains}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        activeSlideAlignment={'start'}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        renderItem={_renderItem}
      />
    </>
  );
};

export default PriceChartsFavorites;
