import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CogIcon } from 'react-native-heroicons/solid';
import { useRecoilValue } from 'recoil';
import MenuItem from '../../components/MenuItem';
import { CHAIN_ICONS, NETWORK_COINGEKO_IDS, TOKEN_SYMBOLS } from '../../configs/bcNetworks';
import { primaryColor } from '../../configs/theme';
import { listWalletsState } from '../../data/globalState/listWallets';
import { priceTokenState } from '../../data/globalState/priceTokens';
import { useDarkMode } from '../../hooks/useDarkMode';
import shortenAddress from '../../utils/shortenAddress';
import { tw } from '../../utils/tailwind';
const ListTokenMultiChain = props => {
  const priceTokens = useRecoilValue(priceTokenState)
  const listWallets = useRecoilValue(listWalletsState);
  const listChains = !!listWallets
    ? listWallets.filter(item => item.isSelected)[0].listChains
    : [];
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const navigation = useNavigation();
  return (
    <View style={tw`px-3 mb-5 ${modeColor}`}>
      {listChains && listChains?.map((token, index) => {
        const Icon = CHAIN_ICONS[token.network];
        const price = priceTokens[NETWORK_COINGEKO_IDS[token.network]]?.usd.toFixed(2) || "---"
        const symbol = TOKEN_SYMBOLS[token.network]
        return token.isEnable && (
          <MenuItem
            key={index}
            icon={Icon ? <Icon width={30} height={30} /> : <></>}
            iconPadding={''}
            name={
              <View style={tw`flex flex-col text-left`}>
                <Text style={tw`text-xs text-gray-500`}>
                  {token.network.split('_')[0]} ({token.symbol})
                </Text>
                <Text style={tw`text-xs text-gray-500`}>
                  $ {price}
                </Text>
              </View>
            }
            onPress={() =>
              navigation.navigate('DetailChain' as never, { token: { ...token, price } } as never)
            }
            value={shortenAddress(token.address)}
            next={false}
          />
        );
      })}
      <View style={tw`w-full flex-row items-center justify-center`}>
        <TouchableOpacity style={tw`my-5`} onPress={() => navigation.navigate("ManageChains" as never)}>
          <CogIcon fill={primaryColor} height={40} width={40} />
        </TouchableOpacity>
      </View>
    </View>
    // </ScrollView>
  );
};

export default ListTokenMultiChain;
