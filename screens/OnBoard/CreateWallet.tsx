import { Spinner } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useRecoilState, useSetRecoilState } from "recoil";
import Button from "../../components/UI/Button";
import ViewSeedPhrase from "../../components/UI/ViewSeedPhrase";
import { TOKEN_SYMBOLS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import generateWalletsByNetworks from "../../core/generateWalletsByNetworks";
import API from "../../data/api";
import ChainWalletController from "../../data/database/controllers/chainWallet.controller";
import WalletController from "../../data/database/controllers/wallet.controller";
import {
  idWalletSelected,
  listWalletsState,
  reloadingWallets,
} from "../../data/globalState/listWallets";
import { generateMnemonics, mnemonicToSeed } from "../../utils/mnemonic";
import { ID_WALLET_SELECTED, localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import EnableNotification from "../Notification/EnableNotification";

const CreateWallet = ({ navigation, route }) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const setIndexWalletSelected = useSetRecoilState(idWalletSelected);
  const setReloading = useSetRecoilState(reloadingWallets);
  const walletController = new WalletController();
  const chainWalletController = new ChainWalletController();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [walletId, setWalletId] = useState<string>(null);
  const [seed, setSeed] = useState();
  const routeSeedPhrase = route?.params?.seedPhrase || null;
  const isCreateNewWallet = !routeSeedPhrase;
  const seedPhrase = useMemo(() => {
    return routeSeedPhrase || generateMnemonics();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        const _seed = await mnemonicToSeed(seedPhrase);
        setSeed(_seed);
      })();
    }, 0);
  }, [seedPhrase]);

  const getExitingDomain = async (
    network: string,
    address: string
  ): Promise<string | null> => {
    try {
      const res = (await API.get("/domain/resolver/address", {
        params: {
          input: address,
          network: TOKEN_SYMBOLS[network],
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
        const listWalletNetwork = await generateWalletsByNetworks(
          seed,
          isCreateNewWallet
        );
        const newWallet = await walletController.createWallet(seedPhrase);
        await localStorage.set(ID_WALLET_SELECTED, newWallet.id);
        if (!isCreateNewWallet) {
          const exitingDomain = await getExitingDomain(
            listWalletNetwork[0].network,
            listWalletNetwork[0].address
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
          }
        );

        await Promise.all(createAllChainWallet);

        const newListWallet = await walletController.getWallets();
        const newestWallet = newListWallet.slice(-1);

        setListWallets([...listWallets, ...newestWallet]);
        setWalletId(newWallet.id);
        setIsOpen(true);
        setLoading(false);
      } catch (error: any) {
        toastr.error("An error occurred.");
      }
      setLoading(false);
    }, 0);
  };

  const onClose = () => {
    setIsOpen(false);
    if (listWallets && listWallets.length === 1) {
      navigation.replace("EnableAppLockOnBoard");
    } else {
      setIndexWalletSelected(listWallets.length - 1);
      if (routeSeedPhrase) {
        setReloading(true);
      }
      navigation.replace("TabsNavigation");
    }
  };

  const { t } = useTranslation();

  if (!seed) {
    return (
      <View style={tw`flex-col items-center justify-center flex-1`}>
        <Spinner size={60} color={primaryColor} />
        <Text style={tw`m-3 text-lg font-bold`}>Generating seed phrase</Text>
      </View>
    );
  }

  return (
    <View style={tw`relative flex-1 bg-white dark:bg-[#18191A] `}>
      <ViewSeedPhrase seedPhrase={seedPhrase.split(" ")} />
      <View
        style={tw`absolute w-full px-4 bg-white dark:bg-[#18191A]  bottom-5`}
      >
        <Button
          fullWidth
          loading={loading}
          // disabled={!confirmSecure || !confirmUnderstand}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleCreateWallet}
        >
          {isCreateNewWallet
            ? `${t("import_seedphrase.create_new_wallet")}`
            : `${t("import_seedphrase.import_wallet")}`}
        </Button>
      </View>
      <EnableNotification
        isOpen={isOpen}
        onClose={onClose}
        walletId={walletId}
      />
    </View>
  );
};

export default CreateWallet;
