import {View, Text, TouchableOpacity} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import React, {useRef} from 'react';
import {tw} from '../../utils/tailwind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {primaryColor} from '../../configs/theme';
import dayjs from 'dayjs';
import {
  CheckIcon,
  DownloadIcon,
  DuplicateIcon,
  HomeIcon,
  ShareIcon,
} from 'react-native-heroicons/solid';
import Button from '../../components/Button';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import toastr from '../../utils/toastr';
export default function ResultTransaction({route, navigation}) {
  const {card, amount, token} = route.params;

  const viewShotRef: any = useRef();
  const captureViewShot = async () => {
    const imageURI = await viewShotRef.current.capture();
    await Share.open({
      url: imageURI,
    });
  };

  const handleSaveImage = async () => {
    const imageURI = await viewShotRef.current.capture();

    CameraRoll.saveImageWithTag(imageURI).then(() => {
      toastr.success('Image saved to camera roll');
    });
  };
  return (
    <SafeAreaView style={tw`flex-col items-center h-full p-4 bg-white`}>
      <ViewShot
        captureMode="mount"
        ref={viewShotRef}
        style={tw`w-full py-5 bg-white`}
        options={{format: 'jpg', quality: 1.0}}>
        <View style={tw`flex-row justify-center w-full`}>
          <View
            style={tw`flex items-center justify-center w-20 h-20 mb-5 bg-green-400 border-2 border-white rounded-full `}>
            <CheckIcon fill="white" height={50} width={50} />
          </View>
        </View>
        <View
          style={tw`w-full p-4 bg-white shadow rounded-2xl ios:border ios:border-gray-100`}>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-lg font-bold text-[${primaryColor}]`}>
              Navara
            </Text>
            <Text style={tw`text-xs text-gray-400`}>
              {dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}
            </Text>
          </View>
          <View style={tw`p-2 mb-3 bg-blue-200 rounded-lg`}>
            <Text style={tw`text-lg font-bold text-center text-blue-500 `}>
              Transfer successful
            </Text>
          </View>
          <Text style={tw`text-xl font-bold text-center`}>
            {amount} {token.symbol}
          </Text>
          {card}
        </View>
      </ViewShot>

      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          onPress={handleSaveImage}
          style={tw`flex-row items-center justify-center`}>
          <DownloadIcon
            fill={primaryColor}
            style={tw`ml-5 `}
            width={20}
            height={20}
          />
          <Text style={tw`mx-1 text-lg `}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={captureViewShot}
          style={tw`flex-row items-center justify-center`}>
          <ShareIcon
            fill={primaryColor}
            style={tw`ml-5 `}
            width={20}
            height={20}
          />
          <Text style={tw`mx-1 text-lg `}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`absolute w-full bottom-3 left-4 right-4`}>
        <Button onPress={() => navigation.replace('TabsNavigation')}>
          <View style={tw`flex-row items-center`}>
            <HomeIcon fill={'white'} width={30} />
            <Text style={tw`text-lg font-bold text-white`}>Go to home</Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
