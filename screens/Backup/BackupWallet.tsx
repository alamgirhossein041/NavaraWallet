import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { cloneDeep } from "lodash";
import { Switch } from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import base64 from "react-native-base64";
import { useRecoilState } from "recoil";
import Button from "../../components/UI/Button";
import TextField from "../../components/UI/TextField";
import { Regex } from "../../configs/defaultValue";
import { primaryColor, primaryGray } from "../../configs/theme";
import useDatabase from "../../data/database/useDatabase";
import { listWalletsState } from "../../data/globalState/listWallets";
import { IBackupData, IFileData } from "../../data/types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import usePopupResult from "../../hooks/usePopupResult";
import { googleDriveStoreFile } from "../../module/googleApi/GoogleDrive";
import {
  decryptAESWithKeychain,
  encryptAESWithKeychain,
} from "../../utils/keychain";
import { GOOGLE_ACCESS_TOKEN } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";

type nameType = "password" | "rePassword" | "fileName" | "passwordHint";

const BackupWallet = ({ navigation, route }) => {
  const [storedAccessToken, setStorageAccessToken] =
    useLocalStorage(GOOGLE_ACCESS_TOKEN);
  const [accessToken, setAccessToken] = useState("");
  const [isAppPassword, setIsAppPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const popupResult = usePopupResult();
  const { walletController } = useDatabase();
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fileName: "",
      password: "",
      rePassword: "",
      passwordHint: "",
    },
  });
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const indexSelected = route.params.indexSelected as number;
  const seedPhrase = listWallets[indexSelected]?.seedPhrase;

  const resetValue = (value?: string) => {
    if (value === "password") {
      setValue("password", "");
      setValue("rePassword", "");
    }
    setValue("fileName", "");
    setValue("password", "");
    setValue("rePassword", "");
    setValue("passwordHint", "");
  };

  const handleError = () => {
    const { fileName, password, rePassword } = getValues();
    if (fileName.length === 0) {
      return "Please enter file name";
    }
    if (isAppPassword) {
      return "";
    }
    if (password.length === 0) {
      return "Please enter password";
    }
    if (rePassword.length === 0) {
      return "Please enter confirm password";
    }

    if (password !== rePassword) {
      resetValue("password");
      return "Password does not match";
    }

    if (!password.match(Regex.password)) {
      resetValue("password");
      return "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character(@$!%*#?&$)";
    }
    return "";
  };

  const getData = async (password: string) => {
    if (isAppPassword) {
      return seedPhrase;
    } else {
      const decryptedSeedPhrase = await decryptAESWithKeychain(seedPhrase);
      const encryptedSeedPhrase = await encryptAESWithKeychain(
        decryptedSeedPhrase,
        password
      );
      return encryptedSeedPhrase;
    }
  };

  const handleOnPress = async () => {
    const error = handleError();
    if (error.length > 0) {
      toastr.error(error, { duration: 3000 });
      return;
    }
    const { fileName, password, passwordHint } = getValues();

    setLoading(true);
    if (accessToken) {
      const data = await getData(password);
      const filenameData: IFileData = {
        fileName: fileName,
        date: new Date().toISOString(),
      };
      const fileData: IBackupData = {
        data: data,
        hint: passwordHint,
      };
      const encodedFileName = base64.encode(JSON.stringify(filenameData));
      const encodedFileData = base64.encode(JSON.stringify(fileData));
      const result = await googleDriveStoreFile(
        accessToken,
        encodedFileName,
        encodedFileData
      );
      if (result.status === "success") {
        setLoading(false);
        await updateWallet();
        await GoogleSignin.signOut();
        navigation.goBack();
        popupResult({
          title: "Backup Successfully",
          isOpen: true,
          type: "success",
        });
      } else {
        setLoading(false);
        popupResult({
          title: "Backup Error",
          isOpen: true,
          type: "error",
        });
      }
      await GoogleSignin.signOut();
      setStorageAccessToken("");
      navigation.goBack();
    } else {
      GoogleSignin.signOut();
      navigation.goBack();
      return toastr.error("Login error", { duration: 3000 });
    }
    setLoading(false);
    resetValue();
  };

  const updateWallet = async () => {
    await walletController.updateWalletSpecific(listWallets[indexSelected].id, {
      isBackedUp: true,
    });
    const newListWallets = cloneDeep(listWallets)?.map((wallet, index) => {
      if (index === indexSelected) {
        wallet.isBackedUp = true;
      } else {
        wallet.isBackedUp = false;
      }
      return wallet;
    });
    setListWallets(newListWallets);
  };

  useEffect(() => {
    (async () => {
      const _accessToken = await storedAccessToken?.accessToken;
      if (_accessToken) {
        setAccessToken(_accessToken);
      }
    })();
  }, [storedAccessToken]);

  const textFields = [
    {
      type: "text",
      name: "fileName",
      label: "File Name",
    },
    {
      type: "password",
      name: "password",
      label: "Password",
    },
    {
      type: "password",
      name: "rePassword",
      label: "Re-enter Password",
    },
    {
      type: "text",
      name: "passwordHint",
      label: "Password Hint",
    },
  ];

  return (
    <View
      style={tw`flex flex-col items-center justify-between w-full h-full px-4 pt-10 `}
    >
      <Text style={tw`w-full dark:text-white`}>
        {storedAccessToken?.email}
      </Text>
      <ScrollView style={tw`flex`}>
        {textFields.map((item, index) => {
          if (isAppPassword && index > 0) {
            return null;
          }
          return (
            <Controller
              key={index}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  type={item.type}
                  value={value}
                  labelStyle={` `}
                  onChangeText={onChange}
                  label={item.label}
                />
              )}
              name={item.name as nameType}
            />
          );
        })}
      </ScrollView>
      <View style={tw`absolute w-full bottom-5`}>
        <View style={tw`flex-row items-center justify-between w-full mb-5`}>
          <Text style={tw`font-semibold dark:text-white`}>
            Use App's Password for encryption
          </Text>
          <Switch
            trackColor={{ false: primaryGray, true: primaryColor }}
            thumbColor="white"
            onValueChange={(value) => setIsAppPassword(value)}
            value={isAppPassword}
          />
        </View>
        <Button fullWidth onPress={handleOnPress} loading={loading}>
          Backup
        </Button>
      </View>
    </View>
  );
};

export default BackupWallet;
