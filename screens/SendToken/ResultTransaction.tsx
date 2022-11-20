import CameraRoll from "@react-native-community/cameraroll";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import {
  ArrowDownTrayIcon,
  CheckIcon,
  HomeIcon,
  ShareIcon,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import Button from "../../components/UI/Button";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
export default function ResultTransaction({ route, navigation }) {
  const { card, amount, token } = route.params;

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
      toastr.success("Image saved to camera roll");
    });
  };
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={tw`flex-col items-center h-full p-4 bg-white dark:bg-[#18191A] `}
    >
      <ViewShot
        captureMode="mount"
        ref={viewShotRef}
        style={tw`w-full py-5 bg-white dark:bg-[#18191A] `}
        options={{ format: "jpg", quality: 1.0 }}
      >
        <View style={tw`flex-row justify-center w-full`}>
          <View
            style={tw`flex items-center justify-center w-20 h-20 mb-5 bg-green-400 border-2 border-white rounded-full `}
          >
            <CheckIcon fill="white" height={50} width={50} />
          </View>
        </View>
        <View
          style={tw`w-full p-4 bg-white dark:bg-[#18191A]  shadow rounded-2xl ios:border ios:border-gray-100 dark:border-gray-600`}
        >
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text
              style={tw`dark:text-white  text-lg font-bold text-[${primaryColor}]`}
            >
              Navara
            </Text>
            <Text style={tw`text-xs text-gray-400 dark:text-white`}>
              {dayjs(new Date()).format("DD/MM/YYYY HH:mm:ss")}
            </Text>
          </View>
          <View style={tw`p-2 mb-3 bg-blue-200 rounded-lg`}>
            <Text style={tw`text-lg font-bold text-center text-blue-500 `}>
              {t("send.transfer_successful")}
            </Text>
          </View>
          <Text style={tw`text-xl font-bold text-center dark:text-white`}>
            {amount} {token.symbol}
          </Text>
          {card}
        </View>
      </ViewShot>

      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          onPress={handleSaveImage}
          style={tw`flex-row items-center justify-center`}
        >
          <ArrowDownTrayIcon
            fill={primaryColor}
            style={tw`ml-5 `}
            width={20}
            height={20}
          />
          <Text style={tw`mx-1 text-lg dark:text-white `}>
            {t("send.save")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={captureViewShot}
          style={tw`flex-row items-center justify-center`}
        >
          <ShareIcon
            fill={primaryColor}
            style={tw`ml-5 `}
            width={20}
            height={20}
          />
          <Text style={tw`mx-1 text-lg dark:text-white `}>
            {t("send.share")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`absolute w-full bottom-3 left-4 right-4`}>
        <Button onPress={() => navigation.replace("TabsNavigation")}>
          <View style={tw`flex-row items-center`}>
            <HomeIcon fill={"white"} width={30} />
            <Text style={tw`text-lg font-bold text-white dark:text-white`}>
              {t("send.go_to_home")}
            </Text>
          </View>
        </Button>
      </View>
    </SafeAreaView>
  );
}
