import {ScrollView} from 'native-base';
import React, {useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import Button from '../../components/Button';
import InputIcon from '../../components/InputIcon';
import {primaryGray} from '../../configs/theme';
import IconScanSeedPhrase from '../../assets/icons/icon-scan-seedphrase.svg';
import {tw} from '../../utils/tailwind';
import {isValidMnemonic} from '@ethersproject/hdnode';
import {generateMnemonics} from '../../utils/mnemonic';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {LIST_WALLETS, SEED_PHRASE} from '../../utils/storage';
import {IWallet} from '../../data/types';
import uuid from 'react-native-uuid';
import toastr from '../../utils/toastr';
import InputText from '../../components/InputText';
import getListChain from '../../utils/getListChain';
import {useDarkMode} from '../../hooks/useDarkMode';
import {useRecoilState} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import {useTextDarkMode} from '../../hooks/useTextDarkMode';
import {useGridDarkMode} from '../../hooks/useGridDarkMode';
const ImportByPhrase = ({navigation, route}) => {
  const [walletName, setWalletName] = useState('');
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const [arraySeedPhrase, setArraySeedPhrase] = useState('');

  const handleImportWallet = async () => {
    try {
      const unSelectOldWallet: IWallet[] =
        listWallets &&
        listWallets.map(wallet => {
          return {...wallet, isSelected: false};
        });
      const listChains = await getListChain(arraySeedPhrase.split(' '));
      setListWallets([
        {
          label: walletName,
          value: walletName,
          id: uuid.v4() as string,
          isSelected: true,
          seedPhrase: arraySeedPhrase.split(' '),
          createdAt: new Date(),
          listChains: listChains,
        },
        ...unSelectOldWallet,
      ]);

      navigation.popToTop();
    } catch (error) {
      toastr.error('Invalid seed phrase');
    }
  };
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    // <ScrollView style={tw`${modeColor} `}>
    <View style={tw`${modeColor} h-full mx-2 flex flex-col justify-between`}>
      <View>
        <InputText
          // styleText={`border border-[${primaryGray}]  text-black w-full rounded-full px-2 py-2 `}
          labelStyle={`${textColor}`}
          style=" "
          type="text"
          // iconPosition="right"
          label="Recovery phrase : "
          placeholder="e.g Recovery phrase"
          // icon={
          //   <View style={tw`mx-2`}>
          //     <TouchableOpacity activeOpacity={0.6} >
          //       <IconScanSeedPhrase width={30} height={30} />
          //     </TouchableOpacity>
          //   </View>
          // }
          onChangeText={value => {
            setArraySeedPhrase(value);
          }}
          value={arraySeedPhrase}
        />
        <InputText
          type="text"
          labelStyle={`${textColor}`}
          label="Wallet nickname : "
          placeholder="e.g Trading"
          onChangeText={value => {
            setWalletName(value);
          }}
          value={walletName}
        />
      </View>

      <View style={tw`mx-5 my-3`}>
        <Button
          stringStyle="py-1 px-5 text-white rounded-full "
          onPress={handleImportWallet}
          disabled={walletName === '' || arraySeedPhrase === ''}>
          Connect Wallet
        </Button>
      </View>
    </View>
    // </ScrollView>
  );
};

export default ImportByPhrase;
