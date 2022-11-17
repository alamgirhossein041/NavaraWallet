import { useNavigation } from "@react-navigation/native";

import { Actionsheet, Spinner, useDisclose } from "native-base";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useQuery } from "react-query";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import MenuItem from "../../components/UI/MenuItem";
import TokenIcon from "../../components/UI/TokenIcon";
import { primaryColor } from "../../configs/theme";
import walletConnect from "../../core/WalletConnect";
import { localStorage, WALLETCONNECT_SESSIONS } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
const dayjs = require("dayjs");
const ManageSessions = () => {
  const { isLoading, data } = useQuery(
    "sessions_wallet_connect",
    async () =>
      (await localStorage.get(WALLETCONNECT_SESSIONS)) as Promise<any[]>
  );
  console.log(data);

  const handleKillSesstion = (peerId) => {
    console.log(peerId, data);
    walletConnect.killSession(peerId);
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View>
        <Spinner color={primaryColor} size={30} />
      </View>
    );
  } else if (!data || data.length === 0) {
    return (
      <View style={tw`items-center justify-center flex-1`}>
        <Text style={tw`text-lg`}>No connected sessions</Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex flex-col w-full p-3 `}>
      {data &&
        data?.map((sesssion) => (
          <SessionItem sesssion={sesssion} key={sesssion.peerMeta} />
        ))}
    </ScrollView>
  );
};

const SessionItem = ({ sesssion }) => {
  console.log(sesssion);

  const { isOpen, onClose, onOpen } = useDisclose();
  const peerMeta = sesssion.peerMeta;
  const navigation = useNavigation();

  const handleKillSesssion = (peerId) => {
    walletConnect.killSession(peerId);
    navigation.goBack();
  };
  return (
    <View>
      <MenuItem
        icon={<TokenIcon uri={peerMeta.icons[0]} />}
        onPress={onOpen}
        value={<Text>{dayjs(sesssion.lastAccess).fromNow()}</Text>}
        name={
          <View style={tw`flex-col`}>
            <Text
              style={tw`ml-2 text-sm font-bold text-gray-800 dark:text-white `}
            >
              {peerMeta.name}
            </Text>
            <Text style={tw`ml-2 text-sm text-gray-400 dark:text-white `}>
              {peerMeta.url}
            </Text>
          </View>
        }
        next={false}
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <ActionSheetItem
            onPress={() => {
              handleKillSesssion(sesssion.peerId);
            }}
          >
            <Text style={tw`text-red-500`}>Disconnect</Text>
          </ActionSheetItem>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
export default ManageSessions;
