import { AxiosError } from "axios";
import { ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import IconProfile from "../../assets/icons/icon-profile.svg";
import Button from "../../components/UI/Button";
import TextField from "../../components/UI/TextField";
import { EVM_CHAINS } from "../../configs/bcNetworks";
import { primaryColor } from "../../configs/theme";
import API from "../../data/api";
import { Wallet } from "../../data/database/entities/wallet";
import useDatabase from "../../data/database/useDatabase";
import { listWalletsState } from "../../data/globalState/listWallets";
import { NETWORKS } from "../../enum/bcEnum";
import usePopupResult from "../../hooks/usePopupResult";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
const CreateDomain = ({ navigation }) => {
  const { walletController } = useDatabase();
  const [addreses, setAddreses] = useState({});
  const walletSelected = useWalletSelected();
  const popupResult = usePopupResult();
  const { t } = useTranslation();
  const setListWallets = useSetRecoilState(listWalletsState);
  useEffect(() => {
    const listChains = walletSelected.data.chains || [];
    if (!!listChains) {
      let addreses = {};
      listChains.forEach((wallet) => {
        if (EVM_CHAINS.includes(wallet.network)) {
          addreses[NETWORKS.ETHEREUM.toLocaleLowerCase()] = wallet.address;
        } else {
          addreses[wallet.network.toLocaleLowerCase()] = wallet.address;
        }
      });

      setAddreses(addreses);
    }
  }, []);

  const [inputDomain, setInputDomain] = useState({
    value: "",
    error: null,
  });

  const onChangeText = (value) => {
    //
    // const valueInput=value+".nns.one"
    setInputDomain({ error: null, value });
  };

  // const handleReward = () => {
  //   navigation.navigate("Rewards");
  // };

  const registerDomainRequest = useMutation(
    (formData) => {
      return API.post("/domain/register", formData);
    },
    {
      onSuccess: async (data: any) => {
        const newDomain = data.domain;
        if (!newDomain) return;
        const wallet = walletSelected.data;
        wallet.domain = newDomain;
        await walletController.updateWallet(wallet);

        // update domain to state
        setListWallets((listWallets) => {
          return listWallets.map((_wallet: Wallet, index) => {
            if (index === walletSelected.index) {
              return wallet;
            }
            return _wallet;
          });
        });
        popupResult({
          title: `${t("domain.successful")}`,
          isOpen: true,
          type: "success",
        });
        navigation.replace("TabsNavigation");
      },
      onError: (e: AxiosError) => {
        const status = e.response.status;

        if (status === 409) {
          setInputDomain({
            ...inputDomain,
            error: `${t("domain.domain_name_already_in_use")}`,
          });
        } else if (status === 400) {
          setInputDomain({
            ...inputDomain,
            error: `${t("domain.invalid_domain")}`,
          });
        } else {
          toastr.error(
            `${t("domain.error_an_error_occurred_please_try_again_later")}`
          );
        }
      },
    }
  );

  const handleSubmit = async () => {
    if (inputDomain.value.length < 5 || inputDomain.value.length > 60) {
      setInputDomain({
        ...inputDomain,
        error: `${t("domain.domain_name_must_be_between_5_and_60_characters")}`,
      });
      return;
    }
    const result = await walletController.updateWallet({
      ...walletSelected.data,
      domain: inputDomain.value,
    });
    registerDomainRequest.mutate({
      domain: inputDomain.value.toLocaleLowerCase() + ".nns.one",
      ...addreses,
    } as any);
  };

  return (
    <View style={tw`relative h-full bg-white dark:bg-[#18191A] `}>
      {/* <View style={tw`px-4`}>
        <BgNameService height="250" width="100%" />
      </View> */}
      <ScrollView style={tw`px-4`}>
        <TextField
          autoCapitalize="none"
          autoFocus
          type="text"
          value={inputDomain.value}
          onChangeText={onChangeText}
          label={`${t("domain.enter_your_name_service")}`}
          placeholderTextColor={"red"}
          err={inputDomain.error}
        />
        <View
          style={tw`items-center p-3 mx-auto my-10 bg-gray-100 rounded-lg dark:bg-stone-700`}
        >
          <View style={tw`flex flex-row items-center`}>
            <IconProfile width={15} height={15} fill={primaryColor} />
            <Text
              style={tw`dark:text-white text-gray-600 font-bold text-[14px] ml-1`}
            >
              {t("domain.name_service")}
            </Text>
          </View>

          <Text style={tw`text-center text-gray-600 dark:text-white `}>
            {t("domain.description_name_service")}
          </Text>
        </View>
      </ScrollView>
      <View
        style={tw`absolute flex flex-row items-center justify-center w-full px-4 bg-white dark:bg-[#18191A]  bottom-5`}
      >
        <Button
          fullWidth
          loading={registerDomainRequest.isLoading}
          stringStyle="text-center text-base font-medium text-white"
          onPress={handleSubmit}
          // onPress={handleReward}
        >
          {t("domain.get_name_service")}
        </Button>
      </View>
    </View>
  );
};

export default CreateDomain;
