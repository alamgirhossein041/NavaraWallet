import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import {useState} from 'react';
import ScanQR from './ScanQR';
import {useForm, Controller} from 'react-hook-form';
import {EVM_CHAINS} from '../../configs/bcNetworks';
import {useMutation} from 'react-query';
import API from '../../data/api';
import {ShieldExclamationIcon, XIcon} from 'react-native-heroicons/solid';
import {primaryColor} from '../../configs/theme';
import IconUSA from '../../assets/icons/icon-usa.svg';
import {Actionsheet, CheckCircleIcon, Spinner, useDisclose} from 'native-base';
import {NETWORKS, NETWORK_ENVIRONMENT_ENUM} from '../../enum/bcEnum';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {AxiosError} from 'axios';
import * as WAValidator from 'multicoin-address-validator';
import {useRecoilValue} from 'recoil';
import {balanceChainsState} from '../../data/globalState/priceTokens';
import {validateAccountId} from '../../hooks/useNEAR';
import ActionSheetItem from '../../components/ActionSheetItem';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CurrencyFormat from '../../components/CurrencyFormat';
import {TextInput} from 'react-native';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {
  capitalizeFirstLetter,
  shortenAddress,
} from '../../utils/stringsFunction';
import ShowIconChainSelected from '../../components/ShowIconChainSelected';
import Clipboard from '@react-native-clipboard/clipboard';
import {walletEnvironmentState} from '../../data/globalState/userData';
import {getNetworkEnvironment} from '../../hooks/useBcNetworks';
const validateToken = async (
  address: string,
  network: string,
  env: NETWORK_ENVIRONMENT_ENUM,
): Promise<boolean> => {
  let validatingNetwork = network;
  if (network === NETWORKS.NEAR) {
    return await validateAccountId(address, env);
  } else if (EVM_CHAINS.includes(network)) {
    validatingNetwork = NETWORKS.ETHEREUM;
  }

  try {
    const result: boolean = WAValidator.validate(
      address,
      validatingNetwork.toLowerCase(),
    );
    return result;
  } catch (error) {
    return false;
  }
};
const ViewSendingToken = ({route, navigation}: any) => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const [domainChecked, setDomainChecked] = useState<boolean>(false);
  const [isScam, setIsScam] = useState<boolean>(false);
  const [receiver, setReceiver] = useState<string>();
  const {token, seed} = route.params;
  const balanceChains = useRecoilValue(balanceChainsState);
  const balance = token.balance || 0;
  const [resolveBy, setResolveBy] = useState<string>('');
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const env = getNetworkEnvironment(walletEnvironment);

  navigation.setOptions({
    title: `Send ${token.symbol}`,
  });
  // declare wallet

  // declare form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      receiver: '',
      amount: 0,
    },
  });

  //text darkmode

  //grid, shadow darkmode

  const [err, setErr] = useState({
    domain: false,
    address: false,
  });
  const onSubmit = data => {
    navigation.navigate('ConfirmTransaction', {
      token,
      seed,
      receiver: {
        domain: watch('receiver').trim(),
        address: receiver.trim(),
      },
      amount: +data.amount,
      isScam,
    });

    return;
  };

  const getNetworkType = (network: NETWORKS): string => {
    if (EVM_CHAINS.includes(network)) return NETWORKS.ETHEREUM.toLowerCase();
    return network.toLowerCase();
  };

  const resetErr = () => {
    setErr({
      domain: false,
      address: false,
    });
  };
  // input domain, return address
  const requestGetAddress = useMutation(
    params => {
      const {network, input} = params;
      if (network === NETWORKS.NEAR.toLocaleLowerCase()) {
        return validateAccountId(input, env).then(isValid =>
          isValid
            ? {type: 'near blockchain', address: input, isScam: false}
            : null,
        );
      } else {
        return API.get('/domain/resolver/domain', {
          params,
        });
      }
    },
    {
      onError: (e: AxiosError) => {
        setDomainChecked(false);
        if (watch('receiver').length < 10 || watch('receiver').includes('.')) {
          setErr({
            ...err,
            domain: true,
          });
          return;
        } else {
          resetErr();
          setReceiver(watch('receiver'));
        }
      },
      onSuccess: (data: any) => {
        console.log(data);
        if (!!data) {
          setResolveBy(data.type);
          setReceiver(data.address);
          setDomainChecked(true);
          setIsScam(data.isScam);
        } else {
          setErr({
            address: true,
            domain: false,
          });
        }
      },
    },
  );

  // input address, return domain
  const requestGetDomain = useMutation(
    params => {
      return API.get('/domain/resolver/address', {
        params,
      });
    },
    {
      onError: e => {
        setDomainChecked(false);
        setReceiver(watch('receiver'));
      },
      onSuccess: (data: any) => {
        setValue('receiver', data.domain);
        setDomainChecked(true);
        setIsScam(data.isScam);
        setReceiver(data.address);
      },
    },
  );

  const handleResultQrScan = async (input: string) => {
    setValue('receiver', input);
    if (await validateToken(input, token.network, env)) {
      requestGetDomain.mutate({
        input,
        network: getNetworkType(token.network),
      } as any);
      setValue('receiver', input);
    } else {
      setValue('receiver', input);
      setErr({
        ...err,
        address: true,
      });
    }
  };

  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    setValue('receiver', text);
  };
  const clearState = () => {
    setDomainChecked(false);
    setValue('receiver', '');
    setReceiver('');
    setErr({
      domain: false,
      address: false,
    });
    setIsScam(false);
  };

  const handleOnBlurInputAddress = async () => {
    resetErr();
    if (watch('receiver').includes('.')) {
      requestGetAddress.mutate({
        input: watch('receiver'),
        network: getNetworkType(token.network),
      } as any);
      return;
    }
    if (watch('receiver').length > 3 && watch('receiver').length <= 10) {
      requestGetAddress.mutate({
        input: watch('receiver'),
        network: getNetworkType(token.network),
      } as any);
      return;
    }
    if (watch('receiver').length > 10) {
      const validate = await validateToken(
        watch('receiver'),
        token.network,
        env,
      );
      if (!!validate) {
        requestGetDomain.mutate({
          input: watch('receiver').trim(),
          network: getNetworkType(token.network),
        } as any);
        setReceiver(watch('receiver'));
      } else {
        setErr({...err, address: true});
      }
    }
  };

  return (
    <View style={tw` h-full w-full`}>
      <ScrollView style={tw`px-3`} scrollEnabled={false}>
        {/* <ShowBalanceChain chain={token} /> */}

        <View style={tw`flex-row items-center justify-between m-1`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>Recipient</Text>
          {domainChecked ? (
            <View style={tw`flex-row items-center justify-center `}>
              <Text
                style={tw`${
                  isScam ? 'text-orange-300' : `text-[${primaryColor}]`
                }`}>
                {shortenAddress(receiver)}
              </Text>
            </View>
          ) : (
            <ScanQR onValueScaned={handleResultQrScan} />
          )}
        </View>

        {domainChecked ? (
          <View>
            <View
              style={tw`${
                isScam
                  ? 'border-orange-300 bg-orange-100'
                  : `border-[${primaryColor}]  bg-blue-100`
              } flex flex-row  rounded-xl items-center text-gray-400 p-2 border h-15 `}>
              <View style={tw`w-7/8 tex-white items-center flex-row `}>
                <Text
                  style={tw`${
                    isScam
                      ? 'text-red-500 font-bold'
                      : 'text-blue-500 font-bold'
                  } mr-1`}>
                  {watch('receiver').trim()}
                </Text>
                {isScam && (
                  <Text style={tw`dark:text-white  font-bold text-red-500`}>
                    (scam)
                  </Text>
                )}
                {!isScam ? (
                  <CheckCircleIcon
                    width={30}
                    height={30}
                    color={primaryColor}
                  />
                ) : (
                  <ShieldExclamationIcon width={20} height={20} color="red" />
                )}
              </View>
              <View style={tw`flex flex-row justify-end w-1/8`}>
                <XIcon
                  onPress={clearState}
                  width={25}
                  height={25}
                  fill="black"
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={tw`${
              errors.receiver || err.domain || err.address
                ? 'border-red-500 bg-red-100 dark:bg-red-100 border'
                : ' border-gray-100 dark:border-gray-600'
            } flex flex-row border  rounded-xl items-center  h-15 px-2`}>
            <Controller
              control={control}
              rules={{
                required: true,
                minLength: 3,
              }}
              render={({field: {onChange, value}}) => (
                <TextInput
                  editable={!requestGetAddress.isLoading}
                  autoCapitalize="none"
                  onBlur={handleOnBlurInputAddress}
                  onChangeText={onChange}
                  value={value}
                  style={tw`flex-1 text-black dark:text-white`}
                  placeholder="Address or NNS"
                  autoCompleteType="off"
                  placeholderTextColo={primaryColor}
                />
              )}
              name="receiver"
            />

            <View>
              {watch('receiver') && watch('receiver').length > 0 ? (
                <View>
                  {requestGetAddress.isLoading ? (
                    <Spinner color={primaryColor} />
                  ) : (
                    <XIcon
                      onPress={clearState}
                      width={25}
                      height={25}
                      fill="gray"
                    />
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  onPress={fetchCopiedText}
                  style={tw`dark:bg-gray-800 bg-gray-100  p-1 px-3 rounded-lg`}>
                  <Text style={tw`dark:text-white text-green-500`}>PASTE</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {!domainChecked && errors.receiver && (
          <Text style={tw`text-center text-red-500 `}>
            Receiving address required
          </Text>
        )}

        {err.domain && (
          <Text style={tw` text-center text-red-500 `}>Domain not found</Text>
        )}

        {err.address && (
          <Text style={tw`text-center text-red-500 `}>Invalid address</Text>
        )}

        <View style={tw`flex flex-col my-5`}>
          <View style={tw`flex-row justify-between m-1`}>
            <Text style={tw`dark:text-white  text-lg font-bold`}>
              To Network
            </Text>
            <View style={tw`flex-row items-center`}>
              <ShowIconChainSelected chain={token} />
              <Text style={tw`dark:text-white  font-bold ml-2`}>
                {token.symbol}
              </Text>
            </View>
          </View>
          <Text style={tw`dark:text-white  text-gray-400  mx-1`}>
            Recipient will receive {token.symbol} network as {token.symbol}
          </Text>
        </View>

        <View style={tw`flex flex-row items-center justify-between m-1`}>
          <Text style={tw`dark:text-white  text-lg font-bold`}>Amount</Text>
          <View style={tw`flex-row`}>
            <Text style={tw`dark:text-white  `}>~{balance.toFixed(4)} </Text>
            <Text style={tw`dark:text-white   dark:text-white `}>
              {token.symbol} Available
            </Text>
          </View>
        </View>

        <View
          style={tw`${
            errors.amount
              ? 'border-red-500 bg-red-100 '
              : 'border-gray-100 dark:border-gray-600'
          } flex flex-row border  rounded-xl items-center text-gray-400 h-15 px-2`}>
          <View style={tw``}>
            <ShowIconChainSelected chain={token} />
          </View>
          <Controller
            control={control}
            rules={{
              required: true,
              validate: value => value > 0,
            }}
            render={({field: {onChange, value, onBlur}}) => (
              <TextInput
                value={value !== 0 ? value.toString() : ''}
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                style={tw`w-full p-4  `}
                placeholder="Enter amount"
                // placeholderTextColor={'gray'}
              />
            )}
            name="amount"
          />

          <View style={tw`flex-row ml-auto`}>
            <TouchableOpacity
              onPress={() => setValue('amount', balance)}
              underlayColor="transparent"
              style={tw`dark:bg-gray-800 bg-gray-100  p-1 px-3 rounded-lg`}>
              <Text style={tw`dark:text-white  text-green-500`}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`py-5 mx-2`}>
          <Text style={tw`text-lg`}>≈</Text>
        </View>
        <View
          style={tw`flex flex-row border py-3 px-2 border-gray-100 dark:border-gray-600 h-15  rounded-xl items-center text-gray-400`}>
          <View>
            <IconUSA />
          </View>
          <View>
            <CurrencyFormat
              value={+watch('amount') * token.price}
              style="m-1 italic text-sm"
            />
          </View>
          <View style={tw`ml-auto`}>
            <Text style={tw`dark:text-white  dark:text-white `}>USD</Text>
          </View>
        </View>
      </ScrollView>

      {receiver ? (
        <View style={tw`absolute w-full px-4 bottom-5`}>
          <Button onPress={isScam ? onOpen : handleSubmit(onSubmit)}>
            Continue
          </Button>
        </View>
      ) : (
        <></>
      )}

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw``}>
          <ActionSheetItem onPress={onClose}>
            <Text style={tw`dark:text-white  font-bold text-lg `}>Cancel</Text>
          </ActionSheetItem>
          <ActionSheetItem onPress={handleSubmit(onSubmit)}>
            <View style={tw`flex-row items-center justify-between w-full`}>
              <Text style={tw`dark:text-white  text-lg text-red-500`}>
                Continue transaction
              </Text>
            </View>
          </ActionSheetItem>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

const SendingToken = props => {
  return <ViewSendingToken {...props} />;
};
export default SendingToken;
