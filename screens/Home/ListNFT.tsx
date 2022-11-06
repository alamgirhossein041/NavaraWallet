import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { ArrowRightIcon } from "react-native-heroicons/solid";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

export default function ListNFT() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // useEffect(() => {
  //   goDetail();
  // }, []);

  const goDetail = () => {
    navigation.navigate(
      "Browser" as never,
      {
        screen: "MainBrowser",
        params: {
          url: "https://opensea.io",
        },
      } as never
    );
    // createTabBrowser({url: item.link, title: NEW_TAB});
  };

  return (
    <View style={tw`flex items-center justify-center text-center h-60`}>
      <Text style={tw`text-lg font-bold text-gray-500 dark:text-white`}>
        {t("home.no_nft_is_available")}
      </Text>
      <PressableAnimated onPress={goDetail} style={tw`flex-row items-center`}>
        <Text style={tw`mx-1 text-lg font-bold text-blue-500 underline`}>
          opensea.io
        </Text>
        <ArrowRightIcon size={20} color={primaryColor} rotation={-45} />
      </PressableAnimated>
    </View>
  );
}
