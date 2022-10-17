import {useLinkTo} from '@react-navigation/native';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import ReceiveIcon from '../../assets/icons/icon-recevie.svg';
import SendIcon from '../../assets/icons/icon-send.svg';
import SwapIcon from '../../assets/icons/icon-swap.svg';
import {Wallet} from '../../data/database/entities/wallet';
import {
  idWalletSelected,
  listWalletsState,
} from '../../data/globalState/listWallets';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {tw} from '../../utils/tailwind';
import CardWallet from './CardWallet';

const SelectWallets = () => {
  const listWallets = useRecoilValue(listWalletsState);
  const setIndexWalletSelected = useSetRecoilState(idWalletSelected);
  const walletSelected = useWalletSelected();

  const {width: viewportWidth} = Dimensions.get('window');

  // useEffect(() => {
  //   (async () => {
  //     const wallets: any = (await localStorage.get(SELECTED_WALLET)) || [];
  //     setIndexWalletSeleted(wallets);
  //   })();
  // }, []);

  // useEffect(() => {
  //   localStorage.set(SELECTED_WALLET, indexSelectedWallet);
  // }, [indexSelectedWallet]);

  return (
    <View style={tw`relative mb-5 h-55`}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={tw`flex-row flex-1`}>
          <Carousel
            firstItem={walletSelected.index}
            activeOpacity
            layout={'default'}
            data={listWallets}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth - 45}
            renderItem={({item, index}: {item: Wallet; index}) => (
              //
              <CardWallet wallet={item} index={index} />
            )}
            onSnapToItem={index => setIndexWalletSelected(index)}
          />
        </View>
      </SafeAreaView>
      <ButtonActions />
    </View>
  );
};

const ButtonActions = () => {
  const buttons = [
    {
      label: 'Send',
      icon: <SendIcon height={28} width={28} />,
      path: '/ViewListWallet',
    },
    {
      label: 'Receive',
      icon: <ReceiveIcon height={28} width={28} />,
      path: '/ReceiveToken',
    },
    {
      label: 'Swap',
      icon: <SwapIcon height={28} width={28} />,
      path: '/SwapToken',
    },
    // {
    //   label: 'Secirity',
    //   icon: <SearchShieldIcon height={28} width={28} />,
    //   path: '/ReceiveToken',
    // },
  ];
  let linkTo = useLinkTo();
  return (
    <View style={tw`absolute flex-row justify-center w-full -bottom-5`}>
      <View style={tw`flex-row w-3/4 p-2 bg-white shadow z-100 rounded-2xl`}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={button.label}
            onPress={() => linkTo(button.path)}
            style={tw`flex-col items-center justify-center w-1/${buttons.length} `}>
            {button.icon}
            {/* <View style={tw`relative bg-blue-100 rounded-full w-7 h-7`}>
           
          </View> */}
            <Text style={tw`font-bold text-black`}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
export default SelectWallets;
