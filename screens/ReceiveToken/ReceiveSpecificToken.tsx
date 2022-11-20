import Clipboard from "@react-native-clipboard/clipboard";
import { useLinkTo } from "@react-navigation/native";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Share from "react-native-share";
import ViewShot from "react-native-view-shot";
import QRCode from "react-qr-code";
import IconCopy from "../../assets/icons/icon-copy.svg";
import IconShare from "../../assets/icons/icon-share.svg";
import { SelectListChains } from "../../components/UI/SelectListChains";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
const ReceiveSpecificToken = ({ route, navigation }) => {
  const { token } = route.params;
  const walletSelected = useWalletSelected();

  //background Darkmode
  const { t } = useTranslation();
  const Icon = CHAIN_ICONS[token.network];
  // const { isOpen, onOpen, onClose } = useDisclose();

  navigation.setOptions({
    title: `${t("stack_screen.receive")} ${token.symbol}`,
    headerRight: () => (
      <SelectListChains token={token} next="ReceiveSpecificToken" />
    ),
  });

  const viewShotRef: any = useRef();
  const captureViewShot = async () => {
    const imageURI = await viewShotRef.current.capture();
    const res = await Share.open({
      url: imageURI,
      message: `This is my ${token.symbol} wallet`,
    });
  };
  // function captureScreenShot() {
  //   captureScreen({
  //     format: 'png',
  //     quality: 1.0,
  //   }).then(
  //     url => {
  //       Share.share({title: 'Image', url: url});
  //     },
  //     error => console.error('Oops snapshot failled', error),
  //   );
  // }
  const linkTo = useLinkTo();
  return (
    <ScrollView style={tw`flex-col h-full p-2`}>
      <ViewShot
        captureMode="mount"
        ref={viewShotRef}
        options={{ format: "jpg", quality: 1.0 }}
      >
        <View style={tw`flex-1 w-full `}>
          <View style={tw`items-center mb-5 `}>
            <Icon width={80} height={80} />
          </View>

          {walletSelected.data.domain ? (
            <TouchableOpacity
              style={tw`flex flex-row p-2 mx-auto mb-3 rounded-lg `}
              activeOpacity={0.6}
              onPress={async () => {
                await Clipboard.setString(walletSelected.data.domain);
                toastr.info("Copied");
              }}
            >
              <Text
                style={tw`mx-2 text-sm font-bold text-center dark:text-white `}
              >
                {walletSelected.data.domain}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => linkTo("/CreateDomain")}
                style={tw`bg-[${primaryColor}] mx-10 rounded-full my-3 `}
              >
                <Text
                  style={tw`px-2 py-2 font-bold text-center text-white dark:text-white `}
                >
                  {t("receive.get_your_domain")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View style={tw`flex items-center justify-center w-full my-5`}>
            <View
              style={tw`relative items-center justify-center w-2/3 p-5 bg-white border-2 border-gray-100 dark:border-gray-600/60 rounded-3xl`}
            >
              <QRCode value={`${token.currentAddress}`} size={200} />
            </View>
          </View>

          <TouchableOpacity
            style={tw`p-2 mb-3`}
            activeOpacity={0.6}
            onPress={async () => {
              await Clipboard.setString(token.currentAddress);
              toastr.info("Copied");
            }}
          >
            <Text style={tw`px-5 text-sm text-center dark:text-white `}>
              {shortenAddress(token.currentAddress)}
            </Text>
          </TouchableOpacity>
        </View>
      </ViewShot>
      <View style={tw`flex-row items-center justify-center my-5 text-center`}>
        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setString(token.currentAddress);
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
          onPress={captureViewShot}
          style={tw`items-center justify-center w-20 text-center `}
        >
          <IconShare />
          <Text style={tw`text-lg font-bold text-center dark:text-white `}>
            {t("receive.share")}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`dark:text-white  mx-auto text-[10px]`}>
        {t("receive.accept_payment_from_other_navara")}
      </Text>
      <Text style={tw`dark:text-white  mx-auto text-[10px]`}>
        {t("receive.wallet_users")}
      </Text>
      {/* <Actionsheet isOpen={isOpen} onClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <Actionsheet.Content style={tw``}>
            <Text
              style={tw`text-center dark:text-white font-bold text-xl py-2`}
            >
              Networks
            </Text>
            <ListChainSelect next="ReceiveSpecificToken" caching />
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet> */}
    </ScrollView>
  );
};

export default ReceiveSpecificToken;
