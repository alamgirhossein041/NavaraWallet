import {ScrollView} from 'native-base';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Button from '../../components/Button';
import IconScanSeedPhrase from '../../assets/icons/icon-scan-seedphrase.svg';
import {tw} from '../../utils/tailwind';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {LIST_WALLETS} from '../../utils/storage';
import {v4 as uuidv4} from 'uuid';
import toastr from '../../utils/toastr';
import InputText from '../../components/InputText';
import getListChain from '../../utils/getListChain';

import {useDarkMode} from '../../hooks/useDarkMode';
const ImportByPhrase = ({navigation, route}) => {
  const [walletName, setWalletName] = useState('');
  const [listWallets, setListWallets] = useLocalStorage(LIST_WALLETS);
  const [arraySeedPhrase, setArraySeedPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    handleImportWallet();
  };

  const handleImportWallet = () =>
    setTimeout(async () => {
      try {
        const listChains = await getListChain(arraySeedPhrase.split(' '));
       
        setListWallets([
          {
            label: walletName,
            value: walletName,
            id: uuidv4(),
            isSelected: true,
            seedPhrase: arraySeedPhrase.split(' '),
            createdAt: new Date(),
            listChains: listChains,
          },
        ]);
        setLoading(false);
        navigation.navigate('TabsNavigation');
      } catch (error) {
        toastr.error('Invalid seed phrase');
      }
    }, 0);

  const modeColor = useDarkMode();
  return (
    <ScrollView style={tw`mt-5 ${modeColor} `}>
      <View style={tw`h-full `}>
        <InputText
          // styleText={`border border-[${primaryGray}]  text-black w-full rounded-full px-2 py-2 `}
          type="text"
          iconPosition="right"
          label="Recovery phrase : "
          placeholder="e.g Recovery phrase"
          icon={
            <View style={tw`mx-2`}>
              <TouchableOpacity activeOpacity={0.6}>
                <IconScanSeedPhrase width={30} height={30} />
              </TouchableOpacity>
            </View>
          }
          onChangeText={value => {
            setArraySeedPhrase(value);
          }}
          value={arraySeedPhrase}
        />
        <InputText
          type="text"
          label="Wallet nickname : "
          placeholder="e.g Trading"
          onChangeText={value => {
            setWalletName(value);
          }}
          value={walletName}
        />
        <View style={tw`items-center w-full mb-3`}>
          <Button
           loading={loading}
            stringStyle="py-1 px-5 text-white rounded-full "
            onPress={handleClick}
            disabled={walletName === '' || arraySeedPhrase === ''}>
            Connect Wallets
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ImportByPhrase;
