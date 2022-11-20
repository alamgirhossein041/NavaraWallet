import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { getFromKeychain } from "../../core/keychain";
import WalletController from "../../data/database/controllers/wallet.controller";
import useDatabase from "../../data/database/useDatabase";
import {
  idWalletSelected,
  listWalletsState,
} from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  ID_WALLET_SELECTED,
  localStorage,
  NETWORKS_ENVIRONMENT,
  SELECTED_LANGUAGE,
} from "../../utils/storage";
import SplashScreen from "./SplashScreen";

const Splash = ({ navigation }) => {
  const { connection } = useDatabase();

  const setListWallets = useSetRecoilState(listWalletsState);
  const setWalletEnvironment = useSetRecoilState(walletEnvironmentState);
  const indexWalletSelected = useRecoilValue(idWalletSelected);

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
      const walletController = new WalletController();
      (async () => {
        /**
         * Get state main net / test net
         */
        const environment =
          (await localStorage.get(NETWORKS_ENVIRONMENT)) ||
          ENVIRONMENT.PRODUCTION;
        setWalletEnvironment(environment as ENVIRONMENT);
        const wallets = await walletController.getWallets();

        if (!(await localStorage.get(ID_WALLET_SELECTED))) {
          // Check existing ID_WALLET_SELECTED in localStorage

          if (wallets[indexWalletSelected]?.id) {
            await localStorage.set(
              ID_WALLET_SELECTED,
              wallets[indexWalletSelected].id
            );
          }
        }

        if (wallets && wallets.length > 0) {
          setListWallets(wallets);
          const password = await getFromKeychain();
          if (!password) {
            navigation.navigate("OnBoard", {
              screen: "EnableAppLockOnBoard",
            });
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
