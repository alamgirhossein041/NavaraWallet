import Clipboard from '@react-native-clipboard/clipboard';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  EyeIcon,
  EyeOffIcon,
  ShieldExclamationIcon,
} from 'react-native-heroicons/solid';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import CheckBox from '../../../components/CheckBox';
import SignPinCode from '../../../components/SignPinCode';
import ViewSeedPhrase from '../../../components/ViewSeedPhrase';
import {bgTab, primaryColor} from '../../../configs/theme';
import {useDarkMode} from '../../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../../hooks/useModeDarkMode';
import {tw} from '../../../utils/tailwind';
import toastr from '../../../utils/toastr';
import ScanQR from '../../SendToken/ScanQR';
import QRCode from 'react-qr-code';
import IconSeedPhraseWallet from '../../../assets/icons/icon-wallet-seedphrase.svg';
import {ClipboardCopyIcon} from 'react-native-heroicons/outline';
import {
  decryptAESWithKeychain,
  encryptAESWithKeychain,
} from '../../../utils/keychain';
const PrivacySeedPhrase = ({route, navigation}) => {
  const mnemonicWallet = route.params;
  const [seedPhraseDecrypt, setSeedPhraseDecrypt] = useState('');

  useEffect(() => {
    (async function () {
      try {
        const response = await decryptAESWithKeychain(mnemonicWallet);
        setSeedPhraseDecrypt(response);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const fetchMyAPI = useCallback(async () => {
    let response = await decryptAESWithKeychain(mnemonicWallet);
  }, [route.params]);

  const [confirmStep, setConfirmStep] = useState({
    theFirst: false,
    theSecond: false,
    theThird: false,
  });
  const handleConfirm = value => {
    setConfirmStep({...confirmStep, [value]: !confirmStep[value]});
  };
  //

  const [isDisplay, setIsDisplay] = useState(false);
  navigation.setOptions({
    title: 'Secret Seed Phrase',
  });
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const FirstStep = () => {
    return (
      <ScrollView style={tw`${modeColor}`}>
        <View
          style={tw`android:py-1 ios:py-3 h-full px-4 flex flex-col justify-between `}>
          <View>
            <Text style={tw`text-justify text-center ${textColor}`}>
              Next step, you will see the secret phrase (12 words) that will
              help you to recover your wallet
            </Text>
          </View>
          <View style={tw`mx-auto`}>
            <IconSeedPhraseWallet />
          </View>

          <View style={tw`flex flex-col items-center justify-between `}>
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
              label="I understand that if I disclose or share my secret phrase, my cryptocurrency may be stolen
              "
            />
            <CheckBox
              check={confirmStep.theThird}
              onPress={() => {
                handleConfirm('theThird');
              }}
              label="I understand that I am solely responsible for ensuring the safety and confidentiality of my secret phrase
              "
            />
          </View>
          <View style={tw`w-full mt-10`}>
            <Button
              disabled={
                !confirmStep.theFirst ||
                !confirmStep.theSecond ||
                !confirmStep.theThird
              }
              onPress={() => setSelectedStep(1)}>
              Continue
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  };
  const SecondStep = () => {
    const copyToClipboard = () => {
      Clipboard.setString(seedPhraseDecrypt);
      toastr.success('Copied');
    };
    const ScanQRMnemocnic = () => {
      setIsDisplay(!isDisplay);
    };
    return (
      <ScrollView
        style={tw`android:py-1 ios:py-3 px-4 flex flex-col ${modeColor} `}>
        <View>
          <Text style={tw`text-justify text-center ${textColor}`}>
            Write down or copy these words in the correct order and save them in
            a safe place
          </Text>
        </View>
        <View style={tw`flex flex-row flex-wrap items-center`}>
          {seedPhraseDecrypt.split(' ').map((item, index) => {
            const numberText = index < 9 ? `0${index + 1}` : `${index + 1}`;
            return (
              <View
                activeOpacity={0.6}
                key={index}
                style={tw`flex flex-row items-center p-2 py-2 mx-auto my-2 bg-gray-100 rounded-full shadow-sm w-26`}>
                <View
                  style={tw`w-6 h-6 rounded-full flex justify-center items-center bg-[${primaryColor}]  mr-auto `}>
                  <Text style={tw`font-bold text-white `}>{numberText}</Text>
                </View>
                <Text style={tw`mr-auto`}>{item}</Text>
              </View>
            );
          })}
        </View>
        {/* <ViewSeedPhrase seedPhrase={mnemonicWallet.split("")} /> */}
        <View style={tw`flex flex-row mx-auto my-3`}>
          <View style={tw`mx-1`}>
            <Button
              variant="secondary"
              style={tw`rounded-full w-20 bg-[${primaryColor}] mr-2 my-2`}
              onPress={copyToClipboard}>
              <Text style={tw``}>Copy</Text>
            </Button>
          </View>
          <Button variant="secondary" onPress={ScanQRMnemocnic}>
            <Text>{!isDisplay ? <>Show QR</> : <>Hide QR</>}</Text>
          </Button>
        </View>
        {isDisplay && mnemonicWallet ? (
          <View style={tw`mx-auto p-2 ${gridColor}`}>
            <QRCode value={mnemonicWallet} size={150} />
          </View>
        ) : (
          <></>
        )}
        <View style={tw`rounded-lg bg-red-100 p-2`}>
          <Text
            style={tw`uppercase text-center text-[15px] px-4 font-bold text-red-600`}>
            Do not reveal 12 words from your wallet backup! Keep them safe and
            secret
          </Text>
          <Text style={tw`text-center px-4 text-red-500 py-2`}>
            If someone has a 12-word phrase backing up your wallet, they will
            have full control of your wallet
          </Text>
        </View>
        <View style={tw`my-4`}>
          <Button onPress={() => navigation.popToTop()}>Done</Button>
        </View>
      </ScrollView>
    );
  };
  const Stack = createNativeStackNavigator();

  const [selectedStep, setSelectedStep] = useState(0);
  return (
    <View style={tw`bg-white h-full`}>
      <SignPinCode />
      {selectedStep === 0 && <FirstStep />}
      {selectedStep === 1 && <SecondStep />}
    </View>
  );
};

export default PrivacySeedPhrase;
