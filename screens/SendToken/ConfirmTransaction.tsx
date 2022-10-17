import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {tw} from '../../utils/tailwind';
import {WalletInterface} from '../../data/types';
import {useWallet} from '../../hooks/useWallet';
import toastr from '../../utils/toastr';
import usePopupResult from '../../hooks/usePopupResult';
import Button from '../../components/Button';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import CurrencyFormat from '../../components/CurrencyFormat';
import {Skeleton, Spinner} from 'native-base';
import {primaryColor} from '../../configs/theme';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {
  CheckCircleIcon,
  ShieldExclamationIcon,
} from 'react-native-heroicons/solid';
import SignPinCode from '../../components/SignPinCode';
import {useRecoilValue} from 'recoil';
import {appLockState} from '../../data/globalState/appLock';
import {NETWORKS} from '../../enum/bcEnum';
import FormatToken from '../../components/FormatToken';
import {shortenAddress} from '../../utils/stringsFunction';
export default function ConfirmTransaction({route, navigation}) {
  const appLock = useRecoilValue(appLockState);
  const {seed, receiver, amount, token, isScam} = route.params;
  const walletSelected = useWalletSelected();
  const [loadingBalance, setLoadingBalance] = useState(true);
  const popupResult = usePopupResult();
  const [balance, setBalance] = useState(0);
  const [sending, setSending] = useState(false);
  const [fee, setFee] = useState(0);
  navigation.setOptions({
    title: `Send ${token.symbol}`,
  });
  const Icon = CHAIN_ICONS[token.network];
  const {
    getBalanceOf,
    transfer,
    error,
    near,
    provider,
    estimateGas,
    connection,
  }: WalletInterface = useWallet({
    network: token.network,
    mnemonic: seed,
    privateKey: token.privateKey,
  });

  const getBalance = async address => {
    setLoadingBalance(true);
    const gasFee = await estimateGas({
      amount,
      receiver: address,
    });
    setFee(+gasFee);
    const resultBalance = await getBalanceOf(address);
    setBalance(+resultBalance);
    setLoadingBalance(false);
  };

  useEffect(() => {
    if (token.symbol.toUpperCase() === NETWORKS.NEAR && near) {
      getBalance(token.address);
    } else if (!!provider) {
      provider && getBalance(token.address);
    } else if (token.network === NETWORKS.SOLANA && connection) {
      getBalance(token.address);
    }
  }, [token.address, provider, near, connection]);

  const handleTranfer = () => {
    setSending(true);
    transfer(receiver.address, amount)
      .then(response => {
        navigation.replace('ResultTransaction', {
          card: <CardDetailTransaction />,
          ...route.params,
        });
      })
      .catch(e => {
        popupResult({
          title: 'Transfer failed',
          isOpen: true,
          type: 'error',
        });
      })
      .finally(() => {
        setSending(false);
      });
  };
  const CardDetailTransaction = () => {
    return (
      <View>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text>From: </Text>
          <View style={tw`flex-col items-end `}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[${primaryColor}] mr-1 font-bold`}>
                {walletSelected.data.name ||
                  `Wallet ${walletSelected.index + 1}`}
              </Text>
            </View>
            <Text>{shortenAddress(token.address)}</Text>
          </View>
        </View>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text>To:</Text>
          <View>
            {receiver.domain === receiver.address ? (
              <Text>{shortenAddress(receiver.address)}</Text>
            ) : (
              <View style={tw`flex-col items-end `}>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={tw`${
                      isScam
                        ? 'text-red-500 font-bold'
                        : `text-[${primaryColor}] mr-1 font-bold`
                    } mr-1`}>
                    {receiver.domain.toLowerCase()}
                  </Text>
                  {isScam && (
                    <Text style={tw`font-bold text-red-500`}>(scam)</Text>
                  )}
                  {!isScam ? (
                    <CheckCircleIcon
                      width={20}
                      height={20}
                      color={primaryColor}
                    />
                  ) : (
                    <ShieldExclamationIcon width={20} height={20} color="red" />
                  )}
                </View>
                <Text style={tw`${isScam ? 'text-red-500' : ''}`}>
                  {shortenAddress(receiver.address)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <Text>Amount:</Text>
            {/* <Text style={tw`mx-1 font-bold`}>{`${fee} ${token.symbol}`}</Text> */}
          </View>
          {loadingBalance ? (
            <Skeleton startColor={'gray.200'} rounded="lg" h={'3'} w={'24'} />
          ) : (
            <Text style={tw`font-bold `}>{`${amount} ${token.symbol}`}</Text>
          )}
        </View>
        <View style={tw`flex-row justify-between mb-3`}>
          <View style={tw`flex-row items-center`}>
            <Text>Fee:</Text>
            {/* <Text style={tw`mx-1 font-bold`}>{`${fee} ${token.symbol}`}</Text> */}
          </View>
          {loadingBalance ? (
            <Skeleton startColor={'gray.200'} rounded="lg" h={'3'} w={'24'} />
          ) : (
            <Text style={tw`font-bold `}>{`${fee} ${token.symbol}`}</Text>
          )}
        </View>
        <View style={tw`mb-3 border-b border-gray-300`} />
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-lg font-bold`}>Total:</Text>
          {loadingBalance ? (
            <Skeleton startColor={'gray.400'} rounded="lg" h={'3'} w={'16'} />
          ) : (
            <CurrencyFormat
              value={minusAmount * token.price}
              style="font-bold text-lg"
            />
          )}
        </View>
      </View>
    );
  };

  const minusAmount = token.symbol === NETWORKS.NEAR ? +amount + fee : +amount;
  return (
    <View style={tw`relative h-full px-4 bg-white`}>
      <View style={tw`flex-row justify-center w-full mb-4`}>
        <Icon height={60} width={60} />
      </View>
      {loadingBalance ? (
        <View style={tw`flex-row justify-center mb-5`}>
          <Skeleton startColor={'gray.200'} rounded="lg" h={'8'} w={'32'} />
        </View>
      ) : (
        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-3xl font-bold text-black`}>-</Text>
          <FormatToken
            style="mb-5 text-3xl font-bold text-center text-black"
            value={parseFloat(amount)}
            network={token.symbol}
          />
        </View>
      )}

      {/* <Text style={tw`mb-5 text-3xl font-bold text-center text-black`}>
        {`-${amount} ${token.symbol}`}
      </Text> */}

      <View
        style={[
          tw`w-full p-4 bg-white shadow rounded-2xl ios:border ios:border-gray-100`,
        ]}>
        <CardDetailTransaction />
      </View>
      <Text style={tw`mx-3 my-1 text-xs italic text-right text-gray-400`}>
        {`1 ${token.symbol} = ${token.price}$`}
      </Text>
      {isScam && (
        <View
          style={tw`items-center py-5 my-5 bg-red-200 border border-red-500 rounded-lg`}>
          <Text style={tw`text-lg font-bold text-red-500`}>Scam warning</Text>
          <ShieldExclamationIcon width={30} height={30} color="red" />
        </View>
      )}
      {!loadingBalance ? (
        <View style={tw`absolute w-full bottom-5 left-4 right-4`}>
          {balance < amount ? (
            <View style={tw`p-3 bg-red-100 rounded-lg`}>
              <Text style={tw`text-lg text-center text-red-800`}>
                Not enough balance
              </Text>
            </View>
          ) : (
            <View>
              <Button
                loading={sending}
                stringStyle="text-center text-xl font-medium text-white"
                onPress={handleTranfer}>
                Confirm
              </Button>
              {appLock.transactionSigning && <SignPinCode />}
            </View>
          )}
        </View>
      ) : (
        <Spinner size={60} color={primaryColor} />
      )}
    </View>
  );
}
