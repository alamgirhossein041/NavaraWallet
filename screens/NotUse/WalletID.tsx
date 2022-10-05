import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { tw } from '../../utils/tailwind';
import InputIcon from '../../components/InputIcon';
import Button from '../../components/Button';
import { bgGray } from '../../configs/theme';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { useForm, Controller } from 'react-hook-form';
import { IWallet } from '../../data/types';
import { generateMnemonics } from '../../utils/mnemonic';
import toastr from '../../utils/toastr';
const WalletID = ({ navigation }) => {
  // const [walletName, setWalletName] = useState('');
  // const arraySeedPhrase = generateMnemonics().split(' ');
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      walletName: '',
      arraySeedPhrase: generateMnemonics().split(' '),
    },
  });
  const onSubmit = data => {
    // pass param walletName to next screen
    try {
      const payload: IWallet = {
        label: data.walletName,
        value: data.walletName,
        isSelected: true,
        seedPhrase: data.arraySeedPhrase,
        createdAt: new Date(),
      };
      // setValue("walletName",data.walletName)
      navigation.navigate('PassPhrase', payload);
    } catch (error) {
      toastr.error(error);
    }
  };

  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full px-4 flex flex-col justify-between  ${modeColor} py-2`}>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
            validate: value => {
              return !!value.trim();
            },
          }}
          render={({ field: { onChange, value } }) => (
            <InputIcon
              style=""
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
              <Text style={tw`text-center text-red-500 `}>
                Wallet Name required.
              </Text>
            )}
            {errors.walletName.type === 'validate' && (
              <Text style={tw`text-center text-red-500 `}>
                Wallet name no whitespaces
              </Text>
            )}
          </>
        )}

        <Text style={tw`leading-6 ${textColor} font-bold`}>
          You can use Domain as an ID for your wallet
        </Text>
        <Text style={tw`leading-6 ${textColor}`}>
          This is an easy way to remember your wallet address. Anyone can use
          this Domain to send tokens to you. For example: yourwalletid.dnet
        </Text>
        <Text style={tw`leading-6 ${textColor}`}>
          Sub-domains will be created on each chain based on this wallet ID. For
          example, on Near, your address will be like: near.yourwalletid.dnet
        </Text>
      </View>

      <View style={tw`  items-center w-full mb-3`}>
        <Button
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </View>
    </View>
  );
};

export default WalletID;
