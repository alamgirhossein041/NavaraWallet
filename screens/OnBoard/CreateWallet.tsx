import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {useRecoilState, useSetRecoilState} from 'recoil';
import Button from '../../components/Button';
import ViewSeedPhrase from '../../components/ViewSeedPhrase';
import API from '../../data/api';
import useDatabase from '../../data/database/useDatabase';
import {
  idWalletSelected,
  listWalletsState,
  reloadingWallets,
} from '../../data/globalState/listWallets';
import {useBcNetworks} from '../../hooks/useBcNetworks';
import createWalletsByNetworks from '../../utils/createWalletsByNetworks';
import {generateMnemonics} from '../../utils/mnemonic';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';

const CreateWallet = ({navigation, route}) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const setIndexWalletSelected = useSetRecoilState(idWalletSelected);
  const setReloading = useSetRecoilState(reloadingWallets);
  const {NEAR_CONFIG} = useBcNetworks();

  const {walletController, chainWalletController} = useDatabase();
  const [loading, setLoading] = useState(false);
  const routeSeedPhrase = route?.params?.seedPhrase || null;
  const isCreateNewWallet = !routeSeedPhrase;
  const seedPhrase = useMemo(() => {
    return routeSeedPhrase || generateMnemonics();
  }, []);

  const getExitingDomain = async (
    network: string,
    address: string,
  ): Promise<string | null> => {
    try {
      const res = (await API.get('/domain/resolver/address', {
        params: {
          input: address,
          network: network.toLowerCase(),
        },
      })) as any;

      const domain = res?.domain;
      return domain || null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  const handleCreateWallet = () => {
    setLoading(true);
    setTimeout(async () => {
      // handle generate address wallet very slow -> block thread -> using settimeout 0 to temporary fix
      try {
        const listWalletNetwork = await createWalletsByNetworks(
          seedPhrase,
          NEAR_CONFIG.helperUrl,
        );
        const newWallet = await walletController.createWallet(seedPhrase);
        if (!isCreateNewWallet) {
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
        }
        const createAllChainWallet = listWalletNetwork.map(
          (chainWallet: any) => {
            chainWallet.walletId = newWallet.id;
            return chainWalletController.createChainWallet(chainWallet);
          },
        );

        await Promise.all(createAllChainWallet);
        const newListWallet = await walletController.getWallets();
        const newestWallet = newListWallet.slice(-1);
        setListWallets([...listWallets, ...newestWallet]);

        if (listWallets && listWallets.length === 0) {
          navigation.replace('EnableAppLockOnBoard');
        } else {
          setIndexWalletSelected(listWallets.length);
          if (routeSeedPhrase) {
            setReloading(true);
          }
          navigation.replace('TabsNavigation');
        }
      } catch (error: any) {
        toastr.error('An error occurred.');
        console.warn(error);
      }
      setLoading(false);
    }, 0);
  };

  return (
    <View style={tw`relative flex-1 bg-white dark:bg-[#18191A] `}>
      <ViewSeedPhrase seedPhrase={seedPhrase.split(' ')} />
      <View
        style={tw`absolute w-full px-4 bg-white dark:bg-[#18191A]  bottom-5`}>
        <Button
          fullWidth
          loading={loading}
          // disabled={!confirmSecure || !confirmUnderstand}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleCreateWallet}>
          {!isCreateNewWallet ? 'Import Wallet' : 'Create new wallet'}
        </Button>
      </View>
    </View>
  );
};

export default CreateWallet;
