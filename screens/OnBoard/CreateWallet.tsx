import React, {useMemo, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import {generateMnemonics} from '../../utils/mnemonic';
import toastr from '../../utils/toastr';
import ViewSeedPhrase from '../../components/ViewSeedPhrase';
import createWalletsByNetworks from '../../utils/createWalletsByNetworks';
import useDatabase from '../../data/database/useDatabase';
import {useRecoilState} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import axios from 'axios';
import {apiUrl} from '../../configs/apiUrl';
import {ScrollView} from 'native-base';

const CreateWallet = ({navigation, route}) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {walletController, chainWalletController} = useDatabase();
  const [loading, setLoading] = useState(false);
  const routeSeedPhrase = route?.params?.seedPhrase || null;
  const seedPhrase = useMemo(() => {
    return routeSeedPhrase || generateMnemonics();
  }, []);

  const getExitingDomain = async (
    network: string,
    address: string,
  ): Promise<string | null> => {
    try {
      const res = await axios.get(`${apiUrl}/domain/resolver/address`, {
        params: {
          input: address,
          network: network.toLowerCase(),
        },
      });
      const domain = res?.data?.domain;
      return domain || null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  const handleCreateWallet = () => {
    setLoading(true);
    setTimeout(async () => {
      // handle generate address wallet very slow -> block thread -> using settimeout 0 to tempolary fix
      try {
        const listWalletNetwork = await createWalletsByNetworks(seedPhrase);
        const newWallet = await walletController.createWallet(seedPhrase);
        const exitingDomain = await getExitingDomain(
          listWalletNetwork[0].network,
          listWalletNetwork[0].address,
        );
        if (exitingDomain) {
          await walletController.updateWallet({
            ...newWallet,
            domain: exitingDomain,
          });
        }
        const createAllChainWallet = listWalletNetwork.map(
          (chainWallet: any) => {
            chainWallet.walletId = newWallet.id;
            return chainWalletController.createChainWallet(chainWallet);
          },
        );

        await Promise.all(createAllChainWallet);
        const newListWallet = await walletController.getWallets();

        setListWallets(newListWallet);
        navigation.replace(
          listWallets && listWallets.length === 0
            ? 'EnableAppLockOnBoard'
            : 'TabsNavigation',
        );
      } catch (error: any) {
        toastr.error('An error occurred.');
        console.warn(error);
      }
      setLoading(false);
    }, 0);
  };

  return (
    <View style={tw`relative flex-1 bg-white`}>
      <ViewSeedPhrase seedPhrase={seedPhrase.split(' ')} />
      <View style={tw`absolute w-full px-4 bg-white bottom-5`}>
        <Button
          fullWidth
          loading={loading}
          // disabled={!confirmSecure || !confirmUnderstand}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleCreateWallet}>
          {routeSeedPhrase ? 'Import Wallet' : 'Create new wallet'}
        </Button>
      </View>
    </View>
  );
};

export default CreateWallet;
