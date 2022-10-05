import React from "react";
import { Alert, Text, View } from "react-native";
import IconHourglass from "../../assets/icons/icon-hourglass.svg";
import { tw } from "../../utils/tailwind";
import Button from "../../components/Button";
import HeaderScreen from "../../components/HeaderScreen";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";

const MintingDomain = ({navigation}) => {
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw` h-full ${modeColor}`}>
      <View style={tw` `}>
        {/* <HeaderScreen title="Mint Domain" showBack /> */}
        <Text style={tw`mx-6 leading-8 ${textColor}`}>
          Your free domain is being minted{" "}
        </Text>
        <Text style={tw`mx-6 leading-8 ${textColor}`}>
          After minting progress is complelte, your NFT domain will show on the
          chosen network and you can find it in Dnet app's NFT section.{" "}
        </Text>
      </View>
      <View style={tw`mx-auto`}>
        <IconHourglass />
      </View>
      <View style={tw`my-20`}>
        {/* <View style={tw`flex items-center mx-20 p-4 px-4`}>
          <Button
            onPress={() => Alert.alert("Button with adjusted color pressed")}
          >
            <Text style={tw`text-center text-base font-medium text-white`}>
              Track progress
            </Text>
          </Button>
        </View> */}
        <View style={tw`flex items-center mx-20 px-4`}>
          <Button
            onPress={() => navigation.popToTop()}
          >
            <Text style={tw`text-center text-base font-medium text-white`}>
              Go to home
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default MintingDomain;
