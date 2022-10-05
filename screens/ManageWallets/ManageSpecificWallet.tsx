import React, {useEffect, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import WalletIcon from '../../assets/icons/icon-solid-wallet.svg';
import ExclamationIcon from '../../assets/icons/icon-exclamation.svg';
import {Actionsheet, Modal, useDisclose} from 'native-base';
import MenuItem from '../../components/MenuItem';
import {primaryColor, primaryRed} from '../../configs/theme';
import Button from '../../components/Button';
import HeaderScreen from '../../components/HeaderScreen';
import {PencilAltIcon, TableIcon, LinkIcon} from 'react-native-heroicons/solid';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {LIST_WALLETS} from '../../utils/storage';
import {useNavigation} from '@react-navigation/native';
import usePopupResult from '../../hooks/usePopupResult';
import {useDarkMode} from '../../hooks/useDarkMode';
import {useTextDarkMode} from '../../hooks/useTextDarkMode';
import {useGridDarkMode} from '../../hooks/useGridDarkMode';
import {useRecoilState} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import InputText from '../../components/InputText';

const ManageSpecificWallet = ({route, navigation}) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {data, index} = route.params;
  const [wallet, setWallet] = useState<any>(data);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: wallet.label,
    });
  }, [data, showModal]);
  const actions = [
    {
      icon: <PencilAltIcon fill={primaryColor} />,
      name: 'Wallet display name',
      value: <></>,
      onPress: () => {
        setShowModal(true);
      },
    },
    {
      icon: <TableIcon fill={primaryColor} />,
      name: 'Backup passphrase',
      value: (
        <View style={tw` w-4 h-4`}>
          <ExclamationIcon width="100%" height="100%" fill={primaryRed} />
        </View>
      ),
      onPress: () => {},
    },
    {
      icon: <LinkIcon fill={primaryColor} />,
      name: 'Linked domains',
      value: <></>,
      onPress: () => {},
    },
  ];
  const popupResult = usePopupResult();

  const handleChangeNameWallet = () => {
    try {
      const updatedListWallets = listWallets.map((w, id) => {
        if (id === index) {
          w = wallet;
        }
        return w;
      });
      setListWallets(updatedListWallets);
      setShowModal(false);
      popupResult({
        title: 'Successful transfer',
        isOpen: true,
        type: 'success',
      });
    } catch (error) {
      popupResult({
        title: 'Failed transfer',
        isOpen: true,
        type: 'error',
      });
    }
  };

  const onChangeText = text => {
    setWallet({...wallet, label: text, value: text});
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full px-4 flex flex-col  justify-between ${modeColor}`}>
      <View style={tw`w-full`}>
        <View style={tw`w-full `}>
          {actions.map((action, index) => (
            <MenuItem
              key={index}
              icon={action.icon}
              iconPadding={''}
              name={action.name}
              value={action.value}
              onPress={action.onPress}
              next
            />
          ))}
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content
              style={tw`p-6 flex flex-col items-center justify-center rounded-3xl ${gridColor} `}
              maxWidth="400px">
              <InputText
                type="text"
                label="Name wallet "
                placeholder="e.g Trading"
                onChangeText={text => onChangeText(text)}
                value={wallet.label}
              />
              <Button
                buttonStyle="w-3/5 rounded-2xl mt-5"
                onPress={handleChangeNameWallet}>
                <Text style={tw`text-center text-base text-white`}>
                  Change name
                </Text>
              </Button>
            </Modal.Content>
          </Modal>
        </View>
      </View>
      <RemoveWallet indexWallet={index} />
    </View>
  );
};

const RemoveWallet = ({indexWallet}) => {
  const popupResult = usePopupResult();
  const navigation = useNavigation();
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {isOpen, onOpen, onClose} = useDisclose();
  const handleRemoveWallet = () => {
    try {
      const updatedListWallets = listWallets
        .filter(wallet => wallet.value != listWallets[indexWallet].value) // remove wallet
        .map((wallet, index) => {
          // reset default selected current wallet
          if (index === 0) {
            wallet.isSelected = true;
          } else {
            wallet.isSelected = false;
          }
          return wallet;
        });
      setListWallets(updatedListWallets);
      popupResult({
        title: 'Deleted Wallet ',
        isOpen: true,
        type: 'success',
      });
      navigation.goBack();
    } catch (error) {
      popupResult({
        title: 'Deleted Wallet Failed',
        isOpen: true,
        type: 'error',
      });
    }
  };

  return (
    <View style={tw`flex items-center w-full  mb-3`}>
      <Button
        onPress={onOpen}
        buttonStyle={
          listWallets && listWallets.length <= 1 ? `` : `bg-[${primaryRed}]`
        }
        disabled={listWallets && listWallets.length <= 1}>
        Remove Wallet
      </Button>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={handleRemoveWallet}>
            <Text style={tw`text-red-500`}>Remove Wallet</Text>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}>Cancel</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
export default ManageSpecificWallet;
