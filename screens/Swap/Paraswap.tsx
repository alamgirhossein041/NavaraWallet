import {ethers} from 'ethers';
import {KeyboardAvoidingView, Skeleton, Switch} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRecoilState} from 'recoil';
import IconSwap from '../../assets/icons/icon-swap.svg';
import Button from '../../components/Button';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import {defaultToken} from '../../configs/defaultValue';
import {primaryColor, primaryGray} from '../../configs/theme';
import {balanceChainsState} from '../../data/globalState/priceTokens';
import {IToken} from '../../data/types';
import {NETWORKS} from '../../enum/bcEnum';
import {useBcNetworks} from '../../hooks/useBcNetworks';
import useEvm from '../../hooks/useEvm';
import {useDarkMode, useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useWallet} from '../../hooks/useWallet';
import {
  getSwapRate,
  getSwapTransaction,
  getTokenBalance,
  IGetSwapRate,
} from '../../module/swap/ParaswapModule';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';
import ModalResult from './ModalResult';
import SelectToken from './SelectToken';
import WalletsCard from './WalletsCard';

const SwapScreen = ({route, navigation}) => {
  const [srcToken, setSrcToken] = useState<IToken>(defaultToken);
  const [destToken, setDestToken] = useState<IToken>(defaultToken);
  const [fromBalance, setFromBalance] = useState<string>('0');
  const [toAmount, setToBalance] = useState<string>('0');
  const [price, setPrice] = useState('1');
  const [gasCost, setGasCost] = useState('0');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [error, setError] = useState('Enter an amount');
  const [loading, setLoading] = useState('');
  const [showingModal, setShowingModal] = useState('');
  const {token: chain} = route?.params;
  const network = chain?.network || NETWORKS.ETHEREUM;
  const privateKey = chain?.privateKey;
  const {NETWORK_CONFIG} = useBcNetworks();
  const config = NETWORK_CONFIG[network];
  const [balanceChains, setBalanceChains] = useRecoilState(balanceChainsState);
  const {getBalanceOf} = useWallet({
    network: network,
    privateKey: privateKey,
  });

  const evm = useEvm(network, chain?.privateKey);
  const wallet: ethers.Wallet = evm.getWallet();
  const provider = evm.provider;
  const Icon = CHAIN_ICONS[chain.network];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={tw`border rounded-full border-[${primaryColor}]`}>
            <Icon width={36} height={36} />
          </View>
        );
      },
    });
  }, [navigation, chain.network, Icon]);

  useEffect(() => {
    if (srcToken.symbol === defaultToken.symbol) {
      setError('Select a from Token');
      return;
    }

    if (destToken.symbol === defaultToken.symbol) {
      setError('Select a to Token');
      return;
    }

    if (Number(fromValue) === 0) {
      setError('Enter an amount');
      return;
    }
    if (Number(fromValue) > Number(fromBalance)) {
      setError('Insufficient Balance');
      return;
    }
    setToValue(
      Number((Number(fromValue) * Number(price))?.toFixed(20)).toString(),
    );
  }, [fromValue, srcToken, destToken, price, fromBalance]);

  const resets = useCallback(() => {
    setFromValue('');
    setToValue('');
    setSrcToken(defaultToken);
    setDestToken(defaultToken);
    setFromBalance('0');
    setToBalance('0');
    setPrice('1');
    setGasCost('0');
  }, []);

  const getBalanceChains = useCallback(async () => {
    try {
      const address = chain?.address;
      const response = await getBalanceOf(address);

      setBalanceChains(oldState => {
        const newState = {...oldState};
        newState[chain?.network] = +response;
        return newState;
      });
    } catch (err) {
      console.error(err);
    }
  }, [chain?.address, chain?.network, getBalanceOf, setBalanceChains]);

  const getBalance = useCallback(
    async (tk: IToken) => {
      setLoading('balance');

      if (tk.symbol === chain?.symbol) {
        setLoading('');
        return balanceChains[chain?.network].toFixed(6).toString();
      }
      const balance = await getTokenBalance(
        provider,
        evm.address,
        tk.address,
        tk.decimals,
      );

      setLoading('');
      return Number(Number(balance).toFixed(6)).toString();
    },
    [chain?.symbol, chain?.network, provider, evm?.address, balanceChains],
  );

  const fetchPrice = useCallback(async () => {
    setLoading('price');

    const params: IGetSwapRate = {
      srcToken: srcToken,
      destToken: destToken,
      srcAmount: '1',
      networkID: config?.chainId,
    };

    const swapRate = await getSwapRate(params);
    if (swapRate === undefined) {
      toastr.error('Can not find swap pool for selected pair', {
        duration: 2000,
      });
      resets();
      return;
    }

    const destAmount = ethers.utils.formatUnits(
      swapRate.destAmount,
      swapRate.destDecimals,
    );
    setPrice(Number(destAmount).toFixed(10).toString());
    // setGasCost(swapRate.gasCostUSD);
    setLoading('');
  }, [srcToken, destToken, config?.chainId, resets]);

  const fetchGasCost = useCallback(async () => {
    setLoading('Gas');

    const params: IGetSwapRate = {
      srcToken: srcToken,
      destToken: destToken,
      srcAmount: fromValue,
      networkID: config?.chainId,
    };

    const swapRate = await getSwapRate(params);
    const _gasCost = ethers.utils.formatEther(swapRate.gasCost);
    const finalFee = _gasCost;
    // const finalFee = (
    //   Number(_gasCost) +
    //   Number(fromValue) * (ParaswapEnum.PARTNER_FEE_BPS / 10000)
    // ).toFixed(10);
    setGasCost(finalFee);

    setLoading('');
  }, [srcToken, destToken, fromValue, config?.chainId]);

  const paraSwap = async () => {
    setLoading('swap');
    try {
      const slippage = 1;
      const params = {
        srcToken,
        destToken,
        srcAmount: fromValue,
        networkID: config?.chainId,
        userAddress: evm.address,
        slippage,
      };

      const resTransaction = await getSwapTransaction(params);
      const transaction = {
        data: resTransaction.data,
        to: resTransaction.to,
        value: resTransaction.value,
        from: resTransaction.from,
        gasPrice: resTransaction.gasPrice,
        gasLimit: ethers.utils.hexlify(1000000),
      };
      if (resTransaction?.error) {
        toastr.error(resTransaction.error, {
          duration: 2000,
        });
        setLoading('');
        return;
      }
      if (transaction) {
        const tradeTransaction = await wallet.sendTransaction(transaction);
        let receipt = await tradeTransaction.wait();
        //Logs the information about the transaction it has been mined.
        if (receipt) {
          console.info(
            `https://${config?.name.toLowerCase()}.etherscan.io/tx/${
              tradeTransaction.hash
            }`,
          );
          if (srcToken.symbol === chain?.symbol) {
            await getBalanceChains();
          } else {
            await getBalance(srcToken);
          }
          await getBalance(destToken);

          setFromValue('');
          setToValue('');
          setGasCost('0');
          setShowingModal('success');
        } else {
          console.error('Error submitting transaction');
          setShowingModal('failed');
        }
      }
    } catch (err) {
      console.error(err);
      setLoading('');
      setShowingModal('failed');
    }
    setLoading('');
  };

  useEffect(() => {
    (async () => {
      if (
        srcToken.symbol !== defaultToken.symbol &&
        destToken.symbol !== defaultToken.symbol
      ) {
        await fetchPrice();
      }
      if (srcToken.symbol !== defaultToken.symbol) {
        const balance = await getBalance(srcToken);
        setFromBalance(balance);
      }
      if (destToken.symbol !== defaultToken.symbol) {
        const balance = await getBalance(destToken);
        setToBalance(balance);
      }
    })();
  }, [srcToken, destToken, getBalance, fetchPrice, fromValue, fetchGasCost]);

  const swapPosition = async () => {
    const fromTokenTemp = destToken;
    setToValue(fromValue);
    setDestToken(srcToken);
    setSrcToken(fromTokenTemp);
  };

  const min = (value1: number, value2: number) => {
    return value1 < value2 ? value1 : value2;
  };

  //text darkmode

  return (
    <View style={tw`h-full  flex flex-col `}>
      <ScrollView style={tw`p-4`}>
        <View style={tw`flex flex-col mt-5`}>
          <WalletsCard address={evm?.address} />
        </View>
        <View style={tw`relative`}>
          <View style={tw`flex px-4 py-8`}>
            <View
              style={tw`flex flex-row items-center justify-between w-full mb-2 `}>
              <View>
                <Text
                  style={tw`dark:text-white  text-base font-light text-gray-500`}>
                  You Send
                </Text>
                <TextInput
                  style={tw`text-xl font-semibold text-gray-700`}
                  placeholder="0.0"
                  placeholderTextColor={primaryGray}
                  value={fromValue}
                  maxLength={20}
                  onChangeText={value => {
                    var reg = /^\d*\.?\d*$/;
                    if (reg.test(value) || value === '') {
                      setFromValue(value);
                    }
                  }}
                  onEndEditing={async () => {
                    setFromValue(
                      min(Number(fromValue), Number(fromBalance)).toString(),
                    );
                    await fetchGasCost();
                    setError('');
                  }}
                />
              </View>
              <View>
                <SelectToken
                  chainId={config?.chainId}
                  value={srcToken.symbol}
                  disabledValue={destToken.symbol}
                  iconUri={srcToken.img}
                  onSetValue={value => {
                    setSrcToken(value);
                  }}
                />
                <Text style={tw`dark:text-white  `}>
                  {fromBalance} {srcToken.symbol} Available
                </Text>
              </View>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-1 mx-4 border-t border-gray-200`} />
            <TouchableOpacity
              underlayColor={primaryGray}
              style={[
                tw`w-8 h-8`,
                {
                  transform: [{rotate: '90deg'}],
                },
              ]}
              onPress={async () => {
                await swapPosition();
              }}>
              <IconSwap width="100%" height="100%" />
            </TouchableOpacity>
            <View style={tw`flex-1 mx-4 border-t border-gray-200`} />
          </View>
          <View style={tw`flex px-4 py-8 rounded-t-2xl`}>
            <View
              style={tw`flex flex-row items-center justify-between w-full mb-2`}>
              <View>
                <Text
                  style={tw`dark:text-white  text-base font-light text-gray-500`}>
                  You Receive
                </Text>
                <Text
                  style={tw` text-${
                    Number(toValue) === 0 && ``
                  } font-semibold text-xl dark:text-white `}>
                  {Number(toValue) === 0 ? '0.0' : toValue}
                </Text>
              </View>
              <View>
                <SelectToken
                  chainId={config?.chainId}
                  value={destToken.symbol}
                  disabledValue={srcToken.symbol}
                  iconUri={destToken.img}
                  onSetValue={value => {
                    setDestToken(value);
                  }}
                />
                <Text style={tw`dark:text-white  text-right`}>
                  {toAmount} {destToken.symbol} Available
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={tw`flex flex-col w-full p-4`}>
          <View style={tw`flex flex-row items-center justify-end w-full py-4`}>
            <View style={tw`flex flex-col items-center w-full`}>
              {loading === 'price' ? (
                <Skeleton rounded="lg" w={'16'} h={'4'} />
              ) : (
                <View style={tw`flex-row items-center`}>
                  <View style={tw`h-2 w-2 rounded-full bg-[${primaryColor}]`} />
                  <Text style={tw`dark:text-white  text-lg text-gray-400`}>
                    {' '}
                    1 {srcToken.symbol} ~{' '}
                    {Number(Number(price).toFixed(6)).toString()}{' '}
                    {destToken.symbol}
                  </Text>
                </View>
              )}
              {/* {loading === 'Gas' ? (
                <Skeleton rounded="lg" w={'32'} h={'4'} />
              ) : (
                 <Text style={tw`dark:text-white  0`}>
                  Fee ~ {Number(gasCost).toString()} {chain?.symbol}
                </Text>
              )} */}
              <View
                style={tw`flex-row items-center justify-around w-full mt-8`}>
                <Text style={tw`dark:text-white  text-xl`}>
                  Optimized Gas fee
                </Text>
                <Switch
                  trackColor={{false: primaryGray, true: primaryColor}}
                  thumbColor="white"
                />
              </View>
              <View
                style={tw`flex-row items-center justify-around w-full mt-8`}>
                <View
                  style={tw`flex-wrap flex-row items-center justify-center`}>
                  <Text
                    style={tw`dark:text-white  text-center flex items-center text-gray-400`}>
                    Click here for
                  </Text>
                  <TouchableOpacity style={tw``}>
                    <Text
                      style={tw`dark:text-white  text-[${primaryColor}] font-semibold`}>
                      Terms & Conditions
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={tw`dark:text-white  text-center flex items-center text-gray-400`}>
                    For this transaction fee will be taken
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        style={tw`absolute bottom-0 w-full px-4 mb-3`}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <Button
          buttonStyle={'rounded-2xl'}
          stringStyle={'font-semibold'}
          loading={loading.length > 0}
          disabled={error.length > 0}
          variant={error === '' ? 'primary' : 'secondary'}
          onPress={() => {
            if (error === '') {
              setShowingModal('confirmation');
            }
          }}>
          {error !== '' ? error : 'Swap'}
        </Button>
      </KeyboardAvoidingView>

      <ModalResult
        showingModal={showingModal}
        setShowingModal={setShowingModal}
        loading={loading}
        fromSymbol={srcToken.symbol}
        toSymbol={destToken.symbol}
        message={
          showingModal === 'confirmation'
            ? `Are you sure you want to swap ${fromValue} ${srcToken.symbol} for ${toValue} ${destToken.symbol}?`
            : `Swapping ${srcToken.symbol} for ${destToken.symbol}...`
        }
        onConfirm={async () => {
          await paraSwap();
        }}
      />
    </View>
  );
};

export default SwapScreen;
