import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { tw } from '../../utils/tailwind';
import Button from '../../components/Button';
import MenuItem from '../../components/MenuItem';
// import tokens from "./TokenData";
import SelectNetwork from '../AddToken/SelectNetwork';
import NetworkGroup from '../AddToken/NetworkGroup';
import HeaderScreen from '../../components/HeaderScreen';
import { bgGray } from '../../configs/theme';
import shortenAddress from '../../utils/shortenAddress';
import { getEthereumAddress, getEthereumBalance } from '../../hooks/useEvm';
import { getSolanaAddress, getSolanaBalance } from '../../hooks/useSolana';
import { LIST_WALLETS } from '../../utils/storage';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CHAIN_ICONS, EVM_CHAINS, TOKEN_SYMBOLS } from '../../configs/bcNetworks';
import { NETWORKS } from '../../enum/bcEnum';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../../data/globalState/listWallets';

const ReceiveToken = ({ navigation }) => {
  const [activeWallet, setActiveWallet] = useState(null);
  const [listWallets] = useRecoilState(listWalletsState);

  const [tokens, setTokens] = useState([]);
  const [tokenList, setTokenList] = useState<any[]>(
    tokens.sort((a, b) => {
      if (a.networkId < b.networkId) {
        return -1;
      }
      if (a.networkId > b.networkId) {
        return 1;
      }
      return 0;
    }),
  );
  const [searchText, setSearchText] = useState<string>('');

  const listChains = !!listWallets
    ? listWallets.filter(item => item.isSelected)[0].listChains
    : [];

  const onSetValue = (value: string) => {
    if (value === 'all') {
      setTokenList(tokens);
      setSearchText('');
    } else {
      setTokenList(tokens.filter(token => token.network === value));
      setSearchText(value);
    }
  };
  const onPress = token => {
    navigation.navigate('ReceiveSpecificToken', token);
  };
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full flex flex-col  pt-1 ${modeColor}`}>
      <View
        style={tw`w-full  flex-1 flex-col items-center justify-between shadow  rounded-t-3xl ${modeColor}`}>
        <ScrollView style={tw`w-full p-2 mb-5 ${modeColor}`}>
          <View style={tw`w-full flex flex-col items-center`}>
            <View style={tw`w-full`}>
              {listChains?.map((token, index) => {
                const Icon = CHAIN_ICONS[token.network];
                return (
                  <MenuItem
                    key={index}
                    icon={<Icon width={30} height={30} />}
                    iconPadding={''}
                    name={
                      <View style={tw`flex flex-row items-center`}>
                        <Text style={tw`text-xs text-black `}>
                          {token.network.split('_')[0]}
                        </Text>
                        <Text style={tw`text-xs text-gray-500`}>
                          ({token.symbol})
                        </Text>
                      </View>
                    }
                    onPress={() => onPress(token)}
                    value={shortenAddress(token.address)}
                    next={false}
                  />
                );
              })}
            </View>
          </View>
          <View style={tw`my-3`}>
            <Button
              onPress={() => {
                navigation.navigate('AddToken');
              }}>
              Add a token
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReceiveToken;
