import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import { useRecoilState, useRecoilValue } from "recoil";
import CurrencyFormat from "../../components/UI/CurrencyFormat";
import WalletController from "../../data/database/controllers/wallet.controller";
import { Wallet } from "../../data/database/entities/wallet";
import { priceTokenState } from "../../data/globalState/priceTokens";
import showTotalAssets from "../../data/globalState/showTotalAssets";
import { tw } from "../../utils/tailwind";

export default function TotalAssets(props) {
  const walletController = new WalletController();
  const { balanceChains, wallet } = props;
  const priceTokens = useRecoilValue(priceTokenState);
  const [inVisible, setInVisible] = useRecoilState(showTotalAssets);
  const [totalAssets, setTotalAssets] = useState(wallet.totalAssets);

  useEffect(() => {
    try {
      const _totalAssets =
        balanceChains.reduce((total, asset) => {
          return (total +=
            parseFloat(asset.balance) * (priceTokens[asset.network] || 1));
        }, 0) || 0;

      setTotalAssets(+_totalAssets);
      handleUpdateTotalAssetsToDatabase(wallet, _totalAssets);
    } catch (error) {
      console.warn(error);
    }
  }, [priceTokens, balanceChains]);

  const handleUpdateTotalAssetsToDatabase = (
    _wallet: Wallet,
    newTotalAssets: any
  ) => {
    walletController.updateWalletSpecific(_wallet.id, {
      totalAssets: newTotalAssets,
    });
  };

  return (
    <Pressable onPress={() => setInVisible(!inVisible)} style={tw`self-start`}>
      {inVisible ? (
        <View style={tw`flex-row items-center `}>
          <EyeSlashIcon fill={"white"} width={30} height={30} />
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
