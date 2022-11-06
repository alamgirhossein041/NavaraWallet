import { StatusBar } from "native-base";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { SafeAreaView } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import Logo from "../../assets/logo/logo-white.svg";
import { primaryColor } from "../../configs/theme";
import useDatabase from "../../data/database/useDatabase";
import { appLockState } from "../../data/globalState/appLock";
import { listWalletsState } from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { IAppLockState } from "../../data/types";
import { ENVIRONMENT } from "../../global.config";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getFromKeychain, resetKeychain } from "../../utils/keychain";
import {
  localStorage,
  NETWORKS_ENVIRONMENT,
  SELECTED_LANGUAGE,
  STORAGE_APP_LOCK,
} from "../../utils/storage";
import { tw } from "../../utils/tailwind";

const Splash = ({ navigation }) => {
  const { walletController, connection } = useDatabase();
  const setListWallets = useSetRecoilState(listWalletsState);
  const setWalletEnvironment = useSetRecoilState(walletEnvironmentState);
  const [appLock, setAppLock] = useRecoilState(appLockState);

  const redirect = (route) => {
    navigation.replace(route);
  };
  const [selectLanguage] = useLocalStorage(SELECTED_LANGUAGE, "en");
  const { i18n } = useTranslation();
  //
  useEffect(() => {
    i18n.changeLanguage(selectLanguage);
  }, [selectLanguage]);

  useEffect(() => {
    if (!!connection) {
      (async () => {
        /**
         * Get state main net / test net
         */
        const environment =
          (await localStorage.get(NETWORKS_ENVIRONMENT)) ||
          ENVIRONMENT.PRODUCTION;
        setWalletEnvironment(environment as ENVIRONMENT);
        const wallets = await walletController.getWallets();

        /**
         * Check database wallet if exting wallet redirect to dashboard or onboard screen
         */
        if (wallets && wallets.length > 0) {
          setListWallets(wallets);
          const password = await getFromKeychain();
          if (!password) {
            navigation.navigate("OnBoard", { screen: "EnableAppLockOnBoard" });
          } else {
            redirect("TabsNavigation");
          }
        } else {
          await resetKeychain();
          redirect("OnBoard");
        }
      })();
    }
  }, [connection]);

  useEffect(() => {
    (async () => {
      // update appLock state from localStorage when open app first time
      const res: IAppLockState | any = await localStorage.get(STORAGE_APP_LOCK);

      if (res) {
        setAppLock({ ...res, isLock: true });
      }
    })();
  }, []);

  return (
    <SafeAreaView
      style={tw`items-center justify-center w-full h-full bg-[${primaryColor}]`}
    >
      <StatusBar barStyle="dark-content" backgroundColor={primaryColor} />
      <Logo width={240} height={240} />
    </SafeAreaView>
  );
};

export default Splash;
