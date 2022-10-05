import {View} from 'native-base';
import React from 'react';
import {Animated, Pressable, Text} from 'react-native';
import {tw} from '../utils/tailwind';

interface IScaleAnimationProps {
  scaleValue?: number;
  onPress?: () => void;
  children?: string | JSX.Element;
  style?: string;
}

/**
 * @author: ThaiND
 * Created Date: Mon Jun 13 2022
 * @description: Scale down on press in.
 * @param {scaleValue, onPress, children, style} : IScaleAnimationProps
 * @returns:
 * @example:
 */

const ScaleAnimation = ({
  scaleValue = 0.95,
  onPress,
  children,
  style,
}: IScaleAnimationProps) => {
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const outputRange = [1, scaleValue];
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
      <Pressable
        activeOpacity={0.6}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={tw`w-full flex items-center justify-center ${style}`}
        onPress={() => setTimeout(() => onPress(), 150)}>
        <View>
          {typeof children === 'string' ? (
            <Text style={tw`text-white text-lg text-center ${style}`}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default ScaleAnimation;
