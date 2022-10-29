import React from 'react';
import {Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import {primaryColor} from '../../configs/theme';
import QRCode from 'react-qr-code';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from '../../utils/toastr';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
type TokenCardProps = {
  address: string;
  symbol: string;
  icon: JSX.Element;
  network: string;
};

const TokenCard = ({token, amount}) => {
  const Icon = CHAIN_ICONS[token.network];
  //background Darkmode

  //text darkmode

  //grid, shadow darkmode

  return (
    <View style={tw`w-full p-4  rounded-3xl `}>
      <View style={tw`w-full h-full flex-col items-center justify-center`}>
        <View style={tw`flex flex-row items-center`}>
          <View style={tw` w-8 h-8 rounded-full  mr-1`}>
            <Icon width={30} height={30} />
          </View>
          {amount && (
            <Text
              style={tw`mr-1 text-base font-semibold text-[${primaryColor}] `}>
              {amount}
            </Text>
          )}
          <Text style={tw`dark:text-white  text-base `}>{token.network}</Text>
          <Text style={tw`dark:text-white  text-xs text-gray-500 `}>
            ({token.symbol})
          </Text>
        </View>

        <View
          style={tw`w-full flex items-center justify-center p-4  rounded-3xl mt-5`}>
          <View style={tw` flex items-center justify-center p-6   `}>
            {/* {EVM_CHAINS.includes(token.network) ?
              <QRCode value={token.address} size={200} />
              :
              <QRCode value={`${token.address}`} size={200} />
            } */}
            <QRCode value={`${token.address}`} size={200} />
          </View>
        </View>

        <View style={tw`flex flex-row items-center justify-center mt-5 px-5`}>
          {/* <View
            style={tw`w-5 h-5 p-0.5 flex items-center justify-center rounded-full bg-[#004785] mr-1`}
          >
            <LocationMarkerIcon color="white" width="100%" height="100%" />
          </View> */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={async () => {
              await Clipboard.setString(token.address);
              toastr.info('Copied');
            }}>
            <Text style={tw`dark:text-white  text-sm text-center `}>
              {token.address}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TokenCard;
