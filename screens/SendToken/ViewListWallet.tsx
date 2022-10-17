import React from 'react';
import {View} from 'react-native';
import Loading from '../../components/Loading';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import ListChainsChart from '../Home/ListChainsChart';

const ViewListWallet = ({navigation}) => {
  const modeColor = useDarkMode();
  return (
    <View style={tw` h-full pt-1 ${modeColor} `}>
      <Loading type="skeleton">
        <ListChainsChart next="SendingToken" caching />
      </Loading>
    </View>
  );
};

export default ViewListWallet;
