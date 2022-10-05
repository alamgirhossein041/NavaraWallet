import { Text, View } from "react-native";
import { tw } from "../../utils/tailwind";
import networks from "./NetworkData";
import React from "react"
const NetworkGroup = (networkId: string, tokenIndex: number, tokens: any[]) => {
  const index = networks.findIndex((network) => network.id === networkId);
  return (
    <>
      {index !== -1 &&
        (tokenIndex === 0 ||
        (tokenIndex > 0 &&
          tokens[tokenIndex].networkId !== tokens[tokenIndex - 1].networkId) ? (
          <View style={tw`flex flex-row items-center my-2`}>
            <View style={tw`h-4 w-4 mr-1`}>{networks[index].icon}</View>
            <Text>{networks[index].name}</Text>
          </View>
        ) : (
          <></>
        ))}
    </>
  );
};

export default NetworkGroup;
