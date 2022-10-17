import {View, Text} from 'react-native';
import React from 'react';
import {tw} from '../../../utils/tailwind';

export default function WebError() {
  return (
    <View style={tw`absolute top-0 z-10 flex-1 h-full bg-red-500`}>
      <Text>WebError</Text>
    </View>
  );
}
