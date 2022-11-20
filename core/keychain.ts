import CryptoJS from "crypto-js";
import * as Keychain from "react-native-keychain";

export const storeToKeychain = async (password: string) => {
  try {
    return await Keychain.setGenericPassword("Navara Wallet", password);
  } catch (error) {
    console.warn(error);
  }
};

export const getFromKeychain = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return credentials.password;
    } else {
      console.warn("No credentials stored");
    }
  } catch (error) {
    console.warn("Keychain couldn't be accessed!", error);
  }

  return "";
};

export const resetKeychain = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (err) {
    console.warn(err);
  }
};

export const encryptAESWithKeychain = async (value: string) => {
  try {
    const KeychainPassword = await getFromKeychain();
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      KeychainPassword
    ).toString();
    if (encryptedValue) {
      return encryptedValue;
    } else {
      return value;
    }
  } catch (error) {
    console.warn("AES encryption failed: ", error);
    return value;
  }
};

export const decryptAESWithKeychain = async (value: string) => {
  try {
    const KeychainPassword = await getFromKeychain();
    const decryptedValue = CryptoJS.AES.decrypt(
      value,
      KeychainPassword
    ).toString(CryptoJS.enc.Utf8);
    if (decryptedValue) {
      return decryptedValue;
    } else {
      return value;
    }
  } catch (error) {
    console.warn("AES decryption failed: ", error);
    return value;
  }
};
export const encryptAES = (value: string, password: string) => {
  try {
    const encryptedValue = CryptoJS.AES.encrypt(value, password).toString();

    return encryptedValue;
  } catch (error) {
    console.warn("AES encryption failed: ", error);
    return "";
  }
};

export const decryptAES = (value: string, password?: string) => {
  try {
    const decryptedValue = CryptoJS.AES.decrypt(value, password).toString(
      CryptoJS.enc.Utf8
    );

    return decryptedValue;
  } catch (error) {
    console.warn("AES decryption failed: ", error);
    return "";
  }
};
