import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {tw} from '../../utils/tailwind';
import Logo from '../../assets/logo/logo.svg';
import IconNotification from '../../assets/icons/icon-notification.svg';
import ScanHomeQR from './ScanHomeQR';
import { useNavigation } from '@react-navigation/native';
export default function HeaderHome() {
  const navigation = useNavigation();
  return (
    <View style={tw`flex-row items-center m-3 mt-0`}>
      <View style={tw`flex-row items-center m-3 mt-0`}>
        <Logo width={50} height={50} />
        <Text style={tw`text-3xl font-bold text-black`}>Navara</Text>
      </View>
      <View style={tw`flex-row items-center m-3 mt-0 ml-auto `}>
        {/* <TouchableOpacity style={tw`mr-2`}>
          <ScanHomeQR />
        </TouchableOpacity> */}
        {/* <TouchableOpacity>
          <IconNotification width={25} height={25} onPress={()=>{navigation.navigate("Notification")}}/>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
