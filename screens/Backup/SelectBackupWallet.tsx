import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, {Key, useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import MenuItem from '../../components/MenuItem';
import {bgGray} from '../../configs/theme';
import {GoogleClientIdEnum} from '../../enum';
import {useDarkMode} from '../../hooks/useDarkMode';
import {useGridDarkMode} from '../../hooks/useGridDarkMode';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {useTextDarkMode} from '../../hooks/useTextDarkMode';
import {GOOGLE_ACCESS_TOKEN, LIST_WALLETS} from '../../utils/storage';
import {tw} from '../../utils/tailwind';

const SelectBackupWallet = ({navigation}) => {
  const [storedListWallets] = useLocalStorage(LIST_WALLETS);
  const [storedAccessToken, setStorageAccessToken] =
    useLocalStorage(GOOGLE_ACCESS_TOKEN);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [accessToken, setAccessToken] = useState('');
  const [listWallets, setListWallets] = useState<any>(storedListWallets);

  const SCOPE = ['https://www.googleapis.com/auth/drive.file'];
  useEffect(() => {
    (async () => {
      const _listWallets = await storedListWallets;
      if (_listWallets) {
        setListWallets(_listWallets);
      }
    })();
  }, [storedListWallets]);
  useEffect(() => {
    (async () => {
      const _accessToken = await storedAccessToken;
      if (_accessToken) {
        setAccessToken(_accessToken.toString());
      }
    })();
  }, [storedAccessToken]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: SCOPE,
      webClientId: GoogleClientIdEnum.WEB,
      iosClientId: GoogleClientIdEnum.IOS,

      offlineAccess: true,
    });
  }, []);

  const handleOnPress = async (mnemonic: string) => {
    let isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      navigation.navigate('BackupWallet', {data: mnemonic});
    } else {
      await googleSignIn();
      isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        navigation.navigate('BackupWallet', {data: mnemonic});
      }
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const _userInfo = await GoogleSignin.signIn();
      if (Platform.OS === 'ios') {
        await GoogleSignin.addScopes({
          scopes: SCOPE,
        });
      }
      setUserInfo(_userInfo);
      const _accessToken = await GoogleSignin.getTokens();
      setAccessToken(_accessToken.accessToken);
      setStorageAccessToken(_accessToken.accessToken);
    } catch (error: any) {
      console.log(error);
    }
  };
  const modeColor = useDarkMode();
  //text darkmode
  //grid, shadow darkmode
  return (
    <ScrollView style={tw`${modeColor}`}>
      <View style={tw`p-5 flex flex-col`}>
        <View style={tw`flex items-center`}>
          {listWallets &&
            listWallets.map((item: any, index: Key | null | undefined) => {
              return (
                <View key={index} style={tw`w-full`}>
                  <MenuItem
                    name={item.label}
                    next={false}
                    onPress={async () => {
                      await handleOnPress(item.seedPhrase.join(' '));
                    }}
                  />
                </View>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

export default SelectBackupWallet;
