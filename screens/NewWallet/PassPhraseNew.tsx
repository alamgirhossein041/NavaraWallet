import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import IconCopy from '../../assets/icons/icon-copy.svg';
import { tw } from '../../utils/tailwind';
import { bgGray } from '../../configs/theme';
import { IWallet } from '../../data/types';
import getListChain from '../../utils/getListChain';
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from '../../utils/toastr';
import usePopupResult from '../../hooks/usePopupResult';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../../data/globalState/listWallets';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import uuid from 'react-native-uuid';
import { defaultEnabledNetworks } from '../../enum/bcEnum';
const PassPhraseNew = ({ navigation, route }) => {
  const [showModal, setShowModal] = useState(false);
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const [loading, setLoading] = useState(false);
  const newWallet: IWallet = route.params;
  const popupResult = usePopupResult();
  const handleCreateNewWallet = () => {
    setLoading(true);
    setTimeout(async () => {
      try {

        const unSelectedOldWallet: IWallet[] =
          listWallets &&
          listWallets.map(wallet => {
            return {
              ...wallet,
              isSelected: false,
            };
          });
        const listChains = await getListChain(newWallet.seedPhrase);
        newWallet.listChains = listChains.map((chain) => {
          if (defaultEnabledNetworks.some(network => network === chain.network)) {
            return { ...chain, isEnable: true }
          }
          return chain
        });
        newWallet.id = uuid.v4() as string;
        setListWallets([newWallet, ...unSelectedOldWallet]);
        navigation.popToTop();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }, 0)
  };
  const copyToClipboard = () => {
    Clipboard.setString(newWallet.seedPhrase.join(' '));
    toastr.success('Copied seedPhrase');
  };

  const [confirmSecure, setConfirmSecure] = useState(false);
  const [confirmUnderstand, setConfirmUnderStand] = useState(false);
  //background Darkmode
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <ScrollView style={tw`bg-[${bgGray}] `}>
      <View style={tw`p-5 android:pt-2 ${modeColor}  py-[10%]`}>
        <View style={tw`flex flex-row items-center justify-between py-3`}>
          <Text style={tw`text-lg border-[#F69D69] border-b-2 w-38 py-3 ${textColor}`}>
            Back up manually
          </Text>
          <TouchableOpacity activeOpacity={0.6} onPress={copyToClipboard} style={tw`text-red-500`}>
            <IconCopy />
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-wrap flex-row items-center`}>
          {newWallet.seedPhrase?.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                key={index}
                style={tw`flex flex-row items-center  bg-white py-2  rounded-full my-2 w-26 shadow-sm mx-auto p-2`}>
                <View
                  style={tw`w-10 h-10 rounded-full flex justify-center items-center bg-[#11CABE]  mr-auto `}>
                  <Text style={tw`text-white font-bold `}>{index + 1}</Text>
                </View>
                <Text style={tw`mr-auto `}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={tw`flex flex-row items-center justify-between p-3 mt-5`}>
          <CheckBox
            check={confirmSecure}
            onPress={() => setConfirmSecure(!confirmSecure)}
            label="I have backed up the passphrase to a secure location"
          />
        </View>
        <View style={tw`flex flex-row items-center  p-3`}>
          <CheckBox
            check={confirmUnderstand}
            onPress={() => setConfirmUnderStand(!confirmUnderstand)}
            label="I understand that ....."
          />
        </View>

        <View style={tw`flex items-center p-3  px-4`}>
          <Button
            loading={loading}
            stringStyle="text-center text-base font-medium text-white"
            onPress={handleCreateNewWallet}
            disabled={!confirmSecure || !confirmUnderstand}>
            Create new wallet
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default PassPhraseNew;
