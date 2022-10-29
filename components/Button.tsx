/*
 *
 * @author ThaiND
 * Created at Tue Jun 14 2022
 * @description
 * @param
 * @returns
 * @example
 */
import { Spinner, View } from 'native-base';
import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { underLayPrimaryColor } from '../configs/theme';
import { tw } from '../utils/tailwind';
import PressableAnimated from './PressableAnimated';

type ButtonProps = {
  fullWidth?: boolean;
  onPress?: () => void;
  children?: string | JSX.Element;
  disabled?: boolean;
  loading?: boolean;
  iconRight?: JSX.Element;
  variant?: 'primary' | 'secondary' | 'outlined' | 'danger' | 'text';
};

const Button = ({
  fullWidth = false,
  onPress,
  children,
  disabled = false,
  loading = false,
  iconRight = <></>,
  variant = 'primary',
}: ButtonProps) => {
  const style = {
    primary: {
      value: tw`bg-blue-500 border-blue-500`,
      underlayColor: underLayPrimaryColor,
      textStyle: tw`text-white`,
    },
    secondary: {
      value: tw`bg-gray-200 border-blue-200`,
      underlayColor: '#f5f5f5',
      textStyle: tw`text-gray-700`,
    },
    danger: {
      value: tw`bg-red-400 border-red-400`,
      underlayColor: '#e36868',
      textStyle: tw`text-white`,
    },
    outlined: {
      value: tw`bg-white dark:bg-[#18191A]  border-2 border-blue-500`,
      underlayColor: 'white',
      textStyle: tw`text-blue-500`,
    },
    text: {
      value: tw`bg-transparent border-transparent`,
      underlayColor: '',
      textStyle: tw`text-blue-500`,
    },
    disabled: {
      value: tw`bg-gray-300 border-gray-300 dark:bg-gray-700 dark:border-gray-700 focus:outline-none`,
      underlayColor: 'white',
      textStyle: tw`text-white`,
    },
  };
  return (
    <PressableAnimated
      underlayColor={style[variant].underlayColor}
      component={TouchableHighlight}
      activeOpacity={0.6}
      style={[
        tw`flex flex-row items-center justify-center w-64 p-4 mt-2 border-2 rounded-2xl`,
        disabled || loading ? style.disabled.value : style[variant].value,
        tw`${fullWidth ? 'w-full' : 'w-auto'}`,
      ]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading && (
        <View style={tw`mr-1`}>
          <Spinner color="white" />
        </View>
      )}
      {/* {disabled &&  <View style={tw`mr-1`}>
          <BanIcon color="red" />
        </View>} */}
      <Text
        style={[
          tw`text-lg font-bold`,
          disabled ? style.disabled.value : style[variant].textStyle,
        ]}>
        {children}
      </Text>
      <View style={tw`ml-2`}>{iconRight}</View>
    </PressableAnimated>
  );
};

export default Button;
