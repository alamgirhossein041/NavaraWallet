import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Share from "react-native-share";
import IconCopy from "../../assets/icons/icon-copy.svg";
import IconShare from "../../assets/icons/icon-share.svg";
import { primaryColor } from "../../configs/theme";
import { IDomain } from "../../data/types";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import CryptoAddressForDomain from "./CryptoAddressForDomain";
import SocialNetWorkForDomain from "./SocialNetWorkForDomain";
export default function DetailDomain({ route }) {
  const { params } = route;
  const data: IDomain = params.data;
  const { t } = useTranslation();
  const handleShare = async (url) => {
    await Share.open({
      url,
      message: "Send via Navara Wallet",
    });
  };
  return (
    <ScrollView style={tw`px-4`}>
      <ViewDomain domain={data.domain} />
      <SocialNetWorkForDomain data={data} />
      <CryptoAddressForDomain chains={data.chains[0]} />
      <View style={tw`flex-row items-center justify-center my-5 text-center`}>
        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setString(data.domain);
            toastr.info("Copied");
          }}
          style={tw`items-center justify-center w-20 text-center `}
        >
          <IconCopy />
          <Text style={tw`text-lg font-bold text-center dark:text-white `}>
            {t("receive.copy")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare(data.domain)}
          style={tw`items-center justify-center w-20 text-center `}
        >
          <IconShare />
          <Text style={tw`text-lg font-bold text-center dark:text-white `}>
            {t("receive.share")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const ViewDomain = ({ domain }: { domain: string }) => {
  const text = domain.slice(0, 3);
  return (
    <View style={tw`flex-col items-center justify-center w-full mb-15`}>
      <View
        style={tw`h-15 rounded-full items-center justify-center mb-3 w-15 bg-[${primaryColor}]`}
      >
        <Text style={tw`text-lg font-bold text-white`}>{text}</Text>
      </View>
      <Text
        numberOfLines={1}
        style={tw`text-lg font-bold text-black dark:text-white`}
      >
        {domain}
      </Text>
    </View>
  );
};
