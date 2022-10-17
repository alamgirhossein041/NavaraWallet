import {View, Text} from 'react-native';
import React from 'react';
import {tw} from '../utils/tailwind';

interface IWalletAvatarProps {
  domain?: string;
  uri?: string;
  style?: string;
  textStyle?: string;
}
const WalletAvatar = ({domain, uri, style, textStyle}: IWalletAvatarProps) => {
  return (
    <View
      style={tw`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${style}`}>
      {uri ? (
        <></>
      ) : (
        <Text
          style={tw`w-10 h-10 text-3xl font-semibold text-center ${textStyle}`}>
          {domain && domain[0]}
        </Text>
      )}
    </View>
  );
};

export default WalletAvatar;
