import React from 'react';
import {View} from 'react-native';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import TokenCard from './TokenCard';

const ShareAddress = ({navigation, route}) => {
  const token = route.params.token;
  const amount = route.params.amount;
  //background Darkmode

  //text darkmode

  //grid, shadow darkmode

  return (
    <View style={tw`h-full flex-col items-center justify-center `}>
      <View style={tw`w-full flex-col items-center justify-center p-4`}>
        <TokenCard token={token as string} amount={amount ? amount : null} />
      </View>
    </View>
  );
};

export default ShareAddress;
