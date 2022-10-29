import {View, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Modal} from 'native-base';
import {tw} from '../utils/tailwind';
import {useNavigation} from '@react-navigation/native';
import {XIcon} from 'react-native-heroicons/solid';
import PinCodeInput from './PinCodeInput';
import {useDarkMode} from '../hooks/useModeDarkMode';
import {useGridDarkMode} from '../hooks/useModeDarkMode';
import {useTextDarkMode} from '../hooks/useModeDarkMode';

const SignPinCode = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(true);

  const onClose = useCallback(() => {
    setIsOpen(false);
    navigation.goBack();
  }, []);
  //text darkmode

  //grid, shadow darkmode

  return (
    <Modal
      overlayVisible
      animationPreset={'slide'}
      style={tw`flex-row items-start justify-start w-full h-full `}
      isOpen={isOpen}>
      <Modal.Body style={tw`w-screen h-screen bg-white dark:bg-[#18191A] `}>
        <View style={tw`mt-10`}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClose}
            style={tw`items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full`}>
            <XIcon size={25} color="gray" />
          </TouchableOpacity>
        </View>

        <PinCodeInput type="required" hide onSuccess={() => setIsOpen(false)} />
      </Modal.Body>
    </Modal>
  );
};

export default SignPinCode;
