import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CogIcon} from 'react-native-heroicons/outline';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import Loading, {SkeletonFlatList} from '../../components/Loading';
import {primaryColor} from '../../configs/theme';
import {ChainWallet} from '../../data/database/entities/chainWallet';
import {Wallet} from '../../data/database/entities/wallet';
import useDatabase from '../../data/database/useDatabase';
import {
  listWalletsState,
  reloadingWallets,
} from '../../data/globalState/listWallets';
import {walletEnvironmentState} from '../../data/globalState/userData';
import {ENVIRONMENT} from '../../global.config';
import {getNetworkEnvironment} from '../../hooks/useBcNetworks';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {tw} from '../../utils/tailwind';
import updateBalanceForWallet from '../../utils/updateBalanceForWallet';
import PricesChart from './PricesChart';
interface IListChains {
  next: string;
  filter?: string[];
  caching?: boolean;
}

const ListChainsChart = ({next, filter, caching = false}: IListChains) => {
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  const walletSelected = useWalletSelected();
  const navigation = useNavigation();
  const {walletController} = useDatabase();
  const isFocused = useIsFocused();
  const setListWallets = useSetRecoilState(listWalletsState);
  const walletEnvironment = useRecoilValue(walletEnvironmentState);

  const getBalance = async () => {
    const listWalletsDB = await walletController.getWallets();
    const selectedWallets = listWalletsDB[walletSelected.index];
    try {
      const walletsUpdatedBalance = await updateBalanceForWallet(
        selectedWallets,
        selectedWallets.chains,
        walletSelected.enabledNetworks,
        getNetworkEnvironment(walletEnvironment),
      );

      if (walletsUpdatedBalance) {
        setListWallets(prev => {
          return prev.map((wallet: Wallet) => {
            if (wallet.id === walletsUpdatedBalance.id) {
              return walletsUpdatedBalance;
            }
            return wallet;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }

    setReloading(false);
  };

  const filteredListNetworks = useMemo((): ChainWallet[] => {
    const oldListNetworks = walletSelected?.data?.chains || [];
    if (filter?.length > 0 && oldListNetworks?.length > 0) {
      const newListChains = oldListNetworks.filter(chain =>
        filter.includes(chain.network.toUpperCase()),
      );
      return newListChains;
    }

    return oldListNetworks || [];
  }, [filter, walletSelected?.data?.chains]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={tw``}
            onPress={() => navigation.navigate('ManageChains' as never)}>
            <CogIcon color={primaryColor} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    reloading && isFocused && getBalance();
  }, [isFocused, reloading]);

  return (
    <Loading type="skeleton">
      <View style={tw`px-4`}>
        {!caching && (
          <View style={tw`flex-row items-center justify-between w-full`}>
            <Text
              style={tw`dark:text-white text-black text-xl font-semibold mb-3`}>
              Assets by chains
            </Text>
            <TouchableOpacity
              style={tw`flex-row items-center justify-center`}
              onPress={() => navigation.navigate('ManageChains' as never)}>
              <CogIcon color={primaryColor} height={30} width={30} />
            </TouchableOpacity>
          </View>
        )}
        {reloading ? (
          <SkeletonFlatList />
        ) : (
          <View>
            {filteredListNetworks.map((chain: ChainWallet, index) => {
              return (
                <PricesChart
                  key={index}
                  next={next}
                  chain={chain}
                  caching={caching}
                />
              );
            })}
          </View>
        )}
      </View>
    </Loading>
  );
};

export default React.memo(ListChainsChart);