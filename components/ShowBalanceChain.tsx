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

export default function ShowBalanceChain({chain}: {chain: IChain}) {
  const [inVisible, setInVisible] = useRecoilState(showTotalAssets);
  const balanceChains = useRecoilValue(balanceChainsState);
  const balance = chain.balance;
  const Icon = CHAIN_ICONS[chain.network];
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View>
      <TouchableOpacity onPress={() => setInVisible(!inVisible)}>
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
          style={tw`flex-row items-center justify-center w-full mb-4 bg-white rounded-full shadow h-17 w-17`}>
          <Icon height={50} width={50} />
        </View>
      </View>
      {!inVisible ? (
        <Text style={tw`text-center text-2xl mb-4 ${textColor} font-bold`}>
          {balance === 0 ? 0 : balance?.toFixed(4)} {chain.symbol}
        </Text>
      ) : (
        <Text style={tw`text-center text-2xl mb-4 ${textColor} font-bold`}>
          ••••• {chain.symbol}
        </Text>
      )}
    </View>
  );
}
