import {ScrollView, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import {bgGray} from '../../configs/theme';
import MenuItem from '../../components/MenuItem';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {LIST_CHAINS, LIST_WALLETS} from '../../utils/storage';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import shortenAddress from '../../utils/shortenAddress';
import {IWallet} from '../../data/types';
import React from 'react';
import {useDarkMode} from '../../hooks/useDarkMode';
import {useTextDarkMode} from '../../hooks/useTextDarkMode';
import {useGridDarkMode} from '../../hooks/useGridDarkMode';
const ViewListWallet = ({navigation}) => {
  const [listWallets] = useLocalStorage(LIST_WALLETS, []);
  const listChains = !!listWallets
    ? listWallets.filter(item => item.isSelected)[0].listChains
    : [];
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  return (
    <View style={tw` h-full pt-1 ${modeColor} `}>
      <View
        style={tw`w-full flex-1 flex-col h-full items-center justify-between shadow ${modeColor} rounded-t-3xl `}>
        <ScrollView style={tw`w-full h-full px-2 mb-5 mt-2 `}>
          {listChains?.map((token, index) => {
            const Icon = CHAIN_ICONS[token.network];
            return (
              <MenuItem
                key={index}
                icon={<Icon width={30} height={30} />}
                iconPadding={''}
                name={
                  <View style={tw`flex flex-row items-center`}>
                    <Text style={tw`text-xs text-gray-800`}>
                      {token.network.split('_')[0]}
                    </Text>
                    <Text style={tw`text-xs text-gray-500`}>
                      ({token.symbol})
                    </Text>
                  </View>
                }
                onPress={() => navigation.navigate('SendingToken', {token})}
                value={shortenAddress(token.address)}
                next
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ViewListWallet;
