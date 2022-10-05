import { ScrollView, Text, View } from "react-native";
import Figure from "../../assets/enable-cloud-backup.svg";
import Button from "../../components/Button";
import { bgGray, primaryGray } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import React from "react"
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";
const EnableCloudBackup = ({ navigation, route }) => {
  const handleClick = () => {
    navigation.navigate("SelectBackupWallet");
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <ScrollView style={tw`${modeColor}`}>
      <View style={tw`h-full flex justify-between p-5 android:pt-2 `}>
        <View>
          <Text style={tw`w-full text-center text-3xl font-semibold py-3`}>
            Enable Cloud Backup
          </Text>

          <View style={tw` `}>
            <Figure width="100%" />
          </View>
          <View>
            <Text style={tw`w-full text-center text-base font-semibold py-3 ${textColor}` }>
              Do you want to enable Cloud backup?
            </Text>
            <Text style={tw`w-full text-left py-3 ${textColor}`}>
              Your master password is used to encrtpt and decrypt your wallet
              recovery file. This pasword is required when you import/export
              your wallet
            </Text>
          </View>
        </View>
        <View style={tw`flex items-center p-3  px-4`}>
          <Button
            stringStyle="text-center text-lg font-medium text-white"
            onPress={handleClick}
          >
            I Agree
          </Button>
          <Button
            buttonStyle={`bg-[${primaryGray}] mt-3`}
            stringStyle="text-center text-lg font-medium text-white"
            onPress={() => {
              navigation.replace("TabsNavigation");
            }}
          >
            Skip
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default EnableCloudBackup;
