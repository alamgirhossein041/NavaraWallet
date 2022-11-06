import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={tw`flex-row items-center h-10 w-15`}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeftIcon fill={primaryColor} />
    </TouchableOpacity>
  );
};
export default BackButton;
