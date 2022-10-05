import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { tw } from '../../utils/tailwind';
import Button from '../../components/Button';
import { bgGray } from '../../configs/theme';
import { generateMnemonics } from '../../utils/mnemonic';
import { IWallet } from '../../data/types';
import { v4 as uuidv4 } from 'uuid';
import toastr from '../../utils/toastr';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { Controller, useForm } from 'react-hook-form';
import InputIcon from '../../components/InputIcon';
const WalletName = ({ navigation }) => {
  // const [walletName, setWalletName] = useState('');
  // const arraySeedPhrase = generateMnemonics().split(' ');
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      walletName: '',
      arraySeedPhrase: generateMnemonics().split(' '),
    },
  });
  const createNewNameWallet = data => {
    try {
      const newWallet: IWallet = {
        label: data.walletName,
        value: data.walletName,
        isSelected: true,
        seedPhrase: data.arraySeedPhrase,
        createdAt: new Date(),
      };
      navigation.navigate('PassPhraseNew', newWallet);
    } catch (error) {
      toastr.error("Error");
    }
  };
       //background Darkmode
       const modeColor = useDarkMode();
       //text darkmode
       const textColor = useTextDarkMode();
       //grid, shadow darkmode
       const gridColor = useGridDarkMode();
  return (
    <View style={tw`p-5 android:pt-2 ${modeColor} h-full`}>
      {/* <HeaderScreen title="Wallet name" showBack /> */}
      {/* <Text style={tw`mt-5 text-4xl text-black dark:text-white `}>Wallet name</Text> */}
      <Text style={tw`text-lg ${textColor} `}>
        Please choose a display name for your wallet
      </Text>
      <Controller
          control={control}
          rules={{
            required: true,
            validate: value => {
              return !!value.trim();
            },
          }}
          render={({field: {onChange, value}}) => (
            <InputIcon
              style="my-5 "
              styleText="text-[#11CABE]"
              type="text"
              value={value}
              onChangeText={onChange}
              title="Please choose a display name for your wallet : "
              placeholder="Enter your name wallet"
            />
          )}
          name="walletName"
        />
      {Object.keys(errors).length !== 0 && (
          <>
            {errors.walletName.type === 'required' && (
              <Text style={tw`text-center text-red-500 my-5 `}>
                Wallet Name required.
              </Text>
            )}
            {errors.walletName.type === 'validate' && (
              <Text style={tw`text-center text-red-500 my-5`}>
                Wallet name no whitespaces
              </Text>
            )}
          </>
        )}
      <Text style={tw`leading-8 ${textColor}`}>
        You can use Domain as an ID for your wallet
      </Text>
      <Text style={tw`leading-8 ${textColor}`}>
        This is an easy way to remember your wallet address. Anyone can use this
        Domain to send tokens to you. For example: yourwalletid.dnet
      </Text>
      <Text style={tw`leading-8 ${textColor}`}>
        Sub-domains will be created on each chain based on this wallet ID. For
        example, on Near, your address will be like: near.yourwalletid.dnet
      </Text>
      {/* <View style={tw` mt-auto bg-[#11CABE] p-3 rounded-full`}>
        <Button
          title="Continue"
          color="white"
          onPress={() => linkTo("/ChooseNetwork")}
        />
      </View> */}
      <View style={tw`mt-auto flex items-center w-full px-4`}>
        <Button onPress={handleSubmit(createNewNameWallet)} >
          <Text style={tw`text-center text-base font-medium text-white`}>
            Continue
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default WalletName;
