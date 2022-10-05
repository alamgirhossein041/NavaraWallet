import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { tw } from "../../utils/tailwind";
import { primaryColor } from "../../configs/theme";
import IconCopy from "../../assets/icons/icon-copy.svg";
import IconLocation from "../../assets/icons/icon-location.svg";
import { useLinkTo } from "@react-navigation/native";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LIST_WALLETS, YOUR_DOMAIN } from "../../utils/storage";
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from "../../utils/toastr";
import { IWallet } from "../../data/types";
import { useRecoilState } from "recoil";
import { listWalletsState } from "../../data/globalState/listWallets";
const MyDomain = () => {
  return (
    <View style={tw`mb-3`}>
      <ButtonGetYourDomain />
    </View>
  );
};

const ButtonGetYourDomain = () => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState)
  const walletSelected: IWallet = !!listWallets ? listWallets.find((wallet: IWallet) => wallet.isSelected) : null

  const yourDomain = walletSelected?.domain || null
  const linkTo = useLinkTo();
  return yourDomain ? (
    <CopyMyDomain domain={yourDomain} />
  ) : (
    <TouchableOpacity activeOpacity={0.6}
      onPress={() => linkTo('/GetYourDomain')}
      style={tw`bg-[${primaryColor}] rounded-full my-3 `}>
      <Text style={tw`text-center py-2 px-2 text-white `}>Get your domain</Text>
    </TouchableOpacity>
  );
};

const CopyMyDomain = ({ domain }: any) => {

  const copyToClipboard = () => {
    Clipboard.setString(domain);
    toastr.success('Copied');
  };

  return (
    <TouchableOpacity activeOpacity={0.6}
      onPress={copyToClipboard}
      style={[
        tw`p-2 rounded-full mt-2 w-52 shadow bg-white flex-row items-center justify-between `,
      ]}>
      <View
        style={tw`h-5 w-5 flex-row items-center bg-[#004785] justify-center rounded-full `}>
        <IconLocation />
      </View>
      <Text style={tw`text-black text-center mr-2 `}>{domain}</Text>
      <IconCopy />
    </TouchableOpacity>
  );
};

export default MyDomain;
