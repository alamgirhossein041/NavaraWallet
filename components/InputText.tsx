import { View } from 'native-base';
import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { tw } from '../utils/tailwind';
import { primaryGray, secondaryGray } from '../configs/theme';
import { EyeIcon, EyeOffIcon } from 'react-native-heroicons/outline';

interface ITextInput extends TextInputProps {
  type?: 'text' | 'password';
  value?: string;
  label?: string;
  maxLength?: number;
  labelPosition?: 'left' | 'top';
  labelStyle?: string;
  onChangeText?: (text: string) => void;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
  onIconPress?: () => void;
  padding?: string;
  style?: any;
  placeholder?: string;
}

const InputText = (props: ITextInput) => {
  const {
    type = 'text',
    value,
    label,
    maxLength = 100,
    labelPosition = 'top',
    labelStyle = '',
    onChangeText = () => { },
    icon = <View />,
    iconPosition = 'left',
    onIconPress = () => { },
    padding = 'p-2',
    style,
    placeholder,
  } = props;

  const [hidePassword, setHidePassword] = useState(type === 'password');

  const getFlex = () => {
    if (labelPosition === 'left') {
      return 'flex-row';
    } else {
      return 'flex-col';
    }
  };

  return (
    <View style={tw`${getFlex()}`}>
      {label && (
        <Text
          style={tw`text-base my-2 
          ${labelPosition === 'top' ? 'ml-2' : ''}  ${labelStyle}`}>
          {label}
        </Text>
      )}
      <View
        style={tw`relative w-full flex flex-row items-center bg-white rounded-full border border-[${primaryGray}]
      ${padding} ${style}
      `}>
        {iconPosition === 'left' && icon}
        <TextInput
          {...props}
          style={tw`w-full p-1 text-black`}
          maxLength={maxLength}
          placeholder={placeholder}
          placeholderTextColor={secondaryGray}
          value={value}
          secureTextEntry={hidePassword} //for password
          onChangeText={text => {
            onChangeText(text);
          }}
        />
        <TouchableOpacity activeOpacity={0.6}
          onPress={() => {
            if (type === 'password') {
              setHidePassword(false);
              setTimeout(() => {
                setHidePassword(true);
              }, 2000);
            }
            onIconPress();
          }}
          style={tw`w-5 h-full flex items-center justify-center absolute right-4`}>
          {type === 'password' ? (
            <>
              {hidePassword ? (
                <EyeOffIcon
                  height="100%"
                  width="100%"
                  style={tw`text-gray-400`}
                />
              ) : (
                <EyeIcon height="100%" width="100%" style={tw`text-gray-400`} />
              )}
            </>
          ) : (
            <>{iconPosition === 'right' && icon}</>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputText;
