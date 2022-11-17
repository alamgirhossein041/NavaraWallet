import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { Image, Text, View } from "react-native";
import { LockClosedIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

interface IConnectWalletProps {
  url: string;
}

export default function ConnectWallet(props: IConnectWalletProps) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { url } = props;
  const walletSelected = useWalletSelected();
  const ethAddress = shortenAddress(walletSelected.data.chains[0].address);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Favicon url={getDomainFromUrl(url)} />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="black" size={15} />
          <Text>{getDomainFromUrl(url)}</Text>
        </View>
        <Text style={tw`mb-5 text-xl font-bold dark:text-white`}>
          Connect to this site
        </Text>

        <View
          style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}
        >
          <Image
            style={tw`w-8 h-8 rounded-full`}
            source={{
              uri: getAvatar(walletSelected.index),
            }}
          />
          <View style={tw`mx-2`}>
            <Text style={tw`font-bold dark:text-white`}>
              {walletSelected.data.name || `Wallet ${walletSelected.index + 1}`}{" "}
              ({ethAddress}){walletSelected.data.chains[0].balance}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined">Cancel</Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary">Connect</Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
