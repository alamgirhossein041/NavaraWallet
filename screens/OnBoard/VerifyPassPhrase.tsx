import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Button from "../../components/UI/Button";
import { tw } from "../../utils/tailwind";
const VerifyPassPhrase = ({ navigation }) => {
  return (
    <ScrollView scrollEnabled={false} style={tw` `}>
      <View style={tw`p-5 android:pt-2   min-h-full py-[10%]`}>
        <View style={tw`flex flex-row items-center justify-between py-3`}>
          <Text style={tw`dark:text-white  text-lg  py-3`}>
            Fill your passphrase
          </Text>
        </View>
        <View
          style={tw`py-5 my-5 mx-10 bg-white dark:bg-[#18191A]   rounded-2xl `}
        >
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
