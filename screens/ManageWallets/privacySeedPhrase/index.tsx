import Clipboard from "@react-native-clipboard/clipboard";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import QRCode from "react-qr-code";
import IconSeedPhraseWallet from "../../../assets/icons/icon-wallet-seedphrase.svg";
import Button from "../../../components/UI/Button";
import CheckBox from "../../../components/UI/CheckBox";
import SignPinCode from "../../../components/UI/SignPinCode";
import { primaryColor } from "../../../configs/theme";
import { decryptAESWithKeychain } from "../../../utils/keychain";
import { tw } from "../../../utils/tailwind";
import toastr from "../../../utils/toastr";
const PrivacySeedPhrase = ({ route, navigation }) => {
  const mnemonicWallet = route.params;
  const [seedPhraseDecrypt, setSeedPhraseDecrypt] = useState("");

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
  const handleConfirm = (value) => {
    setConfirmStep({ ...confirmStep, [value]: !confirmStep[value] });
  };
  //
  const { t } = useTranslation();
  const [isDisplay, setIsDisplay] = useState(false);
  navigation.setOptions({
    title: `${t("import_seedphrase.secret_seed_phrase")}`,
  });

  const FirstStep = () => {
    return (
      <ScrollView style={tw``}>
        <View
          style={tw`android:py-1 ios:py-3 h-full px-4 flex flex-col justify-between `}
        >
          <View>
            <Text style={tw`dark:text-white  text-center `}>
              {t("import_seedphrase.description_secret_seedphrase")}
            </Text>
          </View>
          <View style={tw`mx-auto`}>
            <IconSeedPhraseWallet />
          </View>

          <View style={tw`flex flex-col items-center justify-between `}>
            <CheckBox
              check={confirmStep.theFirst}
              onPress={() => {
                handleConfirm("theFirst");
              }}
              label={t("import_seedphrase.label_secret_seedphrase_first")}
            />
            <CheckBox
              check={confirmStep.theSecond}
              onPress={() => {
                handleConfirm("theSecond");
              }}
              label={t("import_seedphrase.label_secret_seedphrase_second")}
            />
            <CheckBox
              check={confirmStep.theThird}
              onPress={() => {
                handleConfirm("theThird");
              }}
              label={t("import_seedphrase.label_secret_seedphrase_third")}
            />
          </View>
          <View style={tw`w-full mt-10`}>
            <Button
              disabled={
                !confirmStep.theFirst ||
                !confirmStep.theSecond ||
                !confirmStep.theThird
              }
              onPress={() => setSelectedStep(1)}
            >
              {t("import_seedphrase.continue")}
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  };
  const SecondStep = () => {
    const copyToClipboard = () => {
      Clipboard.setString(seedPhraseDecrypt);
      toastr.success("Copied");
    };
    const ScanQRMnemocnic = () => {
      setIsDisplay(!isDisplay);
    };
    return (
      <ScrollView style={tw`android:py-1 ios:py-3 px-4 flex flex-col  `}>
        <View>
          <Text style={tw`dark:text-white  text-justify text-center `}>
            Write down or copy these words in the correct order and save them in
            a safe place
          </Text>
        </View>
        <View style={tw`flex flex-row flex-wrap items-center`}>
          {seedPhraseDecrypt.split(" ").map((item, index) => {
            const numberText = index < 9 ? `0${index + 1}` : `${index + 1}`;
            return (
              <View
                activeOpacity={0.6}
                key={index}
                style={tw`flex flex-row items-center p-2 py-2 mx-auto my-2 dark:bg-gray-800 bg-gray-100  rounded-full shadow-sm w-26`}
              >
                <View
                  style={tw`w-6 h-6 rounded-full flex justify-center items-center bg-[${primaryColor}]  mr-auto `}
                >
                  <Text style={tw`dark:text-white  font-bold text-white `}>
                    {numberText}
                  </Text>
                </View>
                <Text style={tw`dark:text-white  mr-auto`}>{item}</Text>
              </View>
            );
          })}
        </View>
        {/* <ViewSeedPhrase seedPhrase={mnemonicWallet.split("")} /> */}
        <View style={tw`flex flex-row mx-auto my-3`}>
          <View style={tw`mx-1`}>
            <Button
              variant="secondary"
              style={tw`rounded-full w-20 mr-2 my-2`}
              onPress={copyToClipboard}
            >
              <Text>Copy</Text>
            </Button>
          </View>
          <Button variant="secondary" onPress={ScanQRMnemocnic}>
            <Text>{!isDisplay ? <>Show QR</> : <>Hide QR</>}</Text>
          </Button>
        </View>
        {isDisplay && mnemonicWallet ? (
          <View style={tw`mx-auto p-2 bg-white mb-3 `}>
            <QRCode value={seedPhraseDecrypt} size={150} />
          </View>
        ) : (
          <></>
        )}
        <View style={tw`rounded-lg bg-red-100 p-2`}>
          <Text
            style={tw`uppercase text-center text-[15px] px-4 font-bold text-red-600`}
          >
            Do not reveal 12 words from your wallet backup! Keep them safe and
            secret
          </Text>
          <Text style={tw`  text-center px-4 text-red-500 py-2`}>
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
  const [selectedStep, setSelectedStep] = useState(0);
  return (
    <View style={tw`bg-white dark:bg-[#18191A]  h-full`}>
      <SignPinCode />
      {selectedStep === 0 && <FirstStep />}
      {selectedStep === 1 && <SecondStep />}
    </View>
  );
};

export default PrivacySeedPhrase;
