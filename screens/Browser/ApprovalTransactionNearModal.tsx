import { Actionsheet, useDisclose } from "native-base";
import React from "react";
import { Text, View } from "react-native";
import { GlobeAltIcon } from "react-native-heroicons/solid";
import Button from "../../components/UI/Button";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

export default function ApproveTransactionNearModal() {
  const { onOpen, onClose, isOpen } = useDisclose();
  return (
    <Actionsheet isOpen={onOpen} onClose={onClose}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Text style={tw`mb-3 text-lg font-bold text-black dark:text-white`}>
          Approve Trasaction
        </Text>
        <View
          style={tw`flex-row items-center p-2 mb-5 bg-blue-100 border border-blue-200 rounded-full`}
        >
          <GlobeAltIcon color={primaryColor} />
          <Text style={tw`text-[${primaryColor}]`}>manhnv_nft_surge.sh</Text>
        </View>
        <View>
          <Text style={tw`text-2xl font-bold text-black dark:text-white`}>
            0.45305 NEAR
          </Text>
          <Text style={tw`mb-5 text-center text-gray-500`}>$1.17</Text>
        </View>
        <View
          style={tw`flex-row items-center justify-between w-full px-3 py-5 border-t border-b border-gray-200`}
        >
          <Text style={tw`text-gray-500`}>From</Text>
          <View>
            <Text style={tw`font-bold text-right text-black dark:text-white`}>
              navara.testnet
            </Text>
            <Text style={tw`font-bold text-right gray`}>199.92742 NEAR</Text>
          </View>
        </View>
        <View
          style={tw`flex-row items-center justify-between w-full px-3 py-5 mb-5 border-t border-b border-gray-200`}
        >
          <Text style={tw`text-gray-500`}>Estimated fees</Text>
          <View>
            <Text style={tw`font-bold text-right text-black dark:text-white`}>
              {"< 0.000001 NEAR"}
            </Text>
            <Text style={tw`font-bold text-right gray`}>{"< $0.01 USD"}</Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined" onPress={() => {}}>
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary" onPress={() => {}}>
              Approval
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
