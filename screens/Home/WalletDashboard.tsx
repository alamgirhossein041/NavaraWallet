import { useLinkTo } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconRecevie from '../../assets/icons/icon-recevie.svg';
import IconSend from '../../assets/icons/icon-send.svg';
import IconSwap from '../../assets/icons/icon-swap.svg';
import AnimatedScrollView from '../../components/AnimatedScrollView';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import { tw } from '../../utils/tailwind';
import ListWallets from './ListWallets';
import MyDomain from './MyDomain';
import SelectWallets from './SelectWallets';
import Loading from '../../components/Loading';
const BG_COLOR = '#F8FAFC';

export interface ButtonProps {
  icon: JSX.Element;
  label: string;
  path: string;
  onPress?: () => void;
}

const WalletDashboard = () => {

  const buttonsAction: ButtonProps[] = [
    {
      icon: <IconRecevie />,
      label: 'Receive',
      path: '/ReceiveToken',
    },
    {
      icon: <IconSend />,
      label: 'Send',
      path: '/ViewListWallet',
    },
    {
      icon: <IconSwap />,
      label: 'Swap',
      path: '/SwapScreen',
    },
    // {
    //   icon: <IconBuy />,
    //   label: "Buy",
    //   path: "/ViewReceiveToken",
    // },
  ];
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  const insets = useSafeAreaInsets();

  return (
    <View style={tw`h-full ${modeColor} flex  flex-col`}>
      <View style={tw`pt-[${insets.top}] ${modeColor} flex-1 `}>
        <AnimatedScrollView
          animatedHeader={
            <>
              <View style={tw`flex-row ${modeColor} justify-between px-4 `}>
                <View style={tw`w-1/2 `}>
                  <SelectWallets />
                  <MyDomain />
                </View>
              </View>
              <View
                style={tw`flex flex-row ${modeColor} justify-around px-3 mb-5 `}>
                {buttonsAction.map((item, index) => (
                  <ButtonAction key={index} {...item} />
                ))}
              </View>
            </>
          }
          styleBottomSheet>
          <Loading>
            <ListWallets />
          </Loading>

        </AnimatedScrollView>
      </View>
    </View>
  );
};

const ButtonAction = ({ icon, label, path }: ButtonProps) => {
  let linkTo = useLinkTo();
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`text-center  items-center   ${modeColor}`}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={tw` shadow  ${gridColor}  mb-3 h-18 w-18 rounded-3xl items-center justify-center`}
        onPress={() => linkTo(path)}>
        {icon}
      </TouchableOpacity>
      <Text style={tw`${textColor}`}>{label}</Text>
    </View>
  );
};
export { ButtonAction };
export default WalletDashboard;
