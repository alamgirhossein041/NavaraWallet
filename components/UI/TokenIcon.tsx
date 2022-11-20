import { isNil } from "lodash";
import React from "react";
import { Image, View } from "react-native";
import { SvgUri } from "react-native-svg";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
type IconProps = {
  uri: string;
  size?: string;
  style?: string;
};
const TokenIcon = ({ uri, size = "w-8 h-8", style }: IconProps) => {
  return (
    <View
      style={tw` p-0.5 border-2 border-[${primaryColor}] rounded-full ${size} ${style}`}
    >
      {isNil(uri) || uri === "" ? (
        <></>
      ) : (
        <>
          {uri.includes("svg") ? (
            <SvgUri width="100%" height="100%" uri={uri} />
          ) : (
            <Image
              style={tw`w-full h-full rounded-full`}
              source={{
                uri: uri,
              }}
            />
          )}
        </>
      )}
    </View>
  );
};

export default TokenIcon;
