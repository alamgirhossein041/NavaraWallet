import { TouchableOpacity } from "react-native";
import { tw } from "../utils/tailwind";
import React, { useState } from 'react';
const ButtonIcon = ({
  icon,
  onPress,
  style,
}: {
  icon: JSX.Element;
  onPress(): void;
  style?: any;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6}
      onPress={onPress}
      style={tw`rounded-full bg-white p-1 ${style} mx-2`}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default ButtonIcon