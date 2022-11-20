import React from "react";
import { View } from "react-native";
import Logo from "../../../assets/logo/logo.svg";
import {
  encryptAESWithKeychain,
  getFromKeychain,
} from "../../../core/keychain";
import WalletController from "../../../data/database/controllers/wallet.controller";
import useWalletsActions from "../../../data/globalState/listWallets/listWallets.actions";
import { tw } from "../../../utils/tailwind";
import EnableAppLock from "./EnableAppLock";

export default function EnableAppLockOnBoard({ navigation, route }) {
  const walletController = new WalletController();
  const { updateSpecificDB, get } = useWalletsActions();
  // const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  //background Darkmode

  const handlePress = async () => {
    const password = await getFromKeychain();

    if (password) {
      const firstWallet = get()?.[0];
      if (firstWallet) {
        const seedPhrase = firstWallet.seedPhrase;
        const encryptedSeedPhrase = await encryptAESWithKeychain(seedPhrase);
        const encryptedChains = await Promise.all(
          firstWallet.chains.map(async (chain) => {
            const encryptedPrivateKey = await encryptAESWithKeychain(
              chain.privateKey
            );
            return {
              ...chain,
              privateKey: encryptedPrivateKey,
            };
          })
        );

        const wallet = {
          ...firstWallet,
          seedPhrase: encryptedSeedPhrase,
          chains: encryptedChains,
        };

        await updateSpecificDB(wallet.id, wallet);
      }
    }

    navigation.navigate("EnableBiometric");
  };
  return (
    <View
      style={tw`relative items-center w-full min-h-full px-3 bg-white dark:bg-[#18191A] `}
    >
      <View style={tw`mt-10`}>
        <Logo width={100} height={100} />
      </View>
      <EnableAppLock onSuccess={handlePress} />
    </View>
  );
}
