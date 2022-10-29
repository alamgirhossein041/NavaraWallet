import React from 'react';
import { Text, View } from 'react-native';
import Logo from '../../assets/logo/logo.svg';
import { tw } from '../../utils/tailwind';
export default function HeaderHome() {
  return (
    <View style={tw`flex-row items-center m-3 mt-0`}>
      <View style={tw`flex-row items-center m-3 mt-0`}>
        <Logo width={50} height={50} />
        <Text style={tw`text-3xl font-bold dark:text-white `}>
          Navara
        </Text>
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
