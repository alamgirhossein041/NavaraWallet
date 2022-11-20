import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Modal } from "native-base";
import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/solid";
import Google from "../../assets/icons/icon-google.svg";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { GoogleClientIdEnum } from "../../enum";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { GOOGLE_ACCESS_TOKEN } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";

interface ILoginToCloudModalProps {
  navigation?: any;
  isOpenModal: boolean;
  onClose?: () => void;
}
const LoginToCloudModal = ({
  isOpenModal = false,
  onClose,
}: ILoginToCloudModalProps) => {
  const [_, setStorageAccessToken] = useLocalStorage(GOOGLE_ACCESS_TOKEN);

  const SCOPE = ["https://www.googleapis.com/auth/drive.file"];
  useEffect(() => {
    GoogleSignin.configure({
      scopes: SCOPE,
      webClientId: GoogleClientIdEnum.WEB,
      iosClientId: GoogleClientIdEnum.IOS,
      offlineAccess: false,
    });
  });

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (Platform.OS === "ios") {
        try {
          await GoogleSignin.addScopes({
            scopes: SCOPE,
          });
        } catch (error) {}
      }
      if (userInfo) {
        toastr.success(`Logged in as ${userInfo?.user?.email}`);
      }
      const _accessToken = await GoogleSignin.getTokens();

      setStorageAccessToken({
        accessToken: _accessToken.accessToken,
        email: userInfo?.user?.email,
      });
    } catch (error: any) {
      GoogleSignin.signOut();
      throw new Error(error);
    }
  };
  //background Darkmode

  const clouds = [
    {
      name: "Login with Google",
      icon: <Google width="100%" height="100%" fill={primaryColor} />,
      onPress: async () => {
        await googleSignIn();
        onClose();
      },
    },
  ];

  return (
    <Modal isOpen={isOpenModal} onClose={onClose} style={tw``}>
      <Modal.Content style={tw`w-full h-full p-5 flex flex-col  rounded-3xl`}>
        <PressableAnimated
          onPress={() => onClose()}
          style={tw`w-7 h-7 p-0.5 flex items-center justify-center bg-gray-400/30 rounded-full mb-6`}
        >
          <XMarkIcon
            style={tw`dark:text-white text-black `}
            width="100%"
            height="100%"
          />
        </PressableAnimated>
        <Text
          style={tw`dark:text-white  text-center mb-10 text-xl font-medium  `}
        >
          Restore wallet on Google Drive
        </Text>
        <View style={tw`flex items-center`}>
          {clouds.map((cloud, index) => (
            <PressableAnimated
              key={index}
              onPress={cloud.onPress}
              style={tw`w-full flex-row items-center bg-gray-500/10 rounded-xl p-3`}
            >
              <View
                style={tw`w-9 h-9 bg-white dark:bg-[#18191A]  p-1 rounded-full`}
              >
                {cloud.icon}
              </View>
              <Text style={tw`dark:text-white  text-lg  font-medium ml-5`}>
                {cloud.name}
              </Text>
              <View />
            </PressableAnimated>
          ))}
        </View>
      </Modal.Content>
    </Modal>
  );
};

export default LoginToCloudModal;
