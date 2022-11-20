import React from "react";
import { ScrollView, View } from "react-native";
import { useRecoilValue } from "recoil";
import Loading from "../../components/Skeleton/Loading";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { SupportedSwapChainsEnum } from "../../enum";
import { NETWORKS } from "../../enum/bcEnum";
import { ENVIRONMENT } from "../../global.config";
import { tw } from "../../utils/tailwind";
import ListChainsChart from "../Home/ListChainsChart";

const SwapToken = () => {
  const walletEnvironment = useRecoilValue(walletEnvironmentState);

  const filter = React.useMemo(() => {
    if (walletEnvironment === ENVIRONMENT.PRODUCTION) {
      return Object.keys(SupportedSwapChainsEnum);
    } else {
      return [NETWORKS.ETHEREUM];
    }
  }, [walletEnvironment]);

  return (
    <View style={tw`flex flex-col h-full `}>
      <View style={tw`flex-col items-center justify-between flex-1 w-full`}>
        <ScrollView style={tw`w-full mb-5 `}>
          <Loading type={"spin"}>
            <ListChainsChart
              next="SwapScreen"
              caching
              hideSettings
              filter={filter}
            />
          </Loading>
        </ScrollView>
      </View>
    </View>
  );
};

export default SwapToken;
