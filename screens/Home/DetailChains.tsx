import { View, Text, ScrollView, Switch } from 'react-native'
import React, { useEffect } from 'react'
import { tw } from '../../utils/tailwind';
import { CHAIN_ICONS } from '../../configs/bcNetworks';
import IconRecevie from '../../assets/icons/icon-recevie.svg';
import IconSend from '../../assets/icons/icon-send.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useLinkTo } from '@react-navigation/native';
import { ButtonProps } from './WalletDashboard';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { useRecoilState, useRecoilValue } from 'recoil';
import { priceTokenState } from '../../data/globalState/priceTokens';
import { primaryGray, primaryColor } from '../../configs/theme';
import { listWalletsState } from '../../data/globalState/listWallets';
import { cloneDeep } from 'lodash';
import HistoryWallets from './HistoryWallets';
export default function DetailChain({ route, navigation }) {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState)
  const { token } = route.params
  const buttonsAction = [
    {
      icon: <IconRecevie />,
      label: 'Receive',
      path: '/ReceiveToken',
      onPress: () => navigation.navigate("ReceiveSpecificToken", token)
    },
    {
      icon: <IconSend />,
      label: 'Send',
      path: '/ViewListWallet',
      onPress: () => navigation.navigate("SendingToken", { token })

    },
  ];
  const Icon = CHAIN_ICONS[token.network];
  const [isEnabled, setIsEnabled] = React.useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: `${token.network.split("_")[0]}`,
      headerRight: () => <Text style={tw`text-gray-400 text-lg flex-row items-center`}>({token.symbol})</Text>
    });
  }, [token])
  const modeColor = useDarkMode();
  //text darkmode
  //grid, shadow darkmode
  return (
    <ScrollView
      // stickyHeaderIndices={[1]}
      // showsVerticalScrollIndicator={false}
      style={tw`${modeColor} h-full w-full`}>
      <Text style={tw`text-center text-xl mb-4 text-gray-400 font-bold`}>{token.price} $</Text>
      <View style={tw`w-full flex-row justify-center mb-4`}>
        <Icon height={60} width={60} />
      </View>
      <Text style={tw`text-center text-3xl mb-4 text-black font-bold`}>{0} {token.symbol}</Text>
      <View style={tw`flex flex-row items-center justify-center mb-10`}>
        {buttonsAction.map((item, index) => (
          <ButtonAction key={index} {...item} />

        ))}
      </View>
      <HistoryWallets />
    </ScrollView>
  )
}
const ButtonAction = ({ icon, label, onPress }: ButtonProps) => {
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`text-center items-center h-18 w-18  mx-3`}>
      <TouchableOpacity activeOpacity={0.6}
        style={tw` shadow ${gridColor} mx-3 mb-3 h-18 w-18 rounded-3xl items-center justify-center`}
        onPress={onPress}>
        {icon}
      </TouchableOpacity>
      <Text style={tw`${textColor}`}>{label}</Text>
    </View>
  );
};