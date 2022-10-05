import { View } from "react-native";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import InputIcon from "../../components/InputIcon";
import TabCustom from "../../components/TabProfile";
import { tw } from "../../utils/tailwind";
import IconScanSeedPhrase from "../../assets/icons/icon-scan-seedphrase.svg";
import InputText from "../../components/InputText";
import { primaryGray } from "../../configs/theme";
import ImportByPhrase from "./ImportByPhrase";
import ImportByPrivateKey from "./ImportByPrivateKey";
import { Stack } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const ImportWallet = ({navigation}) => {
  const [tabSelected, setTabselected] = useState(0);
  const Stack = createNativeStackNavigator();
  return (
    <View>
      <ScrollView style={tw``}>
        <View style={tw`h-2/5 bg-[#11CABE] flex`}>
          <Button stringStyle="bg-white py-1 px-5 rounded-full text-[#11CABE] ml-auto">
            Import
          </Button>
          <Text style={tw`p-3 text-4xl text-white`}>
            Import your{"\n"}Ethereum wallet
          </Text>
        </View>
        <View
          style={tw`h-3/5 bg-white h-full relative mx-3 rounded-2xl top-[-12] shadow-lg`}
        >
          <TabCustom
            tabs={["Phrase", "Private key"]}
            tabSelected={tabSelected}
            onChange={(value) => {
              setTabselected(value);
            }}
          />
          {tabSelected == 0 && <ImportByPhrase />}
          {tabSelected == 1 && <ImportByPrivateKey />}
        </View>
      </ScrollView>
    </View>
  );
};

export default ImportWallet;
