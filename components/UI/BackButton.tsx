import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={tw`flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800`}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeftIcon color={primaryColor} strokeWidth={2.4} />
    </TouchableOpacity>
  );
};
export default BackButton;
