import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRecoilState, useSetRecoilState } from "recoil";
import { getFromKeychain } from "../../core/keychain";
import useDatabase from "../../data/database/useDatabase";
import { appLockState } from "../../data/globalState/appLock";
import { listWalletsState } from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  localStorage,
  NETWORKS_ENVIRONMENT,
  SELECTED_LANGUAGE,
} from "../../utils/storage";
import SplashScreen from "./SplashScreen";

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
          redirect("OnBoard");
        }
      })();
    }
  }, [connection]);

  return <SplashScreen />;
};

export default Splash;
