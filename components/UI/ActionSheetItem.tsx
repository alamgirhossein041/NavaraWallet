import React from "react";
import { StyleProp, TouchableHighlight, useColorScheme } from "react-native";
import { tw } from "../../utils/tailwind";
interface IActionSheetItem {
  children?: JSX.Element;
  onPress?: () => void;
  style?: StyleProp<any>;
}
const ActionSheetItem = ({ children, onPress, style }: IActionSheetItem) => {
  const theme = useColorScheme();
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor={theme === "light" ? "#DDDDDD" : "#363636"}
      color={"amber.100"}
      onPress={onPress}
      active
      style={[tw`w-full p-3 mb-1 text-left rounded-lg`, style]}
    >
      {children}
    </TouchableHighlight>
  );
};
export default ActionSheetItem;
