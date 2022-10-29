import {View} from 'native-base';
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {tw} from '../utils/tailwind';
import {primaryColor, primaryGray, secondaryGray} from '../configs/theme';
import {CheckCircleIcon} from 'native-base';

type SelectButtonProps = {
  onValueChange?: (value: boolean) => void;
  padding?: string;
  children?: string | JSX.Element;
  disabled?: boolean;
  customStyle?: string;
  size?: string;
  rlt?: boolean;
  value: boolean;
};

const SelectButton = ({
  onValueChange,
  disabled,
  customStyle,
  size = 'w-6 h-6',
  value,
  children,
  rlt = false,
}: SelectButtonProps) => {
  return (
    <View
      style={tw`flex items-center ${rlt ? 'flex-row-reverse' : 'flex-row'}`}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={tw`flex items-center justify-center
        ${size}  ${customStyle}`}
        onPress={() => onValueChange(!value)}
        disabled={disabled}>
        <CheckCircleIcon color={value ? primaryColor : primaryGray} />
      </TouchableOpacity>
      {typeof children === 'string' ? (
        <Text
          style={tw`dark:text-white  text-[${secondaryGray}] text-center dark:text-white`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

export default SelectButton;
