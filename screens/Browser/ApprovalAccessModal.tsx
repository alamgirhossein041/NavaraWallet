import React from "react";
import { Image, Text, View } from "react-native";
import { LockClosedIcon } from "react-native-heroicons/solid";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

export function ApproveAccessModal(props: any) {
  const { url, address, favicon } = props;
  const ethAddress = shortenAddress(address);
  const { data: selectedWallet, index: walletIndex } = useWalletSelected();
  return (
    <View style={tw`flex-column items-center`}>
      <Favicon url={favicon} />
      <View style={tw`flex-row items-center mb-3`}>
        <LockClosedIcon color="gray" size={15} />
        <Text style={tw`text-black dark:text-white`}>
          {getDomainFromUrl(url)}
        </Text>
      </View>
      <Text style={tw`mb-5 text-xl font-bold text-black dark:text-white`}>
        Connect to this site
      </Text>
      <View
        style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}
      >
        <Image
          style={tw`w-8 h-8 rounded-full`}
          source={{
            uri: getAvatar(walletIndex || 0),
          }}
        />
        <View style={tw`mx-2`}>
          <Text style={tw`font-bold text-black dark:text-white`}>
            {selectedWallet?.name || `Wallet ${walletIndex + 1}`} ({ethAddress})
          </Text>
        </View>
      </View>
    </View>
  );
}
