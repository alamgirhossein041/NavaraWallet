import {useNavigation} from '@react-navigation/native';
import {Actionsheet, useDisclose} from 'native-base';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useRecoilState} from 'recoil';
import useDatabase from '../../data/database/useDatabase';
import {listWalletsState} from '../../data/globalState/listWallets';

import IconMore from '../../assets/icons/icon-more.svg';
import ActionSheetItem from '../../components/ActionSheetItem';
import {tw} from '../../utils/tailwind';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {primaryColor} from '../../configs/theme';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import LoginToCloudModal from '../Backup/LoginToCloudModal';
import {Wallet} from '../../data/database/entities/wallet';

const OptionWallet = ({data, index}) => {
  const {walletController} = useDatabase();

  const [isOpenLoginModal, setIsOpenModal] = useState(false);
  const [walletData, setWallet] = useState<Wallet>(data);

  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {isOpen, onOpen, onClose} = useDisclose();
  const navigation = useNavigation();
  const onWalletPress = index => {
    if (listWallets && listWallets.length > 0) {
      navigation.navigate('DetailWallet', {
        index,
        data: listWallets[index],
      });
    }
    // onOpen()
  };
  const backupWallet = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        navigation.navigate('BackupWallet', {indexSelected: index});
        // await GoogleSignin.signOut();
      } else {
        setIsOpenModal(true);
        if (await GoogleSignin.isSignedIn()) {
          navigation.navigate('BackupWallet', {indexSelected: index});
        }
      }
    } catch (error) {}
  };
  const actionSheetOptionWallet = (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={tw`$`}>
        <ActionSheetItem
          onPress={() => {
            // navigation.navigate('CreateWallet');
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            {/* <PlusIcon
                  width={25}
                  height={25}
                  stroke={primaryColor}
                  style={tw`mr-2`}
                /> */}
            <Text style={tw`text-[${primaryColor}] font-bold`}>
              Change name wallet
            </Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            backupWallet();
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[${primaryColor}] font-bold`}>
              Backup passphrase
            </Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            //
            // navigation.navigate('PrivacySeedPhrase', walletData.seedPhrase)
            // onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[${primaryColor}] font-bold`}>
              Show seedphrase
            </Text>
          </View>
        </ActionSheetItem>
        <ActionSheetItem
          onPress={() => {
            onClose();
          }}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`font-bold text-red-500`}>Delete Wallet</Text>
          </View>
        </ActionSheetItem>
      </Actionsheet.Content>
    </Actionsheet>
  );
  return (
    <View>
      <TouchableOpacity onPress={() => onWalletPress(index)}>
        <IconMore />
      </TouchableOpacity>
      {actionSheetOptionWallet}
      <LoginToCloudModal
        isOpenModal={isOpenLoginModal}
        onClose={async () => {
          if (await GoogleSignin.isSignedIn()) {
            navigation.navigate('BackupWallet', {indexSelected: index});
          }
          setIsOpenModal(false);
        }}
      />
    </View>
  );
};
export default OptionWallet;
