import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import API from '../../data/api';
import {useMutation} from 'react-query';
import {EVM_CHAINS} from '../../configs/bcNetworks';
import {NETWORKS} from '../../enum/bcEnum';
import {AxiosError} from 'axios';
import TextField from '../../components/TextField';
import usePopupResult from '../../hooks/usePopupResult';
import {ScrollView} from 'native-base';
import toastr from '../../utils/toastr';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import useDatabase from '../../data/database/useDatabase';
import IconProfile from '../../assets/icons/icon-profile.svg';
import BgNameService from '../../assets/bg-name-service.svg';
import {primaryColor} from '../../configs/theme';
const CreateDomain = ({navigation}) => {
  const {walletController} = useDatabase();
  const [addreses, setAddreses] = useState({});
  const walletSelected = useWalletSelected();
  const popupResult = usePopupResult();
  useEffect(() => {
    const listChains = walletSelected.data.chains || [];
    if (!!listChains) {
      let addreses = {};
      listChains.forEach(wallet => {
        if (EVM_CHAINS.includes(wallet.network)) {
          addreses[NETWORKS.ETHEREUM.toLocaleLowerCase()] = wallet.address;
        } else {
          addreses[wallet.network.toLocaleLowerCase()] = wallet.address;
        }
      });

      setAddreses(addreses);
    }
  }, []);

  const [inputDomain, setInputDomain] = useState({
    value: '',
    error: null,
  });

  const onChangeText = value => {
    // console.log(value+".nns.one")
    // const valueInput=value+".nns.one"
    setInputDomain({error: null, value});
  };

  const handleReward = () => {
    navigation.navigate('Rewards');
  };

  const registerDomainRequest = useMutation(
    formData => {
      return API.post('/domain/register', formData);
    },
    {
      onSuccess: async (data: any) => {
        const newDomain = data.domain;
        if (!newDomain) return;
        const wallet = walletSelected.data;
        wallet.domain = newDomain;
        await walletController.updateWallet(wallet);
        popupResult({
          title: 'Successful',
          isOpen: true,
          type: 'success',
        });
        navigation.replace('TabsNavigation');
      },
      onError: (e: AxiosError) => {
        const status = e.response.status;

        if (status === 409) {
          setInputDomain({...inputDomain, error: 'Domain name already in use'});
        } else if (status === 400) {
          setInputDomain({...inputDomain, error: 'Invalid domain'});
        } else {
          toastr.error('Error! An error occurred. Please try again later');
        }
      },
    },
  );

  const handleSubmit = async () => {
    if (inputDomain.value.length < 5 || inputDomain.value.length > 10) {
      setInputDomain({
        ...inputDomain,
        error: 'Domain name must be between 5 and 10 characters',
      });
      return;
    }
    const result = await walletController.updateWallet({
      ...walletSelected.data,
      domain: inputDomain.value,
    });
    registerDomainRequest.mutate({
      domain: inputDomain.value.toLocaleLowerCase() + '.nns.one',
      ...addreses,
    } as any);
  };

  return (
    <View style={tw`relative h-full bg-white`}>
      <View style={tw`px-4`}>
        <BgNameService height="250" width="100%" />
      </View>
      <ScrollView style={tw`px-4`}>
        <TextField
          autoCapitalize="none"
          autoFocus
          type="text"
          value={inputDomain.value}
          onChangeText={onChangeText}
          label="Enter your name service"
          err={inputDomain.error}
        />
        <View
          style={tw`mx-auto my-10 items-center bg-[#F0F9FF] p-3 rounded-lg`}>
          <View style={tw`flex flex-row`}>
            <IconProfile width={15} height={15} fill={primaryColor} />
            <Text style={tw`font-bold text-[14px] ml-1`}>Name Service</Text>
          </View>

          <Text style={tw`text-center `}>
            Write down or copy these words in the right order and save them
            somewhere safe. Please dont screenshot or paste clipboard to other
            apps that you can’t trust. Many app haves ability to read your seed
            phrase from that.
          </Text>
        </View>
      </ScrollView>
      <View
        style={tw`absolute flex flex-row items-center justify-center w-full px-4 bg-white bottom-5`}>
        <Button
          fullWidth
          loading={registerDomainRequest.isLoading}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleSubmit}
          // onPress={handleReward}
        >
          Get name service
        </Button>
      </View>
    </View>
  );
};

export default CreateDomain;
