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

interface IGrantAccessWeb3Props {
  url: string;
}

export default function GrantAccessWeb3(props: IGrantAccessWeb3Props) {
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
        <Text style={tw`dark:text-white  font-bold text-xl mb-5`}>
          Grant access to your USDT
        </Text>

        <Text style={tw`dark:text-white  text-center mb-5`}>
          By granting permission, you are giving the following contract access
          to your funds.
        </Text>

        <View style={tw`mb-5 flex-row items-center`}>
          <Text>Contract:</Text>
          <TouchableOpacity
            style={tw`flex-row mx-1 rounded-full bg-blue-100 p-1 items-center`}>
            <Image
              style={tw`w-4 h-4 rounded-full`}
              source={{
                uri: getAvatar(walletSelected.index),
              }}
            />
            <View>
              <Text style={tw`dark:text-white   text-sm mx-1`}>
                {ethAddress}
              </Text>
            </View>
            <DuplicateIcon color={primaryColor} />
          </TouchableOpacity>
        </View>
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
        <View
          style={tw`flex-col w-full p-3 mb-3 border border-gray-300 rounded-lg`}>
          <View style={tw`flex-row justify-between w-full mb-2`}>
            <Text style={tw`dark:text-white  font-bold`}>Gas fee estimate</Text>
            <Text style={tw`dark:text-white  font-bold text-blue-500`}>
              0,58$
            </Text>
          </View>
          <View style={tw`flex-row justify-between w-full`}>
            <Text style={tw`dark:text-white  font-bold`}></Text>
            <View style={tw`flex-row`}>
              <Text style={tw`dark:text-white  font-bold`}>Max fee: </Text>
              <Text style={tw`dark:text-white  `}>0.0000496ETH</Text>
            </View>
          </View>
        </View>
        {true && (
          <View
            style={tw`mb-5 rounded-lg bg-red-100 w-full text-center p-1 border-red-700 border`}>
            <Text style={tw`dark:text-white  text-center`}>
              You need an additional 0.0007 ETH to complete this transaction
            </Text>
          </View>
        )}
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="outlined">Cancel</Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button variant="primary">Approve</Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
