import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import InputText from '../../components/InputText';
import {bgGray} from '../../configs/theme';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import usePopupResult from '../../hooks/usePopupResult';
import {googleDriveStoreFile} from '../../module/googleApi/GoogleDrive';
import {GOOGLE_ACCESS_TOKEN} from '../../utils/storage';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';

const BackupWallet = ({navigation, route}) => {
  const [storedAccessToken] = useLocalStorage(GOOGLE_ACCESS_TOKEN);
  const [accessToken, setAccessToken] = useState('');
  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const popupResult = usePopupResult();

  const mnemonic = route.params.data;

  const handleError = () => {
    if (fileName.length === 0) {
      return 'Please enter file name';
    }
    if (password.length === 0) {
      return 'Please enter password';
    }
    if (confirmPassword.length === 0) {
      return 'Please enter confirm password';
    }

    if (passwordHint.length === 0) {
      return 'Please enter password hint';
    }

    if (!confirm) {
      return 'Please confirm ';
    }

    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      return 'Password does not match';
    }

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password.match(regex)) {
      setPassword('');
      setConfirmPassword('');
      return 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character';
    }
    return '';
  };
  const handleOnPress = async () => {
    const error = handleError();
    if (error) {
      return toastr.error(error, {duration: 3000});
    }
    setLoading(true);
    if (accessToken) {
      const result = await googleDriveStoreFile(
        accessToken,
        fileName,
        mnemonic,
      );

      if (result.status === 'success') {
        setLoading(false);
        navigation.goBack();
        popupResult({
          title: 'Backup Successfully',
          isOpen: true,
          type: 'success',
          onPressButton: navigation.goBack(),
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
    }
    setLoading(false);
    setConfirm(false);
    setFileName('');
    setPassword('');
    setConfirmPassword('');
    setPasswordHint('');
  };
  // const AES = useAES();

  useEffect(() => {
    (async () => {
      const _accessToken = await storedAccessToken;
      if (_accessToken) {
        setAccessToken(_accessToken);
      }
    })();
  }, [storedAccessToken]);

  return (
    <View
      style={tw`h-full p-5 flex flex-col justify-between bg-[${bgGray}] dark:bg-gray-800`}>
      <ScrollView style={tw`flex`}>
        <InputText
          value={fileName}
          labelStyle={`dark:text-white`}
          onChangeText={text => setFileName(text)}
          placeholder="Enter file name"
          label="File name"
        />
        <InputText
          value={password}
          labelStyle={`dark:text-white`}
          onChangeText={text => setPassword(text)}
          type="password"
          placeholder="Enter password"
          label="Password"
        />
        <InputText
          value={confirmPassword}
          labelStyle={`dark:text-white`}
          onChangeText={text => setConfirmPassword(text)}
          type="password"
          placeholder="Re-enter password"
          label="Confirm password"
        />
        <InputText
          value={passwordHint}
          labelStyle={`dark:text-white`}
          onChangeText={text => setPasswordHint(text)}
          placeholder="Enter password hint"
          label="Password hint"
        />
        <CheckBox
          check={confirm}
          labelStyle={`dark:text-white`}
          onPress={() => setConfirm(!confirm)}
          label="I understand that Dnet cannot recover this password for me"
        />
      </ScrollView>
      <View>
        <Button
          onPress={async () => {
            await handleOnPress();
          }}
          loading={loading}>
          Backup
        </Button>
      </View>
    </View>
  );
};

export default BackupWallet;
