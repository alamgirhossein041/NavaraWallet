import {View, Text} from 'react-native';
import React from 'react';
import Button from './Button';
import {tw} from '../utils/tailwind';
import PressableAnimated from './PressableAnimated';
import {primaryColor} from '../configs/theme';

interface ITryAgarinButtonProps {
  onPress: () => void;
  message?: string;
}
export default function TryAgainButton({
  onPress,
  message = 'Error! An error occurred',
}: ITryAgarinButtonProps) {
  return (
    <View style={tw`items-center justify-center`}>
      <Text style={tw`dark:text-white  my-5 font-bold text-gray-500`}>
        {message}
      </Text>
      <View style={tw`w-1/3`}>
        <PressableAnimated
          onPress={onPress}
          style={tw`items-center p-3 text-center bg-[${primaryColor}] rounded-full`}>
          <Text style={tw`dark:text-white  font-bold text-white`}>
            Try again
          </Text>
        </PressableAnimated>
      </View>
    </View>
  );
}
