import { View } from "native-base";
import React from "react";
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { CheckIcon } from "react-native-heroicons/solid";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
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
        <TouchableOpacity
          activeOpacity={0.6}
          style={tw`flex justify-center items-center border-2 rounded mr-2 border-[${primaryColor}] relative w-[${checkBoxSize}] h-[${checkBoxSize}] ${checkBoxStyle}`}
          onPress={() => onPress()}
        >
          {check && (
            <View
              style={tw`absolute -bottom-1.5 -left-1 
             w-[${checkBoxSize + 3}] 
             h-[${checkBoxSize + 3}]`}
            >
              <CheckIcon
                width="100%"
                height="100%"
                stroke={primaryColor}
                fill={primaryColor}
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={tw`w-11/12`}>
          <Text style={tw`dark:text-white  text-sm  ${labelStyle}`}>
            {label}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckBox;
