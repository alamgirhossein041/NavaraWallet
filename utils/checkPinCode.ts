import * as Keychain from 'react-native-keychain';

const checkPinCode = async (inputPinCode: string): Promise<boolean> => {
  const credentials = await Keychain.getGenericPassword();
  return (
    credentials && credentials.password && credentials.password === inputPinCode
  );
};

export default checkPinCode;
