import { isValidMnemonic } from "@ethersproject/hdnode";
import Clipboard from "@react-native-clipboard/clipboard";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import usePopupResult from "../../hooks/usePopupResult";
import useSeedPhraseService from "../../hooks/useSeedPhrase";
import ScanQR from "../../screens/SendToken/ScanQR";
import { normalizeSeedPhrase } from "../../utils/mnemonic";
import { tw } from "../../utils/tailwind";
import Button from "./Button";
import CheckBox from "./CheckBox";
import TextField from "./TextField";
const ImportSeedPhrase = ({ navigation, route }) => {
  const seedPhraseService = useSeedPhraseService();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      seedPhrase: "",
    },
  });

  const handleResultQrScan = (input: string) => {
    setValue("seedPhrase", input);
  };
  const [isLoading, setIsLoading] = useState(false);
  const popupResult = usePopupResult();
  const onSubmit = async (data) => {
    setIsLoading(true);
    const checkSeedPhraseDuplicate = await seedPhraseService.isDuplicate(
      normalizeSeedPhrase(data.seedPhrase)
    );

    if (checkSeedPhraseDuplicate) {
      // Alert.alert("Your seed phrase was already existing");
      popupResult({
        isOpen: true,
        title: "Your seed phrase was already existing",
        type: "error",
      });
    } else {
      navigation.navigate("CreateWallet", {
        seedPhrase: normalizeSeedPhrase(data.seedPhrase),
      });
    }
    setIsLoading(false);
  };

  const [confirmStep, setConfirmStep] = useState({
    theFirst: false,
    theSecond: false,
    theThird: false,
  });
  const handleConfirm = (value) => {
    setConfirmStep({ ...confirmStep, [value]: !confirmStep[value] });
  };
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setValue("seedPhrase", text);
  };
  //
  const { t } = useTranslation();
  return (
    <View style={tw`relative flex flex-col h-full android:my-3 ios:my-3`}>
      <ScrollView scrollEnabled={false}>
        <Text style={tw`text-2xl font-bold text-center dark:text-white`}>
          {t("import_seedphrase.import_your_wallet")}
        </Text>
        <Text style={tw`text-sm text-center dark:text-white font-regular`}>
          {t("import_seedphrase.description_import_your_wallet")}
        </Text>
        <View style={tw`flex flex-col mt-10`}>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: {
                checkMnemonic: (v) =>
                  isValidMnemonic(v) ||
                  `{${t("import_seedphrase.invalid_mnemonic")}}`,
                spaceWhite: (value) => {
                  return !!value.trim() || value.match(/^ *$/);
                },
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                autoFocus
                style={tw`ios:h-20 dark:text-white `}
                type="text"
                value={value}
                onChangeText={onChange}
                label={t("import_seedphrase.seedphrase")}
                err={!!errors.seedPhrase}
                multiline
                numberOfLines={4}
              />
            )}
            name="seedPhrase"
          />
        </View>
        {Object.keys(errors).length !== 0 && (
          <>
            {errors.seedPhrase && errors.seedPhrase.type === "required" && (
              <Text style={tw`text-center text-red-500 dark:text-white `}>
                {t("import_seedphrase.seedphrase_is_required")}
              </Text>
            )}
            {errors.seedPhrase && errors.seedPhrase.type === "spaceWhite" && (
              <Text style={tw`text-center text-red-500 dark:text-white `}>
                {t("import_seedphrase.seedphrase_no_whitespace")}
              </Text>
            )}
            {errors.seedPhrase &&
              errors.seedPhrase.type === "checkMnemonic" && (
                <Text style={tw`text-center text-red-500 dark:text-white `}>
                  {t("import_seedphrase.invalid_seedphrase")}
                </Text>
              )}
          </>
        )}
        <View style={tw`flex-row items-center justify-end my-1`}>
          <TouchableOpacity style={tw`mx-3`} onPress={fetchCopiedText}>
            <Text style={tw`font-bold uppercase dark:text-white`}>
              {t("import_seedphrase.paste")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-col `}>
          <View style={tw`mx-auto`}>
            <ScanQR onValueScanned={handleResultQrScan} />
          </View>

          <Text style={tw`py-2 text-center dark:text-white`}>
            {t("import_seedphrase.description_seed_phrase")}
          </Text>
        </View>

        <View style={tw`flex flex-col items-center justify-between mb-5`}>
          <CheckBox
            check={confirmStep.theFirst}
            onPress={() => {
              handleConfirm("theFirst");
            }}
            label={t("import_seedphrase.label_first")}
          />
          <CheckBox
            check={confirmStep.theSecond}
            onPress={() => {
              handleConfirm("theSecond");
            }}
            label={t("import_seedphrase.label_second")}
          />
          <CheckBox
            check={confirmStep.theThird}
            onPress={() => {
              handleConfirm("theThird");
            }}
            label={t("import_seedphrase.label_third")}
          />
        </View>
      </ScrollView>

      <View style={tw`absolute w-full mb-5 bottom-5`}>
        <Button
          loading={isLoading}
          hideOnKeyboard
          onPress={handleSubmit(onSubmit)}
          disabled={
            !confirmStep.theFirst ||
            !confirmStep.theSecond ||
            !confirmStep.theThird
          }
        >
          {t("import_seedphrase.continue")}
        </Button>
      </View>
    </View>
  );
};

export default ImportSeedPhrase;
