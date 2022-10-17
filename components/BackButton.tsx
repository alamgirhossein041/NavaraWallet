import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ArrowLeftIcon} from 'react-native-heroicons/solid';
import {useNavigation} from '@react-navigation/native';
import {primaryColor} from '../configs/theme';
const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
      <ArrowLeftIcon fill={primaryColor} />
    </TouchableOpacity>
  );
};
export default BackButton;
