import React from 'react';
import {View} from 'react-native';
import Loading from '../../components/Loading';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import ListChainsChart from '../Home/ListChainsChart';

const ViewListWallet = ({navigation}) => {
  return (
    <View style={tw` h-full pt-1  `}>
      <Loading type="skeleton">
        <ListChainsChart next="SendingToken" caching />
      </Loading>
    </View>
  );
};

export default ViewListWallet;
