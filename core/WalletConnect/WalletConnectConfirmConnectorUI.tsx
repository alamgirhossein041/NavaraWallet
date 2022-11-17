import React from "react";
import { Image, Text, View } from "react-native";
import { LockClosedIcon } from "react-native-heroicons/solid";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";

const WalletConnectConfirmConnectorUI = (props) => {
  const { payload } = props;
  const walletSelected = useWalletSelected();
  return (
    <View>
      <View style={tw`flex-col items-center justify-center w-full`}>
        <Image
          source={{ uri: payload?.peerMeta?.icons[0] }}
          style={tw`w-45 h-45`}
          width={45}
          height={45}
        />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="black" size={15} />
          <Text style={tw`mx-1 text-black dark:text-white`}>
            {payload.peerMeta.url}
          </Text>
        </View>
      </View>
      <Text style={tw`mb-5 text-lg font-bold text-center dark:text-white`}>
        Connect this site with WalletConnect
      </Text>

      <View
        style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}
      >
        <View style={tw`flex-row items-center mx-2`}>
          <Image
            style={tw`w-8 h-8 rounded-full`}
            source={{
              uri: getAvatar(walletSelected.index),
            }}
          />
          <Text style={tw`mx-1 font-bold dark:text-white`}>
            {walletSelected.data.name} ({shortenAddress(payload?.address)})
          </Text>
        </View>
      </View>
    </View>
  );
};
export { WalletConnectConfirmConnectorUI };
