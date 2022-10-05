import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import React from 'react';
import IconCopy from '../../assets/icons/icon-copy.svg';
import { tw } from '../../utils/tailwind';
import { IWallet } from '../../data/types';
import toastr from '../../utils/toastr';
import getListChain from '../../utils/getListChain';
import Clipboard from '@react-native-clipboard/clipboard';
import CheckBox from '../../components/CheckBox';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../../data/globalState/listWallets';
import { useDarkMode } from '../../hooks/useDarkMode';
import uuid from 'react-native-uuid';
import { defaultEnabledNetworks } from '../../enum/bcEnum';
const PassPhrase = ({ navigation, route }: any) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const newWallet: IWallet = route.params;
  if (!newWallet) {
    navigation.goBack();
    toastr.error('Wallet ID is not valid');
    return <View></View>;
  }
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    handleCreateWallet();
  };
  const handleCreateWallet = () => {
    setTimeout(async () => {
      try {
        const listChains = await getListChain(newWallet.seedPhrase);
        newWallet.listChains = listChains.map((chain) => {
          if (defaultEnabledNetworks.some(network => network === chain.network)) {
            return { ...chain, isEnable: true }
          }
          return chain
        });
        newWallet.id = uuid.v4() as string;
        setListWallets([newWallet]);
        setLoading(false);
        navigation.replace('EnableCloudBackup');
      } catch (error) {
        console.log(error);
        toastr.error('Er');
      }
    }, 0);
  };

  const copyToClipboard = () => {
    Clipboard.setString(newWallet.seedPhrase.join(' '));
    toastr.success('Copied');
  };

  const [confirmSecure, setConfirmSecure] = useState(false);
  const [confirmUnderstand, setConfirmUnderStand] = useState(false);
  const modeColor = useDarkMode();
  return (
    // <ScrollView style={tw`${modeColor} `}>
    <View
      style={tw`p-5 android:pt-2 h-full ${modeColor} flex flex-col justify-between `}>
      <View>
        <View style={tw`flex flex-row items-center justify-between py-3`}>
          <Text style={tw`text-lg border-[#F69D69] border-b-2 w-38 py-3`}>
            Back up manually
          </Text>
          <TouchableOpacity activeOpacity={0.6} onPress={copyToClipboard}>
            <IconCopy />
          </TouchableOpacity>
        </View>
        <View style={tw`flex flex-wrap flex-row items-center`}>
          {newWallet &&
            newWallet.seedPhrase.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={tw`flex flex-row items-center  bg-white py-2  rounded-full my-2 w-28 shadow-sm mx-auto p-2`}>
                  <View
                    style={tw`w-8 h-8 rounded-full flex justify-center items-center bg-[#11CABE]  mr-auto `}>
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
      </View>

      <View style={tw`flex items-center p-3  px-4`}>
        <Button
          loading={loading}
          stringStyle="text-center text-lg font-medium text-white"
          onPress={handleClick}
          disabled={!confirmSecure || !confirmUnderstand}>
          Create Wallet
        </Button>
      </View>
    </View>
    // </ScrollView>
  );
};

export default PassPhrase;
