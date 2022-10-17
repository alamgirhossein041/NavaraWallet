import {Actionsheet, useDisclose} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconMore from '../../assets/icons/icon-more.svg';
import {PlusIcon} from 'react-native-heroicons/outline';
import {CreditCardIcon} from 'react-native-heroicons/solid';
import {useRecoilState} from 'recoil';
import ActionSheetItem from '../../components/ActionSheetItem';
import MenuItem from '../../components/MenuItem';
import {primaryColor} from '../../configs/theme';
import useDatabase from '../../data/database/useDatabase';
import {listWalletsState} from '../../data/globalState/listWallets';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import WalletAdd from '../../assets/icons/icon-wallet-add.svg';
import {tw} from '../../utils/tailwind';
import MyDomain from '../Home/MyDomain';
import CardWallet from '../Home/CardWallet';
import {useNavigation} from '@react-navigation/native';
import OptionWallet from './OptionWallet';
import IconCloudRestore from '../../assets/icons/icon-folder-cloud.svg';
import IconImport from '../../assets/icons/icon-folder-add.svg';

const Wallets = ({navigation}) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={onOpen}>
        <WalletAdd width={30} height={30} />
      </TouchableOpacity>
    ),
  });
  const onWalletPress = index => {
    if (listWallets && listWallets.length > 0) {
      navigation.navigate('DetailWallet', {
        index,
        data: listWallets[index],
      });
    }
    // onOpen()
  };
  const {walletController} = useDatabase();

  const [listWallets, setListWallets] = useRecoilState(listWalletsState);

  // const handleOpenCreateWallet=()=>{
  //   isOpen()
  // }

  const gridColor = useGridDarkMode();
  const actionSheetCreateWallet = (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={tw`${gridColor}`}>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate('CreateWallet');
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <PlusIcon
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw` font-bold`}>Create a new wallet</Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate('ImportWallet');
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <IconImport
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw` font-bold`}>Import wallet</Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            navigation.navigate('SelectFile');
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <IconCloudRestore
              width={25}
              height={25}
              stroke={primaryColor}
              style={tw`mr-2`}
            />
            <Text style={tw` font-bold`}>Restore wallet from cloud</Text>
          </View>
        </ActionSheetItem>
      </Actionsheet.Content>
    </Actionsheet>
  );

  return (
    <ScrollView style={tw`bg-white`}>
      <View style={tw` flex flex-col justify-between`}>
        <View>
          {/* <HeaderScreen title="Manage Wallets" showBack /> */}
          {/* <Text style={tw`text-base mt-10`}>Choose network (${enabledNetwork.length}/${networks.length})</Text> */}
          <View style={tw``}>
            {listWallets &&
              listWallets.map((wallet, index) => (
                //
                <View
                  style={tw`w-full ${
                    index % 2 ? 'bg-gray-100 rounded-lg' : ''
                  }`}>
                  <View style={tw`flex flex-row mx-10 py-3`}>
                    <Text style={tw`font-bold `}>
                      {wallet.name === null
                        ? `Wallet ${index + 1}`
                        : `${wallet.name}`}
                    </Text>
                    <View style={tw`ml-auto`}>
                      {/* <OptionWallet index={index} data={wallet} /> */}
                      <TouchableOpacity onPress={() => onWalletPress(index)}>
                        <IconMore />
                      </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity onPress={() => onWalletPress(index)} style={tw`ml-auto`}><OptionWallet /></TouchableOpacity> */}
                  </View>

                  <View style={tw`m-3`}>
                    <CardWallet wallet={wallet} index={index} />
                  </View>
                </View>
              ))}
          </View>
        </View>
        {/* ActionSheet create walllet */}
        {actionSheetCreateWallet}
      </View>
    </ScrollView>
  );
};

export default Wallets;
