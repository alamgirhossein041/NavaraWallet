import { ScrollView, Text, View } from "react-native";
import { tw } from "../../utils/tailwind";
import InputIcon from "../../components/InputIcon";
import IconCheckOk from "../../assets/icons/icon-check-ok.svg";
import Button from "../../components/Button";
import { generateMnemonics } from "../../utils/mnemonic";
import { bgGray } from "../../configs/theme";
import { IWallet } from "../../data/types";
import React from "react"
import { useDarkMode } from "../../hooks/useDarkMode";
import toastr from "../../utils/toastr";
const NextStepWalletID = ({ navigation, route }) => {
  // get param from screen WalletID
  const { walletName } = route.params;
  const arraySeedPhrase = generateMnemonics().split(" ");
  const handleToPassPhrase = () => {
    try {
      const payload: IWallet = {
        label: walletName,
        value: walletName,
        isSelected: true,
        seedPhrase: arraySeedPhrase,
        createdAt: new Date(),
      };
      navigation.replace("PassPhrase", payload);
    } catch (error) {
      toastr.error("Error");
    }
  };
  const modeColor = useDarkMode()
  return (
    <ScrollView style={tw` ${modeColor} `}>
      <View
        style={tw`p-5 android:pt-2 ${modeColor} h-full py-[10%]`}
      >
        {/* <HeaderScreen title="Wallet ID" showBack /> */}
        {/* <Text style={tw`text-4xl text-black dark:text-white py-10`}>
          Wallet ID
        </Text> */}

        <Text style={tw`leading-6 text-[#8E8E93] font-bold`}>
          Please choose a name for your wallet ID
        </Text>
        <Text style={tw`leading-8 text-[#8E8E93]`}>
          An easy-to-remember address (resolved address) will be created on each
          chain based on this wallet ID.
        </Text>
        <Text style={tw`leading-8 text-[#8E8E93]`}>
          For example, on Near, your resolved address will be:
          near.yourwalletid.dnet
        </Text>

        <InputIcon
          style="my-3"
          styleText="text-[#11CABE]"
          type="text"
          placeholder="Enter your name wallet"
          icon={<IconCheckOk />}
          value={walletName}
        />
        <Text style={tw`pl-10 text-[#11CABE]`}>
          This wallet ID is available
        </Text>

        <View style={tw`mt-auto flex items-center p-3  px-4`}>
          <Button
            stringStyle="text-center text-base font-medium text-white"
            onPress={handleToPassPhrase}
          >
            Continue
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default NextStepWalletID;
