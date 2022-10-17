import React from 'react';
import {ScrollView, View} from 'react-native';
import {tw} from '../../utils/tailwind';
// import tokens from "./TokenData";
import Loading from '../../components/Loading';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import ListChainsChart from '../Home/ListChainsChart';

const ReceiveToken = ({navigation}) => {
  const modeColor = useDarkMode();
  return (
    <View style={tw`h-full flex flex-col ${modeColor}`}>
      <View
        style={tw`w-full  flex-1 flex-col items-center justify-between shadow  rounded-t-3xl ${modeColor}`}>
        <ScrollView style={tw`w-full mb-5 ${modeColor}`}>
          <Loading type={'spin'}>
            <ListChainsChart next="ReceiveSpecificToken" caching />
          </Loading>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReceiveToken;
