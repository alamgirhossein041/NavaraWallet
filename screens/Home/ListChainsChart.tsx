import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Cog8ToothIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { primaryColor } from "../../configs/theme";
import updateBalanceForWallet from "../../core/updateBalanceForWallet";
import { ChainWallet } from "../../data/database/entities/chainWallet";
import { Wallet } from "../../data/database/entities/wallet";
import {
  listWalletsState,
  reloadingWallets,
} from "../../data/globalState/listWallets";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { getNetworkEnvironment } from "../../hooks/useBcNetworks";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
import PricesChart from "./PricesChart";
interface IListChains {
  next: string;
  filter?: string[];
  caching?: boolean;
  hideSettings?: boolean;
}

const ListChainsChart = React.memo(
  ({ next, filter, caching = false, hideSettings = false }: IListChains) => {
    const [reloading, setReloading] = useRecoilState(reloadingWallets);
    const walletSelected = useWalletSelected();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const setListWallets = useSetRecoilState(listWalletsState);
    const walletEnvironment = useRecoilValue(walletEnvironmentState);
    const { getListChain } = useWalletsActions();

    const { t } = useTranslation();
    const getBalance = async () => {
      const { data: selectedWallets } = walletSelected;
      try {
        const environment = getNetworkEnvironment(walletEnvironment);
        const currentListChain = await getListChain(selectedWallets.id);

        const listChainsUpdatedBalance = await updateBalanceForWallet(
          currentListChain,
          walletSelected.enabledNetworks,
          environment
        );

        if (listChainsUpdatedBalance) {
          setListWallets((prev) => {
            return prev.map((wallet: Wallet) => {
              if (wallet.id === selectedWallets.id) {
                return {
                  ...wallet,
                  chains: listChainsUpdatedBalance,
                };
              }
              return wallet;
            });
          });
        }
      } catch (error) {
        console.warn(error);
      }
      setReloading(false);
    };

    const filteredListNetworks = useMemo((): ChainWallet[] => {
      const oldListNetworks = walletSelected?.data?.chains || [];
      if (filter?.length > 0 && oldListNetworks?.length > 0) {
        const newListChains = oldListNetworks.filter((chain) =>
          filter.includes(chain.network.toUpperCase())
        );
        return newListChains;
      }

      return oldListNetworks || [];
    }, [filter, walletSelected]);

    useEffect(() => {
      if (!hideSettings) {
        navigation.setOptions({
          headerRight: () => {
            return (
              <TouchableOpacity
                style={tw``}
                onPress={() => navigation.navigate("ManageChains" as never)}
              >
                <Cog8ToothIcon color={primaryColor} />
              </TouchableOpacity>
            );
          },
        });
      }
    }, [navigation, hideSettings]);

    useEffect(() => {
      if (reloading && isFocused) {
        getBalance();
      }
    }, [isFocused, reloading]);

    return (
      <View style={tw`w-full px-4`}>
        {!caching && (
          <View style={tw`flex-row items-center justify-between w-full`}>
            <Text
              style={tw`dark:text-white text-black text-xl font-semibold mb-3`}
            >
              {t("home.assets_by_chains")}
            </Text>
            <TouchableOpacity
              style={tw`flex-row items-center justify-center`}
              onPress={() => navigation.navigate("ManageChains" as never)}
            >
              <Cog8ToothIcon color={primaryColor} height={30} width={30} />
            </TouchableOpacity>
          </View>
        )}
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
      </View>
    );
  }
);

export default ListChainsChart;
