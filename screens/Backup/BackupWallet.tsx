import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useRecoilState} from 'recoil';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import {listWalletsState} from '../../data/globalState/listWallets';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import usePopupResult from '../../hooks/usePopupResult';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {googleDriveStoreFile} from '../../module/googleApi/GoogleDrive';
import {GOOGLE_ACCESS_TOKEN} from '../../utils/storage';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';
import base64 from 'react-native-base64';
import {IBackupData, IFileData} from '../../data/types';
import useDatabase from '../../data/database/useDatabase';
import {Controller, useForm} from 'react-hook-form';
import {Switch} from 'native-base';
import {primaryColor, primaryGray} from '../../configs/theme';
import {
  decryptAESWithKeychain,
  encryptAESWithKeychain,
} from '../../utils/keychain';
import {Regex} from '../../configs/defaultValue';

type nameType = 'password' | 'rePassword' | 'fileName' | 'passwordHint';

const BackupWallet = ({navigation, route}) => {
  const [storedAccessToken, setStorageAccessToken] =
    useLocalStorage(GOOGLE_ACCESS_TOKEN);
  const [accessToken, setAccessToken] = useState('');
  const [isAppPassword, setIsAppPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const popupResult = usePopupResult();
  const {walletController} = useDatabase();
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      fileName: '',
      password: '',
      rePassword: '',
      passwordHint: '',
    },
  });
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const indexSelected = route.params.indexSelected as number;
  const seedPhrase = listWallets[indexSelected]?.seedPhrase;

  const resetValue = (value?: string) => {
    if (value === 'password') {
      setValue('password', '');
      setValue('rePassword', '');
    }
    setValue('fileName', '');
    setValue('password', '');
    setValue('rePassword', '');
    setValue('passwordHint', '');
  };

  const handleError = () => {
    const {fileName, password, rePassword} = getValues();
    if (fileName.length === 0) {
      return 'Please enter file name';
    }
    if (isAppPassword) {
      return '';
    }
    if (password.length === 0) {
      return 'Please enter password';
    }
    if (rePassword.length === 0) {
      return 'Please enter confirm password';
    }

    if (password !== rePassword) {
      resetValue('password');
      return 'Password does not match';
    }

    if (!password.match(Regex.password)) {
      resetValue('password');
      return 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character(@$!%*#?&$)';
    }
    return '';
  };

  const getData = async (password: string) => {
    if (isAppPassword) {
      return seedPhrase;
    } else {
      const decryptedSeedPhrase = await decryptAESWithKeychain(seedPhrase);
      const encryptedSeedPhrase = await encryptAESWithKeychain(
        decryptedSeedPhrase,
        password,
      );
      return encryptedSeedPhrase;
    }
  };

  const handleOnPress = async () => {
    const error = handleError();
    if (error.length > 0) {
      toastr.error(error, {duration: 3000});
      return;
    }
    const {fileName, password, passwordHint} = getValues();

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
        encodedFileData,
      );
      if (result.status === 'success') {
        setLoading(false);
        await updateWallet();
        await GoogleSignin.signOut();
        navigation.goBack();
        popupResult({
          title: 'Backup Successfully',
          isOpen: true,
          type: 'success',
        });
      } else {
        setLoading(false);
        popupResult({
          title: 'Backup Error',
          isOpen: true,
          type: 'error',
        });
      }
      await GoogleSignin.signOut();
      setStorageAccessToken('');
      navigation.goBack();
    } else {
      GoogleSignin.signOut();
      navigation.goBack();
      return toastr.error('Login error', {duration: 3000});
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

  const modeColor = useDarkMode();
  const textColor = useTextDarkMode();

  const textFields = [
    {
      type: 'text',
      name: 'fileName',
      label: 'File Name',
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
    },
    {
      type: 'password',
      name: 'rePassword',
      label: 'Re-enter Password',
    },
    {
      type: 'text',
      name: 'passwordHint',
      label: 'Password Hint',
    },
  ];

  return (
    <View
      style={tw`h-full w-full px-4 pt-10 flex flex-col justify-between items-center ${modeColor}`}>
      <Text style={tw`w-full`}>{storedAccessToken?.email}</Text>
      <ScrollView style={tw`flex`}>
        {textFields.map((item, index) => {
          if (isAppPassword && index > 0) {
            return null;
          }
          return (
            <Controller
              key={index}
              control={control}
              render={({field: {onChange, value}}) => (
                <TextField
                  type={item.type}
                  value={value}
                  labelStyle={`${textColor} `}
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
          <Text style={tw`font-semibold`}>
            Use App's Password for encryption
          </Text>
          <Switch
            trackColor={{false: primaryGray, true: primaryColor}}
            thumbColor="white"
            onValueChange={value => setIsAppPassword(value)}
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
