import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import IconGoogle from "../../assets/icons/icon-google.svg";
import IconFacebook from "../../assets/icons/icon-facebook.svg";
import IconTelegram from "../../assets/icons/icon-telegram.svg";
import IconTwitter from "../../assets/icons/icon-twitter.svg";
import {
  Button,
  Center,
  FormControl,
  Input,
  Modal,
  NativeBaseProvider,
} from "native-base";

import { tw } from "../../utils/tailwind";
const arrayServices = [
  { icon: <IconGoogle />, name: "Google" },
  { icon: <IconFacebook />, name: "Facebook" },
  { icon: <IconTelegram />, name: "Telegram" },
  { icon: <IconTwitter />, name: "Twitter" },
];

const NewYourWallet = ({ navigation }) => {
  return (
    <View style={tw`p-5 android:pt-2 bg-[#F8FAFC] dark:bg-gray-800 h-full`}>
      <Text style={tw`text-lg text-black dark:text-white mt-10`}>
        Choose one of your existing services
      </Text>

      {arrayServices.map((item, index) => {
        return (
          <TouchableOpacity activeOpacity={0.6}
            key={index}
            style={[
              tw`flex flex-row justify-between bg-white items-center p-5  w-full rounded-full mt-5 shadow-lg`,
            ]}
            onPress={() => navigation.navigate("WalletName")}
          >
            {item.icon}
            {/* <Image source={item.icon} /> */}
            <Text style={tw`mr-auto ml-3 text-2xl uppercase`}>{item.name}</Text>
            <Text style={tw`mr-3`}>
              <Image source={require("../../assets/icons/icon-path.png")} />
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NewYourWallet;
