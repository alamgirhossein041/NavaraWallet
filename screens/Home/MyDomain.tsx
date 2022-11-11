import Clipboard from "@react-native-clipboard/clipboard";
import { useLinkTo, useNavigation } from "@react-navigation/native";
import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { ChevronDownIcon } from "react-native-heroicons/solid";
import IconCopy from "../../assets/icons/icon-copy.svg";
import IconDetailWallet from "../../assets/icons/icon-detail-wallet.svg";
import IconGetDomain from "../../assets/icons/icon-get-domain.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";

const MyDomain = (props) => {
  return (
    <View style={tw`h-10 mb-5`}>
      <RenderDomain {...props} />
    </View>
  );
};

const RenderDomain = ({ data, index }: any) => {
  const { domain } = data;
  const handleCopyToClipboard = () => {
    //
    Clipboard.setString(domain);
    toastr.success("Copied");
  };
  const { isOpen, onOpen, onClose } = useDisclose();

  const detailWallet = () => {
    onOpen();
  };
  const linkTo = useLinkTo();

  const nameWallet =
    data.name === null ? `Wallet ${index + 1}` : `${data.name}`;
  // const nameWallet = walletSelected&&walletSelected?.data.name
  const navigation = useNavigation();
  const handleDetailWallet = () => {
    //
    onClose();
    navigation.navigate(
      "DetailWallet" as never,
      {
        index,
        data,
      } as never
    );
  };

  const handleGetNameService = () => {
    onClose();
    linkTo("/GetYourDomain");
  };
  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={detailWallet}
        style={[tw`flex-row items-center h-10 rounded-full `]}
      >
        <Text numberOfLines={1} style={tw`text-lg text-white`}>
          {domain ? domain : nameWallet}
        </Text>
        <ChevronDownIcon width={30} height={30} fill="white" color="gray" />
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
          <View style={tw`items-center `}>
            <Text style={tw`font-bold text-black dark:text-white `}>
              {nameWallet}
            </Text>
          </View>

          <ActionSheetItem onPress={handleDetailWallet}>
            <View style={tw`flex flex-row items-center w-full rounded-full`}>
              <View>
                <Text style={tw`font-bold text-black dark:text-white`}>
                  {nameWallet}
                </Text>
              </View>
              <View style={tw`ml-auto`}>
                <IconDetailWallet />
              </View>
            </View>
          </ActionSheetItem>

          {/* <Text style={tw`text-gray-500 dark:text-white`}>
                {t("domain.domain")}
              </Text> */}
          {!domain ? (
            <ActionSheetItem onPress={handleGetNameService}>
              <View style={tw`flex flex-row items-center w-full rounded-full `}>
                <View>
                  <Text style={tw`font-bold text-black dark:text-white `}>
                    {t("domain.get_your_favorite_domain")}
                  </Text>
                </View>
                <View activeOpacity={0.6} style={tw`ml-auto`}>
                  <IconGetDomain />
                </View>
              </View>
            </ActionSheetItem>
          ) : (
            <ActionSheetItem onPress={handleCopyToClipboard}>
              <View style={tw`flex flex-row items-center w-full rounded-full `}>
                <View>
                  <Text style={tw`font-bold text-black dark:text-white `}>
                    {domain}
                  </Text>
                </View>
                <View activeOpacity={0.6} style={tw`ml-auto`}>
                  <IconCopy />
                </View>
              </View>
            </ActionSheetItem>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default MyDomain;
