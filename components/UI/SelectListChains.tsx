import {
  Actionsheet,
  KeyboardAvoidingView,
  ScrollView,
  useDisclose,
} from "native-base";

import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import ListChainSelect from "../../screens/Home/ListChainSelect";
import { tw } from "../../utils/tailwind";

export const SelectListChains = ({ token, next }) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const Icon = CHAIN_ICONS[token.network];

  return (
    <>
      <TouchableOpacity
        style={tw`border-[${primaryColor}] border rounded-full h-10 w-10 flex items-center justify-center `}
        onPress={onOpen}
      >
        <Icon width={30} height={30} />
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <Actionsheet.Content style={tw``}>
            <Text
              style={tw`text-center dark:text-white font-bold text-xl py-2`}
            >
              Networks
            </Text>
            <ScrollView>
              <ListChainSelect next={next} caching />
            </ScrollView>
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet>
    </>
  );
};
