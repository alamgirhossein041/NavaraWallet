import Clipboard from '@react-native-clipboard/clipboard';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {primaryColor} from '../configs/theme';
import useSeedPhraseService from '../hooks/useSeedPhrase';
import ScanQR from '../screens/SendToken/ScanQR';
import {tw} from '../utils/tailwind';
import Button from './Button';
import CheckBox from './CheckBox';
import TextField from './TextField';

const ImportSeedPhrase = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const {isValidMnemonic} = require('@ethersproject/hdnode');
  const seedPhraseService = useSeedPhraseService();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={tw`px-4`}>
          {/* <ScanQR onValueScaned={handleResultQrScan} /> */}
        </View>
      ),
    });
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      seedPhrase: '',
    },
  });

  const handleResultQrScan = (input: string) => {
    setValue('seedPhrase', input);
  };

  const onSubmit = async data => {
    const checkSeedPhraseDuplicate = await seedPhraseService.isDuplicate(
      data.seedPhrase,
    );

    if (checkSeedPhraseDuplicate) {
      Alert.alert('Your seed phrase was already existing');
    } else {
      navigation.navigate('CreateWallet', {
        seedPhrase: data.seedPhrase,
      });
    }
  };

  const [confirmStep, setConfirmStep] = useState({
    theFirst: false,
    theSecond: false,
    theThird: false,
  });
  const handleConfirm = value => {
    setConfirmStep({...confirmStep, [value]: !confirmStep[value]});
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setValue('seedPhrase', text);
  };
  //
  return (
    <View style={tw`relative flex flex-col h-full android:my-3 ios:my-3`}>
      <ScrollView scrollEnabled={false}>
        <Text style={tw`text-2xl font-bold text-center`}>
          Import your wallet
        </Text>
        <Text style={tw`text-sm text-center font-regular`}>
          entering your 12 or 24 words seed phrase
        </Text>
        <View style={tw`flex flex-col `}>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: {
                checkMnemonic: v => isValidMnemonic(v) || 'Invalid Mnemonic',
                spaceWhite: value => {
                  return !!value.trim() || value.match(/^ *$/);
                },
              },
            }}
            render={({field: {onChange, value}}) => (
              <TextField
                multiline
                style={tw`h-35`}
                styleText={`text-[${primaryColor}]`}
                type="text"
                value={value.toLowerCase().replace(/\s+/g, ' ')}
                onChangeText={onChange}
                label="Secret phrase"
                err={!!errors.seedPhrase}
              />
            )}
            name="seedPhrase"
          />
        </View>
        {Object.keys(errors).length !== 0 && (
          <>
            {errors.seedPhrase && errors.seedPhrase.type === 'required' && (
              <Text style={tw`text-center text-red-500 `}>
                Seed phrase is required
              </Text>
            )}
            {errors.seedPhrase && errors.seedPhrase.type === 'spaceWhite' && (
              <Text style={tw`text-center text-red-500 `}>
                Seed phrase no whitespace
              </Text>
            )}
            {errors.seedPhrase &&
              errors.seedPhrase.type === 'checkMnemonic' && (
                <Text style={tw`text-center text-red-500 `}>
                  Invalid Seed phrase
                </Text>
              )}
          </>
        )}
        <View style={tw`flex-row items-center justify-end my-1`}>
          <TouchableOpacity style={tw`mx-3`} onPress={fetchCopiedText}>
            <Text style={tw`font-bold text-black uppercase`}>Paste</Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-col `}>
          <View style={tw`mx-auto`}>
            <ScanQR onValueScaned={handleResultQrScan} />
          </View>

          <Text style={tw`text-center py-2`}>
            or scan with QR code from other wallets
          </Text>
        </View>

        <View style={tw`flex flex-col items-center justify-between mb-5`}>
          <CheckBox
            check={confirmStep.theFirst}
            onPress={() => {
              handleConfirm('theFirst');
            }}
            label="I understand that if I lose or reveal my secret phrase, my cryptocurrency will be lost forever"
          />
          <CheckBox
            check={confirmStep.theSecond}
            onPress={() => {
              handleConfirm('theSecond');
            }}
            label="I understand that I am solely responsible for ensuring the safety and confidentiality of my secret phrase"
          />
          <CheckBox
            check={confirmStep.theThird}
            onPress={() => {
              handleConfirm('theThird');
            }}
            label="I agree with Navara's security & privacy policy"
          />
        </View>
      </ScrollView>

      <View style={tw`absolute w-full mb-5 bottom-5`}>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={
            !confirmStep.theFirst ||
            !confirmStep.theSecond ||
            !confirmStep.theThird
          }>
          Continue
        </Button>
      </View>
    </View>
  );
};

export default ImportSeedPhrase;
