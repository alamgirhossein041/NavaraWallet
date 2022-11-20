import React, { ComponentType, useEffect } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";

interface IScaleAnimationProps {
  /**
   * Value of the scale animation
   */
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  delay?: number;
  children?: JSX.Element[] | JSX.Element;
  style?: StyleProp<ViewStyle>;
  spinning?: boolean;
  /**
   *component to render inside the scale animation default is Pressable
   */
  component?: ComponentType<any>;
}
/**
 * @author ThaiND
 * Created Date Mon Jun 13 2022
 * @description Scale down on press in. Allows to use component's props
 * @param {scaleValue, onPress, children, style} : IScaleAnimationProps
 * @returns {JSX.Element}
 * @example
 * <PressableAnimatedSpin
      component={TouchableOpacity}
      activeOpacity={0.6}
      style={tw``}
      onPress={onPress}>
 */

const PressableAnimatedSpin = ({
  onPress = () => {},
  onPressIn = () => {},
  onPressOut = () => {},
  component = Pressable,
  children,
  style,
  delay = 150,
  spinning = false,
  ...props
}: IScaleAnimationProps): JSX.Element => {
  const AnimatedPressable = Animated.createAnimatedComponent(component);
  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const onPressInHandler = () => {
    // First set up animation
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    onPressIn();
  };
  const onPressOutHandler = () => {
    Animated.timing(spinValue, {
      toValue: 0,
      duration: 1000,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    onPressOut();
  };

  useEffect(() => {
    if (spinning) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        })
      ).start();
    }
  }, [spinValue, spinning]);

  return (
    <AnimatedPressable
      style={[
        style,
        {
          transform: [
            {
              rotate: spin,
            },
          ],
        },
      ]}
      onPressIn={onPressInHandler}
      onPressOut={onPressOutHandler}
      onPress={() => setTimeout(() => onPress(), delay)}
      {...props}
    >
      <>{children}</>
    </AnimatedPressable>
  );
};

export default PressableAnimatedSpin;
