import React from 'react';
import {Alert, Text, TextInput, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import HeaderScreen from '../../components/HeaderScreen';
import {selectGray} from '../../configs/theme';
import {useDarkMode} from '../../hooks/useDarkMode';
import {useTextDarkMode} from '../../hooks/useTextDarkMode';
import {useGridDarkMode} from '../../hooks/useGridDarkMode';
const GetYourDomain = ({navigation}) => {
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw` h-full ${modeColor} flex flex-col justify-between`}>
      <View style={tw`p-5 `}>
        <Text style={tw`font-bold text-black ${textColor}`}>
          You can get one domain for free
        </Text>
        <Text style={tw`leading-6 text-gray-400 ${textColor}`}>
          Each account can get one domain for free. In case you want to mint it
          (push the domain onto blockchain as a NFT domain), no mint fee will be
          applied, however, you may need to pay a small gas fee depending on the
          network you want. Later you can use this NFT domain as an
          easy-to-remember address of your wallet.
        </Text>
      </View>
      <View style={tw`flex items-center p-4`}>
        <Button onPress={() => navigation.navigate('MintDomain')}>
          <Text style={tw`text-center text-base font-medium text-white`}>
            Mint free domain
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default GetYourDomain;
