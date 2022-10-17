import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CogIcon} from 'react-native-heroicons/outline';
import {useRecoilState, useSetRecoilState} from 'recoil';
import Loading, {SkeletonFlatList} from '../../components/Loading';
import {primaryColor} from '../../configs/theme';
import {ChainWallet} from '../../data/database/entities/chainWallet';
import {Wallet} from '../../data/database/entities/wallet';
import useDatabase from '../../data/database/useDatabase';
import {
  listWalletsState,
  reloadingWallets,
} from '../../data/globalState/listWallets';
import {NETWORKS} from '../../enum/bcEnum';
import {getEthereumBalance} from '../../hooks/useEvm';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {tw} from '../../utils/tailwind';
import updateBalanceForWallet from '../../utils/updateBalanceForWallet';
import PricesChart from './PricesChart';
interface IListChains {
  next: string;
  filter?: string[];
  caching?: boolean;
}

// walletSelected => chain fixed => chain Enabled
// output: get balance for chains of walletSelected
const ListChainsChart = ({next, filter, caching = false}: IListChains) => {
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  const walletSelected = useWalletSelected();
  const navigation = useNavigation();
  const {walletController} = useDatabase();
  const isFocused = useIsFocused();
  const setListWallets = useSetRecoilState(listWalletsState);

  const getBalance = async () => {
    const listWalletsDB = await walletController.getWallets();
    const selectedWallets = listWalletsDB[walletSelected.index];
    try {
      const walletsUpdatedBalance = await updateBalanceForWallet(
        selectedWallets,
        selectedWallets.chains,
        walletSelected.enabledNetworks,
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
    (async () => {
      const bal = await getEthereumBalance(
        '0xC9481c83033e84d3ba4e07ECbee5375533857Df6',
        NETWORKS.BINANCE_SMART_CHAIN,
      );
      console.log('====================================');
      console.log(bal);
    })();
  }, [isFocused, reloading]);

  return (
    <Loading type="skeleton">
      <View style={tw`px-4`}>
        {!caching && (
          <View style={tw`flex-row items-center justify-between w-full`}>
            <Text style={tw`text-xl font-semibold mb-3`}>Assets by chains</Text>
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
