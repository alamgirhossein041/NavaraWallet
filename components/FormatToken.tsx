import {View, Text} from 'react-native';
import React from 'react';
import {tw} from '../utils/tailwind';
interface IFormatTokenProps {
  value: number;
  style?: string;
  network?: string;
}
export default function FormatToken({
  value,
  style,
  network,
}: IFormatTokenProps) {
  const formatedValue = value > 0.0001 ? 4 : 10;
  return (
    <View>
      <Text style={tw`${style}`}>
        {+value.toFixed(formatedValue)} {network}
      </Text>
    </View>
  );
}
