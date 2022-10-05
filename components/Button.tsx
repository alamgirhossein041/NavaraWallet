import {Spinner, View} from 'native-base';
import React from 'react';
import {Animated, Text, TouchableHighlight} from 'react-native';
import {primaryColor} from '../configs/theme';
import {tw} from '../utils/tailwind';

type ButtonProps = {
  onPress?: () => void;
  padding?: string;
  children?: string | JSX.Element;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: string;
  stringStyle?: string;
};

const Button = ({
  onPress,
  padding = 'p-4',
  children,
  disabled = false,
  loading = false,
  buttonStyle,
  stringStyle,
}: ButtonProps) => {
  const bgButtonColor = !disabled ? primaryColor : '#c9c9c9';
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, 0.95];
  const scale = animation.interpolate({inputRange, outputRange});

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={[
        tw`w-full flex items-center justify-center`,
        {transform: [{scale}]},
      ]}>
      <TouchableHighlight
        activeOpacity={0.6}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        underlayColor={primaryColor}
        onShowUnderlay={() => console.log(1)}
        style={tw`w-full flex flex-row items-center justify-center rounded-full 
        bg-[${bgButtonColor}]/${
          disabled || loading ? '70' : '100'
        } ${padding}  ${buttonStyle}`}
        onPress={() => setTimeout(() => onPress(), 150)}
        disabled={disabled || loading}>
        <View>
          {loading && (
            <View style={tw`mr-1`}>
              <Spinner color="white" />
            </View>
          )}
          {typeof children === 'string' ? (
            <Text style={tw`text-white text-lg text-center ${stringStyle}`}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
};

export default Button;
