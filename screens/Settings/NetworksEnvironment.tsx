import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import { primaryColor, primaryGray } from "../../configs/theme";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { ENVIRONMENT } from "../../global.config";
import { localStorage, NETWORKS_ENVIRONMENT } from "../../utils/storage";
import { tw } from "../../utils/tailwind";

const NetworksEnvironment = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [walletEnvironment, setWalletEnvironment] = useRecoilState(
    walletEnvironmentState
  );

  const handelChange = async (isTestnet: boolean) => {
    setIsLoading(true);
    try {
      const newEnvironment = isTestnet
        ? ENVIRONMENT.DEVELOPMENT
        : ENVIRONMENT.PRODUCTION;
      setWalletEnvironment(newEnvironment);
      await localStorage.set(NETWORKS_ENVIRONMENT, newEnvironment);
      navigation.navigate("WalletDashboard");
    } catch (error) {
      console.warn(error);
    }
    setIsLoading(false);
  };
  const { t } = useTranslation();

  return (
    <View style={tw`flex items-center justify-center h-full p-2`}>
      <View>
        <View style={tw`flex items-center`}>
          <Text style={tw`mb-2 text-sm text-gray-400 dark:text-white`}>
            Testnet{" "}
            {walletEnvironment === ENVIRONMENT.DEVELOPMENT
              ? t("networks_enviroment.availability")
              : t("networks_enviroment.disabled")}
          </Text>

          <View style={tw`flex flex-row items-center `}>
            <Switch
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              trackColor={{ false: primaryGray, true: primaryColor }}
              thumbColor="white"
              onValueChange={handelChange}
              value={walletEnvironment === ENVIRONMENT.DEVELOPMENT}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default NetworksEnvironment;
