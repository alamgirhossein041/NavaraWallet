import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Actionsheet, useDisclose} from 'native-base';
import Button from '../../components/Button';
import {tw} from '../../utils/tailwind';
import getDomainFromUrl from '../../utils/getDomainFromUrl';
import {LockClosedIcon} from 'react-native-heroicons/solid';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import getAvatar from '../../utils/getAvatar';
import {shortenAddress} from '../../utils/stringsFunction';
import Favicon from './Favicon';
import {DuplicateIcon} from 'react-native-heroicons/outline';
import {primaryColor} from '../../configs/theme';

interface IConnectWalletProps {
  url: string;
}

export default function ConnectWallet(props: IConnectWalletProps) {
  const {isOpen, onOpen, onClose} = useDisclose();
  const {url} = props;
  const walletSelected = useWalletSelected();
  const ethAddress = shortenAddress(walletSelected.data.chains[0].address);
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Favicon domain={getDomainFromUrl(url)} />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="black" size={15} />
          <Text>{getDomainFromUrl(url)}</Text>
        </View>
        <Text style={tw`dark:text-white  mb-5 text-xl font-bold`}>
          Connect to this site
        </Text>

        <View
          style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}>
          <Image
            style={tw`w-8 h-8 rounded-full`}
            source={{
              uri: getAvatar(walletSelected.index),
            }}
          />
          <View style={tw`mx-2`}>
            <Text style={tw`dark:text-white  font-bold`}>
              {walletSelected.data.name || `Wallet ${walletSelected.index + 1}`}{' '}
              ({ethAddress})
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined">Cancel</Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary">Connect</Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
