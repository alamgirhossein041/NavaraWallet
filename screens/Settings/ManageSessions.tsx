import { useNavigation } from "@react-navigation/native";
import { Actionsheet, Spinner, useDisclose } from "native-base";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LinkIcon,
} from "react-native-heroicons/solid";
import { useQuery } from "react-query";
import { eventHub } from "../../App";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { EVM_MAINNET_CONFIG } from "../../configs/bcMainnets";
import {
  CHAIN_ICONS,
  EVM_CHAINS,
  NETWORK_CONFIG_BY_CHAIN_ID,
} from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import {
  BACKGROUND_BRIDGE_UPDATED,
  UPDATE_BACKGROUND_BRIDGE,
} from "../../core/eventHub";
import walletConnect from "../../core/WalletConnect";
import { NETWORKS } from "../../enum/bcEnum";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getETHAddressFromChains from "../../utils/getETHAddressFromChains";
import { localStorage, WALLETCONNECT_SESSIONS } from "../../utils/storage";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
const dayjs = require("dayjs");

const ManageSessions = () => {
  const navigation = useNavigation();
  const [selectedNetwork, setSelectedNetwork] = useState<string>(
    NETWORKS.ETHEREUM
  );
  const { isLoading, data, refetch } = useQuery(
    "sessions_wallet_connect",
    async () =>
      (await localStorage.get(WALLETCONNECT_SESSIONS)) as Promise<any[]>
  );

  const walletSelected = useWalletSelected();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SelectNetwork token={selectedNetwork} />,
    });
  }, [selectedNetwork]);

  useEffect(() => {
    eventHub.removeAllListeners(BACKGROUND_BRIDGE_UPDATED);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    eventHub.on(BACKGROUND_BRIDGE_UPDATED, (session) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const selectedNetwork = session.chainId
        ? NETWORK_CONFIG_BY_CHAIN_ID[session.chainId.toString()]?.network
        : NETWORKS.ETHEREUM;
      setSelectedNetwork(selectedNetwork);
    });
  }, []);

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
    <View style={tw`flex-col bg-white dark:bg-[#18191A]  `}>
      <ScrollView style={tw`flex flex-col w-full px-3 h-7/8`}>
        {data &&
          data?.map((session) => (
            <SessionItem
              refetch={refetch}
              session={session}
              key={session.peerMeta}
            />
          ))}
      </ScrollView>
      <View style={tw`p-3 h-1/8`}>
        <Animatable.View
          collapsable={true}
          animation="slideInUp"
          style={tw`flex-row items-center justify-between w-full h-full px-4 bg-blue-500 rounded-lg`}
        >
          <View style={tw`flex-row justify-center`}>
            <Image
              style={tw`w-10 h-10 rounded-full`}
              source={{
                uri: getAvatar(walletSelected.index),
              }}
            />
            <View style={tw`mx-3`}>
              <Text style={tw`font-bold text-white text-[15px]`}>
                {walletSelected.data.domain || walletSelected.data.name}
              </Text>
              <Text style={tw`text-white `}>
                {shortenAddress(
                  getETHAddressFromChains(walletSelected.data.chains)
                )}
              </Text>
            </View>
          </View>
          <LinkIcon color="white" size={30} />
        </Animatable.View>
      </View>
    </View>
  );
};

const SessionItem = ({ session: session, refetch }) => {
  const peerMeta = session.peerMeta;
  const handleKillSesssion = (peerId) => {
    walletConnect.killSession(peerId);
    refetch();
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const url = peerMeta.url ? new URL(peerMeta.url) : { hostname: null };
  return (
    <View style={tw`py-3 border-b border-gray-100 dark:border-gray-600`}>
      <PressableAnimated
        onPress={() => setIsExpanded(!isExpanded)}
        style={tw`flex-row items-center justify-between `}
      >
        <View style={tw`flex-row items-center`}>
          <Image
            source={{ uri: peerMeta.icons[0] }}
            width={10}
            height={10}
            style={tw`w-10 h-10 p-1 mr-3 border border-gray-100 rounded-full`}
          />
          <View style={tw`flex-col items-start justify-start`}>
            <Text style={tw`text-sm font-bold text-gray-800 dark:text-white`}>
              {peerMeta.name}
            </Text>
            <Text style={tw`text-right text-gray-800 dark:text-white`}>
              {dayjs(session.lastAccess).fromNow()}
            </Text>
          </View>
        </View>
        <View style={tw`flex-row items-center`}>
          {!isExpanded ? (
            <ChevronDownIcon color={"gray"} size={30} />
          ) : (
            <ChevronUpIcon color={"gray"} size={30} />
          )}
        </View>
      </PressableAnimated>
      {isExpanded && (
        <View style={tw`flex-col items-start justify-center`}>
          <Text style={tw`w-full mb-3 text-lg text-blue-500`}>
            {url.hostname}
          </Text>
          <Text
            style={tw`w-full p-1 mb-3 text-center text-white bg-blue-500 rounded-lg`}
          >
            {session.peerId}
          </Text>
          <View style={tw`items-center justify-center w-full mx-auto `}>
            <PressableAnimated
              onPress={() => handleKillSesssion(session.peerId)}
              style={tw`flex flex-row justify-center p-2 bg-red-500 rounded-lg `}
            >
              <Text style={tw`text-white`}>Disconnect</Text>
            </PressableAnimated>
          </View>
        </View>
      )}
    </View>
  );
};

const SelectNetwork = ({ token }) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const Icon = CHAIN_ICONS[token];
  return (
    <>
      <TouchableOpacity
        style={tw`border-[${primaryColor}] border rounded-full h-10 w-10 flex items-center justify-center `}
        onPress={onOpen}
      >
        <Icon width={30} height={30} />
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <ScrollView style={tw`w-full`}>
            {EVM_CHAINS.map((chain) => {
              const IconChain = CHAIN_ICONS[chain];
              return (
                <ActionSheetItem
                  onPress={() => {
                    eventHub.emit(UPDATE_BACKGROUND_BRIDGE, {
                      chainId: EVM_MAINNET_CONFIG[chain]?.chainId,
                    });
                  }}
                >
                  <View style={tw`flex-row items-center`}>
                    <IconChain width={40} height={40} />
                    <Text style={tw`mx-3 font-bold`}>
                      {chain.split("_")[0]}
                    </Text>
                    {token === chain && (
                      <View style={tw`absolute right-0`}>
                        <CheckCircleIcon color={primaryColor} />
                      </View>
                    )}
                  </View>
                </ActionSheetItem>
              );
            })}
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default ManageSessions;
