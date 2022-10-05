import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../../components/Button";
import InputIcon from "../../components/InputIcon";
import { tw } from "../../utils/tailwind";
import HeaderScreen from "../../components/HeaderScreen";
import { bgGray } from "../../configs/theme";
import { useDarkMode } from "../../hooks/useDarkMode";
const VerifyPassPhrase = ({ navigation }) => {
  const modeColor = useDarkMode();
  return (
    <ScrollView style={tw`${modeColor} `}>
      <View style={tw`p-5 android:pt-2  ${modeColor} h-full py-[10%]`}>
        {/* <HeaderScreen title="Verify passphrase" showBack /> */}
        {/* <Text style={tw`text-4xl text-black dark:text-white py-5`}>
          Verify passphrase
        </Text> */}
        <View style={tw`flex flex-row items-center justify-between py-3`}>
          <Text style={tw`text-lg  py-3`}>Fill your passphrase</Text>
        </View>
        <View style={tw`py-5 my-5 mx-10 bg-white  rounded-2xl `}>
          <TextInput
            multiline
            numberOfLines={3}
            keyboardType="numeric"
            style={tw`p-5`}
          />
        </View>

        <View style={tw` flex items-center p-3  px-4`}>
          <Button
            stringStyle="text-center text-base font-medium text-white"
            onPress={() => navigation.replace("TabsNavigation")}
          >
            Continue
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default VerifyPassPhrase;
