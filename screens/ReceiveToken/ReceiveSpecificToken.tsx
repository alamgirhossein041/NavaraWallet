import React, {useRef} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import QRCode from 'react-qr-code';
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from '../../utils/toastr';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {primaryColor} from '../../configs/theme';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import IconCopy from '../../assets/icons/icon-copy.svg';
import IconShare from '../../assets/icons/icon-share.svg';
import IconDomain from '../../assets/icons/icon-domain.svg';
import ViewShot, {captureScreen} from 'react-native-view-shot';
import Share from 'react-native-share';
import {shortenAddress} from '../../utils/stringsFunction';
import {useLinkTo} from '@react-navigation/native';
const ReceiveSpecificToken = ({route, navigation}) => {
  const {token} = route.params;
  const walletSelected = useWalletSelected();
  //background Darkmode
  const modeColor = useDarkMode();
  navigation.setOptions({
    title: `Receive ${token.symbol}`,
  });
  const Icon = CHAIN_ICONS[token.network];
  const textColor = useTextDarkMode();

  const viewShotRef: any = useRef();
  const captureViewShot = async () => {
    const imageURI = await viewShotRef.current.capture();
    const res = await Share.open({
      url: imageURI,
      message: `This is my ${token.symbol} wallet`,
    });
  };
  // function captureScreenShot() {
  //   captureScreen({
  //     format: 'png',
  //     quality: 1.0,
  //   }).then(
  //     url => {
  //       Share.share({title: 'Image', url: url});
  //     },
  //     error => console.error('Oops snapshot failled', error),
  //   );
  // }
  const linkTo = useLinkTo();
  return (
    <ScrollView style={tw`h-full  flex-col  ${modeColor} p-2`}>
      <ViewShot
        captureMode="mount"
        ref={viewShotRef}
        options={{format: 'jpg', quality: 1.0}}>
        <View style={tw`flex-1 w-full `}>
          <View style={tw`items-center mb-5 `}>
            <Icon width={80} height={80} />
          </View>

          {walletSelected.data.domain ? (
            <TouchableOpacity
              style={tw`flex flex-row p-2 mx-auto mb-3 rounded-lg `}
              activeOpacity={0.6}
              onPress={async () => {
                await Clipboard.setString(token.address);
                toastr.info('Copied');
              }}>
              <IconDomain />
              <Text style={tw`mx-2 text-sm font-bold text-center `}>
                {walletSelected.data.domain}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => linkTo('/GetYourDomain')}
                style={tw`bg-[${primaryColor}] mx-10 rounded-full my-3 `}>
                <Text style={tw`px-2 py-2 font-bold text-center text-white `}>
                  Get your domain
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View style={tw`flex items-center justify-center w-full my-5`}>
            <View
              style={tw`relative items-center justify-center w-2/3 p-5 bg-white border-2 border-gray-100/60 rounded-3xl`}>
              <QRCode value={`${token.address}`} size={200} />
            </View>
          </View>

          <TouchableOpacity
            style={tw`p-2 mb-3`}
            activeOpacity={0.6}
            onPress={async () => {
              await Clipboard.setString(token.address);
              toastr.info('Copied');
            }}>
            <Text style={tw`text-sm text-center px-5 ${textColor}`}>
              {shortenAddress(token.address)}
            </Text>
          </TouchableOpacity>
        </View>
      </ViewShot>
      <View style={tw`flex-row items-center justify-center my-5 text-center`}>
        <TouchableOpacity
          onPress={async () => {
            await Clipboard.setString(token.address);
            toastr.info('Copied');
          }}
          style={tw`items-center justify-center w-20 text-center `}>
          <IconCopy />
          <Text style={tw`text-lg font-bold text-center ${textColor} `}>
            Copy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={captureViewShot}
          style={tw`items-center justify-center w-20 text-center `}>
          <IconShare />
          <Text style={tw`text-lg font-bold text-center ${textColor}`}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`mx-auto text-[10px]`}>
        Accept payment from other Navara{' '}
      </Text>
      <Text style={tw`mx-auto text-[10px]`}>Wallet users</Text>
    </ScrollView>
  );
};

export default ReceiveSpecificToken;
