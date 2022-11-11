import React from "react";
import { Pressable } from "react-native";
import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
  HapticOptions,
} from "react-native-haptic-feedback";

/**
 * @description Trigger haptic feedback
 */

export const triggerHapticFeedback = (
  hapticType?: HapticFeedbackTypes,
  hapticOptions?: HapticOptions
) => {
  const type = hapticType || "impactMedium";
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
    ...hapticOptions,
  };

  ReactNativeHapticFeedback.trigger(type, options);
};

interface IHapticProps {
  onPressIn?: () => void;
  children?: JSX.Element[] | JSX.Element;
  hapticType?: HapticFeedbackTypes;
  hapticOptions?: HapticOptions;
}

const PressableHapticFeedback = ({
  onPressIn = () => {},
  children,
  hapticType,
  hapticOptions,
  ...props
}: IHapticProps): JSX.Element => {
  const onPressInHandler = () => {
    triggerHapticFeedback(hapticType, hapticOptions);
    onPressIn();
  };

  return (
    <Pressable onPressIn={onPressInHandler} {...props}>
      <>{children}</>
    </Pressable>
  );
};

export default PressableHapticFeedback;
