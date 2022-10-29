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

  //text darkmode

  //grid, shadow darkmode

  useEffect(() => {
    if (!!isOpen) {
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={tw`relative flex items-center w-3/4 h-1/5 rounded-xl`}>
        {type === 'success' && (
          <View
            style={tw`absolute flex items-center justify-center w-20 h-20 bg-green-400 border-2 border-white rounded-full -top-10`}>
            <CheckIcon fill="white" height={50} width={50} />
          </View>
        )}
        {type === 'error' && (
          <View
            style={tw`absolute flex items-center justify-center w-20 h-20 bg-red-400 border-2 border-white rounded-full -top-10`}>
            <XIcon fill="white" height={50} width={50} />
          </View>
        )}
        <View
          style={tw`flex flex-row items-center justify-center w-full h-full px-5`}>
          <Text style={tw`text-2xl font-bold text-center dark:text-white `}>
            {title}
          </Text>
        </View>
        {/* <View style={tw`absolute w-full px-3 bottom-3`}>
          <Button onPress={onClose}>{buttonText ? buttonText : 'Close'}</Button>
        </View> */}
      </View>
    </Modal>
  );
};
export {openPopupResultState, PopupResult};
