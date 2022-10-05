import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { tw } from "../../utils/tailwind";
import IconNEAR from "../../assets/icons/icon-near.svg";
import IconSOL from "../../assets/icons/icon-solana.svg";
import IconETH from "../../assets/icons/icon-eth.svg";
import IconBTC from "../../assets/icons/icon-btc.svg";
import IconBSC from "../../assets/icons/icon-bsc.svg";
import IconTera from "../../assets/icons/icon-terra.svg";
import Button from "../../components/Button";
import HeaderScreen from "../../components/HeaderScreen";
import { localStorage, NAME_WALLETS } from "../../utils/storage";
import { bgGray } from "../../configs/theme";
import { useDarkMode } from "../../hooks/useDarkMode";
const ChooseNetwork = () => {
  const [arrayIcon, setArrayIcon] = useState([
    { icon: <IconNEAR />, nameWallet: "Near", selected: false },
    { icon: <IconSOL />, nameWallet: "Solana", selected: false },
    { icon: <IconETH />, nameWallet: "ETH", selected: false },
    { icon: <IconBTC />, nameWallet: "Bitcoin", selected: false },
    { icon: <IconBSC />, nameWallet: "BSC", selected: false },
    { icon: <IconTera />, nameWallet: "Tera", selected: false },
    { icon: <IconNEAR />, nameWallet: "Near", selected: false },
    { icon: <IconSOL />, nameWallet: "Solana", selected: false },
    { icon: <IconETH />, nameWallet: "ETH", selected: false },
  ]);

 
  const modeColor = useDarkMode()
  return (
    <ScrollView>
      <View style={tw`p-5 android:pt-2 ${modeColor} h-full`}>
        {/* <HeaderScreen title="Choose networks" showBack /> */}
        {/* <Text style={tw`mt-5 text-3xl text-black dark:text-white`}>
          Choose networks
        </Text> */}
        <Text style={tw`text-lg text-black dark:text-white mt-10 font-medium`}>
          Dnet currently supports 30 networks
        </Text>
        <View style={tw`my-5 flex flex-row flex-wrap justify-between`}>
          {arrayIcon.map((item, index) => {
            return (
              <TouchableOpacity activeOpacity={0.6}
                style={tw`relative py-5`}
                key={index}
                onPress={() => {
                  const icons = [...arrayIcon];
                  icons[index].selected = !icons[index].selected;
                  setArrayIcon(icons);
                }}
              >
                {!item.selected ? (
                  <Image
                    source={require("../../assets/circle/EllipseDefault.png")}
                  />
                ) : (
                  <Image
                    source={require("../../assets/circle/EllipseActive.png")}
                  />
                )}

                <View style={tw` absolute top-[13px] left-[27px] py-5`}>
                  {item.icon}
                  <Text style={tw`text-center my-1`}>{item.nameWallet}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={tw`mt-auto flex items-center w-full px-4`}>
          <Button
            onPress={() => Alert.alert("Button with adjusted color pressed")}
          >
            <Text style={tw`text-center text-base font-medium text-white`}>
              Continue
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ChooseNetwork;
