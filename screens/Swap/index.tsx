import React from 'react';
import {ScrollView, View} from 'react-native';
import Loading from '../../components/Loading';
import {SupportedSwapChainsEnum} from '../../enum';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import ListChainsChart from '../Home/ListChainsChart';

const SwapToken = () => {
  const modeColor = useDarkMode();
  const filter = Object.keys(SupportedSwapChainsEnum);

  return (
    <View style={tw`h-full flex flex-col ${modeColor}`}>
      <View
        style={tw`w-full  flex-1 flex-col items-center justify-between shadow  rounded-t-3xl ${modeColor}`}>
        <ScrollView style={tw`w-full mb-5 ${modeColor}`}>
          <Loading type={'spin'}>
            <ListChainsChart next="SwapScreen" caching filter={filter} />
          </Loading>
        </ScrollView>
      </View>
    </View>
  );
};

export default SwapToken;
