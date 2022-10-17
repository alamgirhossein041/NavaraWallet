import {Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {tw} from '../../utils/tailwind';
import {useRecoilState, useRecoilValue} from 'recoil';
import {priceTokenState} from '../../data/globalState/priceTokens';
import {NETWORK_COINGEKO_IDS} from '../../configs/bcNetworks';
import CurrencyFormat from '../../components/CurrencyFormat';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {EyeIcon, EyeOffIcon} from 'react-native-heroicons/solid';
import showTotalAssets from '../../data/globalState/showTotalAssets';
import useDatabase from '../../data/database/useDatabase';
import {Wallet} from '../../data/database/entities/wallet';
import {reloadingWallets} from '../../data/globalState/listWallets';
import {Skeleton, Spinner} from 'native-base';

export default function TotalAssets(props) {
  const {walletController} = useDatabase();
  const {balanceChains, wallet} = props;
  const priceTokens = useRecoilValue(priceTokenState);
  const [inVisible, setInVisible] = useRecoilState(showTotalAssets);
  const [totalAssets, setTotalAssets] = useState(wallet.totalAssets);
  useEffect(() => {
    const _totalAssets =
      balanceChains.reduce((total, asset) => {
        return (total +=
          parseFloat(asset.balance) *
          priceTokens[NETWORK_COINGEKO_IDS[asset.network]].usd);
      }, 0) || 0;
    setTotalAssets(+_totalAssets);

    handleUpdateTotalAssetsToDatabase(wallet, _totalAssets);
  }, [priceTokens, balanceChains]);

  const handleUpdateTotalAssetsToDatabase = (wallet: Wallet, totalAssets) => {
    walletController.updateWalletSpecific(wallet.id, {
      totalAssets: totalAssets,
    });
  };
  const [reloading, setReloading] = useRecoilState(reloadingWallets);
  return (
    <TouchableOpacity onPress={() => setInVisible(!inVisible)}>
      {inVisible ? (
        <View style={tw`flex-row items-center `}>
          <EyeOffIcon fill={'white'} width={30} height={30} />
        </View>
      ) : (
        <View>
          {reloading ? (
            <View>
              <Spinner size={30} color={'white'} />
            </View>
          ) : (
            <View style={tw`flex-row items-center`}>
              <CurrencyFormat
                style="text-white font-bold mr-3"
                value={+totalAssets}
                size="3xl"
              />
              <EyeIcon fill={'white'} width={30} height={30} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
