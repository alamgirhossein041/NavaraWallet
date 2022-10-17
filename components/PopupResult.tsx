import {Modal, useDisclose} from 'native-base';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {CheckIcon, XIcon} from 'react-native-heroicons/solid';
import {atom, useRecoilState, useRecoilValue} from 'recoil';
import {useDarkMode} from '../hooks/useModeDarkMode';
import {useGridDarkMode} from '../hooks/useModeDarkMode';
import {useTextDarkMode} from '../hooks/useModeDarkMode';
import {tw} from '../utils/tailwind';
import Button from './Button';

export interface IPopupResultProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  onPressButton?: () => void;
  buttonText?: string;
  isOpen: boolean;
}

const openPopupResultState = atom({
  key: 'openPopupResult',
  default: {
    isOpen: false,
  } as IPopupResultProps,
});
const PopupResult = () => {
  const [popupResult, setPopupResult] = useRecoilState(openPopupResultState);

  const {isOpen, type, title, onPressButton, buttonText} = popupResult;

  const onClose = () => {
    setPopupResult({...popupResult, isOpen: false});
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  useEffect(() => {
    if (!!isOpen) {
      setTimeout(() => {
        onClose();
      }, 500000000);
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View
        style={tw`${gridColor} h-1/5 w-3/4 rounded-xl relative flex items-center  `}>
        {type === 'success' && (
          <View
            style={tw`h-20 w-20 rounded-full border-2 flex items-center justify-center border-white bg-green-400 -top-10 absolute`}>
            <CheckIcon fill="white" height={50} width={50} />
          </View>
        )}
        {type === 'error' && (
          <View
            style={tw`h-20 w-20 rounded-full border-2 flex items-center justify-center border-white bg-red-400 -top-10 absolute`}>
            <XIcon fill="white" height={50} width={50} />
          </View>
        )}
        <View
          style={tw`w-full h-full px-5 flex-row items-center justify-center flex`}>
          <Text style={tw`text-center text-2xl font-bold ${textColor}`}>{title}</Text>
        </View>
        {/* <View style={tw`absolute bottom-3 w-full px-3`}>
          <Button onPress={onClose}>{buttonText ? buttonText : 'Close'}</Button>
        </View> */}
      </View>
    </Modal>
  );
};
export {openPopupResultState, PopupResult};
