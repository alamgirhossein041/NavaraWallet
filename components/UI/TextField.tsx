import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { secondaryGray } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import PressableAnimated from "./PressableAnimated";

export interface ITextFieldProps extends TextInputProps {
  type?: any;
  title?: string;
  value?: string;
  label?: string;
  styleInput?: string;
  maxLength?: number;
  labelPosition?: "left" | "top";
  labelStyle?: string;
  onChangeText?: (text: string) => void;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
  onIconPress?: () => void;
  padding?: string;
  placeholder?: string;
  err?: string | boolean;
}

const TextField = forwardRef((props: ITextFieldProps, ref) => {
  const {
    type,
    labelStyle,
    err,
    value,
    styleInput,
    onChangeText = () => {},
    placeholder,
    label,
    icon = <View />,
    iconPosition = "left",
    onIconPress = () => {},
    maxLength = 100,
  } = props;

  const [hidePassword, setHidePassword] = useState(type === "password");
  const [focused, setFocused] = useState<boolean>(false);
  const labelTop = useRef(new Animated.Value(0)).current;
  const labelLeft = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0.4)).current;
  const internalInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      setTimeout(() => internalInputRef.current.focus(), 100);
    },
  }));

  const topValue = labelTop.interpolate({
    inputRange: [0, 1],
    outputRange: [5, -38],
  });

  const leftValue = labelLeft.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const styles = StyleSheet.create({
    label: {
      position: "absolute",
      zIndex: -1,
      // color: "white",
      top: 12,
      left: 12,
    },
    passIcon: {
      position: "absolute",
      top: 12,
      right: 12,
    },
  });
  useEffect(() => {
    if (focused || Boolean(props.value)) {
      Animated.timing(labelTop, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(labelLeft, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(labelTop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(labelLeft, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(labelOpacity, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [props, focused]);

  return (
    <View style={tw`w-full my-3`}>
      <Pressable
        onPress={() => internalInputRef.current.focus()}
        style={tw`w-full mb-1 ${styleInput} h-15 items-center  relative flex-row px-3 rounded-xl  border 
        ${
          err
            ? "border-red-500 bg-red-100"
            : `${
                focused
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-700"
              }`
        } 
        `}
      >
        {iconPosition === "left" && (
          <PressableAnimated onPress={onIconPress}>{icon}</PressableAnimated>
        )}
        {type === "search" && (
          <View style={tw`flex items-center justify-center mx-1 select-none `}>
            <MagnifyingGlassIcon color="gray" />
          </View>
        )}
        <TextInput
          onBlur={() => {
            setFocused(false);
          }}
          style={[
            tw`w-full text-black android:py-2 ios:py-3 dark:text-white `,
            props.style,
          ]}
          type={type}
          placeholder={placeholder}
          placeholderTextColor={secondaryGray}
          secureTextEntry={hidePassword} //for password
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setFocused(true)}
          maxLength={maxLength}
          autoComplete="off"
          ref={internalInputRef}
          {...props}
        />
        <Animated.Text
          style={[
            styles.label,
            {
              transform: [{ translateX: leftValue }, { translateY: topValue }],
              opacity: labelOpacity,
            },
            tw`items-center justify-center mb-5 h-7 `,
          ]}
        >
          <Text style={tw`mt-3 font-bold dark:text-white`}>{label}</Text>
        </Animated.Text>
        <PressableAnimated
          onPress={() => {
            if (type === "password") {
              setHidePassword(!hidePassword);
            }
            onIconPress();
          }}
          style={tw`absolute flex items-center justify-center w-6 h-full right-4`}
        >
          {type === "password" ? (
            <>
              {hidePassword ? (
                <EyeSlashIcon
                  height="100%"
                  width="100%"
                  style={tw`text-gray-400`}
                />
              ) : (
                <EyeIcon height="100%" width="100%" style={tw`text-gray-400`} />
              )}
            </>
          ) : (
            <>{iconPosition === "right" && icon}</>
          )}
        </PressableAnimated>
      </Pressable>
      {typeof err === "string" && err && (
        <Text style={tw`text-center text-red-500 dark:text-white`}>{err}</Text>
      )}
    </View>
  );
});

export default TextField;
