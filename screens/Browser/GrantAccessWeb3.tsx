import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DocumentDuplicateIcon } from "react-native-heroicons/outline";
import { LockClosedIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import { primaryColor } from "../../configs/theme";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import getAvatar from "../../utils/getAvatar";
import getDomainFromUrl from "../../utils/getDomainFromUrl";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

interface IGrantAccessWeb3Props {
  url: string;
}

export default function GrantAccessWeb3(props: IGrantAccessWeb3Props) {
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
          Grant access to your USDT
        </Text>

        <Text style={tw`mb-5 text-center dark:text-white`}>
          By granting permission, you are giving the following contract access
          to your funds.
        </Text>

        <View style={tw`flex-row items-center mb-5`}>
          <Text>Contract:</Text>
          <TouchableOpacity
            style={tw`flex-row items-center p-1 mx-1 bg-blue-100 rounded-full`}
          >
            <Image
              style={tw`w-4 h-4 rounded-full`}
              source={{
                uri: getAvatar(walletSelected.index),
              }}
            />
            <View>
              <Text style={tw`mx-1 text-sm dark:text-white`}>{ethAddress}</Text>
            </View>
            <DocumentDuplicateIcon color={primaryColor} />
          </TouchableOpacity>
        </View>
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
              ({ethAddress})
            </Text>
          </View>
        </View>
        <View
          style={tw`flex-col w-full p-3 mb-3 border border-gray-300 rounded-lg`}
        >
          <View style={tw`flex-row justify-between w-full mb-2`}>
            <Text style={tw`font-bold dark:text-white`}>Gas fee estimate</Text>
            <Text style={tw`font-bold text-blue-500 dark:text-white`}>
              0,58$
            </Text>
          </View>
          <View style={tw`flex-row justify-between w-full`}>
            <Text style={tw`font-bold dark:text-white`}></Text>
            <View style={tw`flex-row`}>
              <Text style={tw`font-bold dark:text-white`}>Max fee: </Text>
              <Text style={tw`dark:text-white `}>0.0000496ETH</Text>
            </View>
          </View>
        </View>
        {true && (
          <View
            style={tw`w-full p-1 mb-5 text-center bg-red-100 border border-red-700 rounded-lg`}
          >
            <Text style={tw`text-center dark:text-white`}>
              You need an additional 0.0007 ETH to complete this transaction
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined">Cancel</Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary">Approve</Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
