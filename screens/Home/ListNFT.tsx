import {View, Text} from 'react-native';
import React from 'react';
import {tw} from '../../utils/tailwind';

export default function ListNFT() {
  return (
    <View style={tw`flex items-center justify-center text-center h-60`}>
      <Text style={tw`dark:text-white  text-lg font-bold text-gray-500`}>
        No nft is available
      </Text>
    </View>
  );
}
