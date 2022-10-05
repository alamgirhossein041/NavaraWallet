import _ from "lodash";
import { Image, View } from "react-native";
import { QuestionMarkCircleIcon } from "react-native-heroicons/outline";
import { SvgUri } from "react-native-svg";
import { tw } from "../utils/tailwind";
import React, {useState} from 'react';
type IconProps = {
  uri: string;
  size?: string;
  style?: string;
};
const TokenIcon = ({ uri, size = "w-8 h-8", style }: IconProps) => {
  if (_.isNil(uri) || uri === "") {
    return (
      <View style={tw`bg-white p-0.5 ${size} ${style}`}>
        <QuestionMarkCircleIcon width="100%" height="100%" stroke="gray" />
      </View>
    );
  }
  return (
    <View style={tw` p-0.5 ${size} ${style}`}>
      {uri.includes("svg") ? (
        <SvgUri width="100%" height="100%" uri={uri} />
      ) : (
        <Image
          style={tw`w-full h-full`}
          source={{
            uri: uri,
          }}
        />
      )}
    </View>
  );
};

export default TokenIcon;
