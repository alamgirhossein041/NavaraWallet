import _ from 'lodash';
import React from 'react';
import {Image, View} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {tw} from '../utils/tailwind';
type IconProps = {
  uri: string;
  size?: string;
  style?: string;
};
const TokenIcon = ({uri, size = 'w-8 h-8', style}: IconProps) => {
  if (_.isNil(uri) || uri === '') {
    return null;
  }
  return (
    <View style={tw` p-0.5 ${size} ${style}`}>
      {uri.includes('svg') ? (
        <SvgUri width="100%" height="100%" uri={uri} />
      ) : (
        <Image
          style={tw`w-full h-full rounded-full`}
          source={{
            uri: uri,
          }}
        />
      )}
    </View>
  );
};

export default TokenIcon;
