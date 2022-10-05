import { View, Text, TextInput } from "react-native";
import React from "react";
import { tw } from "../utils/tailwind";

type InputIconProps = {
  type: string;
  title?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: JSX.Element;
  padding?: string;
  style?: string;
  placeholder?: string;
  styleText?: string;
  // searchList?: any[];
  // setSearchList?: (value: React.SetStateAction<any[]>) => void;
  // searchProperty?: string[];
};

const InputIcon = ({
  type,
  icon,
  value,
  onChangeText = () => { },
  padding = "p-2",
  style,
  styleText,
  placeholder,
  title,
}: InputIconProps) => {
  return (
    <View style={tw` ${style}`}>
      <Text style={tw`mr-3 mb-1 leading-6 text-[#8E8E93] font-bold`}>{title}</Text>
      <View
        style={tw` flex flex-row px-3 bg-gray-100 rounded-full text-gray-400 mb-3`}
      >
        <TextInput
          type={type}
          style={tw`${styleText} `}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
        />
        <Text style={tw`ml-auto mr-2 mt-2`}>{icon}</Text>
      </View>
    </View>
  );
};

export default InputIcon;
