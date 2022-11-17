import React from "react";
import { ScrollView, View } from "react-native";
import Loading from "../../components/Skeleton/Loading";
import { SupportedSwapChainsEnum } from "../../enum";
import { tw } from "../../utils/tailwind";
import ListChainsChart from "../Home/ListChainsChart";

const SwapToken = () => {
  const filter = Object.keys(SupportedSwapChainsEnum);

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
