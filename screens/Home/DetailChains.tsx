import {View, Text, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {tw} from '../../utils/tailwind';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import IconRecevie from '../../assets/icons/icon-recevie.svg';
import IconSend from '../../assets/icons/icon-send.svg';
import IconSwap from '../../assets/icons/icon-swap.svg';
import IconHistory from '../../assets/icons/icon-history.svg';
import {ButtonProps} from './WalletDashboard';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import CurrencyFormat from '../../components/CurrencyFormat';
import PressableAnimated from '../../components/PressableAnimated';
import ShowBalanceChain from '../../components/ShowBalanceChain';
import {SupportedSwapChainsEnum} from '../../enum';

export default function DetailChain({route, navigation}) {
  const {token} = route.params;
  const buttonsAction = [
    {
      icon: <IconRecevie />,
      label: 'Receive',
      path: '/ReceiveToken',
      onPress: () => navigation.navigate('ReceiveSpecificToken', {token}),
    },
    {
      icon: <IconSend />,
      label: 'Send',
      path: '/ViewListWallet',
      onPress: () => navigation.navigate('SendingToken', {token}),
    },
    {
      icon: <IconSwap />,
      label: 'Swap',
      path: '/SwapToken',
      onPress: () => navigation.navigate('SwapScreen', {token}),
    },
    {
      icon: <IconHistory />,
      label: 'History',
      path: '/HistoryWallets',
      onPress: () => navigation.navigate('HistoryWallets', {token}),
    },
  ];
  const Icon = CHAIN_ICONS[token.network];
  const [isEnabled, setIsEnabled] = React.useState(true);

  const isSupportedSwap = Object.keys(SupportedSwapChainsEnum).includes(
    token.network,
  );

  useEffect(() => {
    navigation.setOptions({
      title: `${token.network.split('_')[0]}`,
      headerRight: () => (
        <CurrencyFormat
          value={token.price}
          style="text-gray-400 text-sm flex-row items-center"
        />
      ),
    });
  }, [token]);

  const modeColor = useDarkMode();
  return (
    <ScrollView style={tw`${modeColor} h-full w-full `}>
      <ShowBalanceChain chain={token} />
      <View style={tw`flex flex-row items-center justify-center mb-10`}>
        {buttonsAction.map((item, index) => (
          <>
            {!isSupportedSwap && item.label === 'Swap' ? (
              <></>
            ) : (
              <ButtonAction key={index} {...item} />
            )}
          </>
        ))}
      </View>
      {/* <ChartToken/> */}
      {/* <HistoryWallets /> */}
    </ScrollView>
  );
}
const ButtonAction = ({icon, label, onPress}: ButtonProps) => {
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`items-center mx-2 text-center h-18 w-18 `}>
      <PressableAnimated
        activeOpacity={0.6}
        style={tw` shadow ${gridColor} mx-3 mb-3 h-18 w-18 rounded-3xl items-center justify-center`}
        onPress={onPress}>
        {icon}
      </PressableAnimated>
      <Text style={tw`${textColor}`}>{label}</Text>
    </View>
  );
};
