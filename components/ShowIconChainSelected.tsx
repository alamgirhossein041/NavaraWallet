import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {IChain} from '../data/types';
import {useRecoilState, useRecoilValue} from 'recoil';
import {balanceChainsState} from '../data/globalState/priceTokens';
import CurrencyFormat from './CurrencyFormat';
import {tw} from '../utils/tailwind';
import {CHAIN_ICONS} from '../configs/bcNetworks';
import showTotalAssets from '../data/globalState/showTotalAssets';
import {EyeOffIcon} from 'react-native-heroicons/solid';
import {useTextDarkMode} from '../hooks/useModeDarkMode';
import {useGridDarkMode} from '../hooks/useModeDarkMode';

export default function ShowIconChainSelected({chain}: {chain: IChain}) {
  const [inVisible, setInVisible] = useRecoilState(showTotalAssets);
  const balanceChains = useRecoilValue(balanceChainsState);
  const balance = balanceChains[chain.network] || 0;
  const Icon = CHAIN_ICONS[chain.network];
  //text darkmode

  //grid, shadow darkmode

  return (
    <View>
      <View style={tw`  rounded-full `}>
        <Icon height={24} width={24} />
      </View>
      {/* <TouchableOpacity onPress={() => setInVisible(!inVisible)}>
        {inVisible ? (
          <View style={tw`flex-row items-center justify-center mb-4`}>
            <EyeOffIcon fill={'gray'} width={30} height={30} />
          </View>
        ) : (
          <CurrencyFormat
            value={balance * +chain.price}
            style="text-center text-3xl mb-4  font-bold"
          />
        )}
      </TouchableOpacity>
      <View style={tw`flex-row justify-center w-full`}>
        <View
          style={tw`w-full flex-row items-center justify-center mb-4 h-17 w-17 rounded-full bg-white dark:bg-[#18191A]  shadow`}>
          <Icon height={50} width={50} />
        </View>
      </View>
      {!inVisible ? (
         <Text style={tw`dark:text-white  text-center text-2xl mb-4  font-bold`}>
          {balance === 0 ? 0 : balance.toFixed(4)} {chain.symbol}
        </Text>
      ) : (
         <Text style={tw`dark:text-white  text-center text-2xl mb-4  font-bold`}>
          ••••• {chain.symbol}
        </Text>
      )} */}
    </View>
  );
}
