import {TouchableHighlight, StyleProp} from 'react-native';
import React from 'react';
import {Actionsheet} from 'native-base';
import {tw} from '../utils/tailwind';
import {primaryColor} from '../configs/theme';
interface IActionSheetItem {
  children: JSX.Element;
  onPress?: () => void;
  style?: StyleProp<any>;
}
const ActionSheetItem = ({children, onPress, style}: IActionSheetItem) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      color={'amber.100'}
      onPress={onPress}
      active
      style={[tw`w-full p-3 mb-1 text-left rounded-lg`, style]}>
      {children}
    </TouchableHighlight>
  );
};
export default ActionSheetItem;
