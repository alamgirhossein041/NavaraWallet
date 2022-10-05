import { View } from "native-base";
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { tw } from "../utils/tailwind";
import { primaryColor } from "../configs/theme";
import { CheckIcon } from "react-native-heroicons/solid";
import React from "react"
type CheckBoxProps = {
  check: boolean;
  onPress?: () => void;
  checkBoxSize?: number;
  label?: string;
  labelStyle?: string;
  checkBoxStyle?: string;
};

const CheckBox = ({
  check = false,
  onPress,
  checkBoxSize = 5,
  checkBoxStyle,
  label,
  labelStyle,
}: CheckBoxProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View style={tw`w-full flex-row justify-center items-start mt-5`}>
        <TouchableOpacity activeOpacity={0.6}
          style={tw`flex justify-center items-center border-2 rounded mr-2 border-[${primaryColor}] relative w-[${checkBoxSize}] h-[${checkBoxSize}] ${checkBoxStyle}`}
          onPress={() => onPress()}
        >
          <View
            style={tw`absolute -bottom-1.5 -left-1 
            w-[${checkBoxSize + 3}] 
            h-[${checkBoxSize + 3}]`}
          >
            {check && (
              <CheckIcon
                width="100%"
                height="100%"
                stroke="white"
                fill={primaryColor}
              />
            )}
          </View>
        </TouchableOpacity>
        <View style={tw`w-11/12`}>
          <Text style={tw`text-sm text-[${primaryColor}] ${labelStyle}`}>
            {label}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckBox;
