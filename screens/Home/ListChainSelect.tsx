import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ScrollView } from "native-base";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Cog8ToothIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import Loading, { SkeletonFlatList } from "../../components/Skeleton/Loading";
import { primaryColor } from "../../configs/theme";
import updateBalanceForWallet from "../../core/updateBalanceForWallet";
import { ChainWallet } from "../../data/database/entities/chainWallet";
import { Wallet } from "../../data/database/entities/wallet";
import {
  listWalletsState,
  reloadingWallets,
} from "../../data/globalState/listWallets";
import { walletEnvironmentState } from "../../data/globalState/userData";
import { getNetworkEnvironment } from "../../hooks/useBcNetworks";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
import PricesChart from "./PricesChart";
interface IListChains {
  next: string;
  filter?: string[];
  caching?: boolean;
  onClose?: () => void;
}

const ListChainSelect = ({
  next,
  filter,
  caching = false,
}: //   onClose,
IListChains) => {
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  const walletSelected = useWalletSelected();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const setListWallets = useSetRecoilState(listWalletsState);
  const walletEnvironment = useRecoilValue(walletEnvironmentState);
  const { t } = useTranslation();
  const getBalance = async () => {
    const { data: selectedWallets } = walletSelected;
    try {
      const walletsUpdatedBalance = await updateBalanceForWallet(
        selectedWallets,
        selectedWallets.chains,
        walletSelected.enabledNetworks,
        getNetworkEnvironment(walletEnvironment)
      );

      if (walletsUpdatedBalance) {
        setListWallets((prev) => {
          return prev.map((wallet: Wallet) => {
            if (wallet.id === walletsUpdatedBalance.id) {
              return walletsUpdatedBalance;
            }
            return wallet;
          });
        });
      }
    } catch (error) {}

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

  //Hide this because crash app when chain other chains
  //   useEffect(() => {
  //     navigation.setOptions({
  //       headerRight: () => {
  //         return (
  //           <TouchableOpacity
  //             style={tw``}
  //             onPress={() => navigation.navigate("ManageChains" as never)}
  //           >
  //             <Cog8ToothIcon color={primaryColor} />
  //           </TouchableOpacity>
  //         );
  //       },
  //     });
  //   }, [navigation]);

  useEffect(() => {
    reloading && isFocused && getBalance();
  }, [isFocused, reloading]);

  return (
    <Loading type="skeleton">
      <ScrollView>
        <View style={tw`px-4`}>
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
      </ScrollView>
    </Loading>
  );
};

export default React.memo(ListChainSelect);
