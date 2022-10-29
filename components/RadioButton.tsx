import {View} from 'native-base';
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {tw} from '../utils/tailwind';
import {primaryColor, primaryGray} from '../configs/theme';

type RadioProps = {
  onValueChange?: () => void;
  padding?: string;
  children?: string | JSX.Element;
  disabled?: boolean;
  customStyle?: string;
  size?: string;
  value: boolean;
};

const RadioButton = ({
  onValueChange,
  disabled,
  customStyle,
  size = 'w-6 h-6',
  value,
  children,
}: RadioProps) => {
  return (
    <View style={tw`flex flex-row items-center`}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={tw`rounded-full  p-1 border-2
        border-[${primaryGray}]
        ${size}  ${customStyle}`}
        onPress={() => onValueChange()}
        disabled={disabled}>
        <View
          style={tw`w-full h-full rounded-full bg-[${
            value ? primaryColor : primaryGray
          }]`}
        />
      </TouchableOpacity>
      {typeof children === 'string' ? (
        <Text style={tw`dark:text-white  text-[${primaryGray}] text-center`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

export default RadioButton;
