import React from "react";
import { ScrollView, View } from "react-native";
import { tw } from "../../utils/tailwind";
// import tokens from "./TokenData";
import Loading from "../../components/Skeleton/Loading";
import ListChainsChart from "../Home/ListChainsChart";

const ReceiveToken = ({ navigation }) => {
  return (
    <View style={tw`flex flex-col h-full `}>
      <View style={tw`flex-col justify-between flex-1 w-full`}>
        <ScrollView style={tw`w-full mb-5 `}>
          <Loading type={"spin"}>
            <ListChainsChart next="ReceiveSpecificToken" caching />
          </Loading>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReceiveToken;
