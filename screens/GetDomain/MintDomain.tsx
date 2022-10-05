import {
  Checkbox,
  Image,
  NativeBaseProvider,
  Select,
  Text,
  View,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import IconWalletInput from '../../assets/icons/icon-wallet-input.svg';
import { tw } from '../../utils/tailwind';
import SelectBigSizeOptions, {
  IOption,
} from '../../components/SelectBigSizeOptions';
import { useRecoilState } from 'recoil';
import { walletSelectedState } from '../../data/globalState/userData';
import WalletIcon from '../../assets/icons/icon-near.svg';
import Button from '../../components/Button';
import HeaderScreen from '../../components/HeaderScreen';
import { selectGray } from '../../configs/theme';
import API from '../../data/api';
import toastr from '../../utils/toastr';
import { useMutation } from 'react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { LIST_WALLETS, YOUR_DOMAIN } from '../../utils/storage';
import { EVM_CHAINS } from '../../configs/bcNetworks';
import { NETWORKS } from '../../enum/bcEnum';
import { AxiosError } from 'axios';
import { IWallet } from '../../data/types';
import { listWalletsState } from '../../data/globalState/listWallets';
import { cloneDeep } from 'lodash';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTextDarkMode } from '../../hooks/useTextDarkMode';
import { useGridDarkMode } from '../../hooks/useGridDarkMode';
import InputIcon from '../../components/InputIcon';
const MintDomain = ({ navigation }) => {
  const [addresses, setAddresses] = useState({});
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);

  useEffect(() => {
    const listChains = !!listWallets
      ? listWallets.filter(item => item.isSelected)[0].listChains
      : [];
    if (!!listChains) {
      let addresses = {};
      listChains.forEach(wallet => {
        if (EVM_CHAINS.includes(wallet.network)) {
          addresses[NETWORKS.ETHEREUM.toLocaleLowerCase()] = wallet.address;
        } else {
          addresses[wallet.network.toLocaleLowerCase()] = wallet.address;
        }
      });
      setAddresses(addresses);
    }
  }, [listWallets]);

  const [yourDomain, setYourDomain] = useLocalStorage(YOUR_DOMAIN);

  const [inputDomain, setInputDomain] = useState({
    value: '',
    error: null,
  });

  const onChangeText = value => {
    setInputDomain({ error: null, value });
  };

  const registerDomainRequest = useMutation(
    formData => {
      return API.post('/domain/register', formData);
    },
    {
      onSuccess: data => {
        setListWallets(
          cloneDeep(listWallets).map((wallet: IWallet) => {
            if (wallet.isSelected) {
              wallet.domain = inputDomain.value;
              return wallet;
            }
            return wallet;
          }),
        );
        navigation.navigate('MintingDomain');
      },
      onError: (e: AxiosError) => {
        const status = e.response.status;
        if (status === 400) {
          setInputDomain({ ...inputDomain, error: 'Domain name already in use' });
        }
      },
    },
  );

  const handleSubmit = () => {
    registerDomainRequest.mutate({
      domain: inputDomain.value,
      ...addresses,
    } as any);
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <View style={tw`h-full  ${modeColor} flex flex-col justify-center`}>
      <View
        style={tw`px-5  flex py-3 items-center ${gridColor} rounded-full  text-gray-400 `}>
        <InputIcon
          style=" w-full"
          styleText="text-[#11CABE]"
          type="text"
          value={inputDomain.value}
          onChangeText={onChangeText}
          title=" Mint your free domain:"
          placeholder="domain.dnet."
        />
        <Text style={tw`text-red-500 text-center`}>{inputDomain.error}</Text>
        {/* <TextInput
            style={tw`w-full h-10 `}
            placeholder="domain.dnet.io"
            onChangeText={onChangeText}
            value={inputDomain.value}
          /> */}
      </View>

      <View style={tw`flex items-center w-full bottom-3 absolute w-full px-5`}>
        <Button
          loading={registerDomainRequest.isLoading}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleSubmit}>
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default MintDomain;
