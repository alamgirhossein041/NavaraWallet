import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { EyeIcon, EyeOffIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import { NETWORK_COINGEKO_IDS } from "../../configs/bcNetworks";
import { Wallet } from "../../data/database/entities/wallet";
import useDatabase from "../../data/database/useDatabase";
import { priceTokenState } from "../../data/globalState/priceTokens";
import showTotalAssets from "../../data/globalState/showTotalAssets";
import { tw } from "../../utils/tailwind";

export default function TotalAssets(props) {
  const { walletController } = useDatabase();
  const { balanceChains, wallet } = props;
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

  return (
    <Pressable onPress={() => setInVisible(!inVisible)}>
      {inVisible ? (
        <View style={tw`flex-row items-center `}>
          <EyeOffIcon fill={"white"} width={30} height={30} />
        </View>
      ) : (
        <View style={tw`flex-row items-center`}>
          <CurrencyFormat
            style="text-white font-bold mr-3"
            value={+totalAssets}
            size="3xl"
          />
          <EyeIcon fill={"white"} width={30} height={30} />
        </View>
      )}
    </Pressable>
  );
}
