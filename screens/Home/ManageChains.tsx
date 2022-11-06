import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, View } from "react-native";
import MenuItem from "../../components/UI/MenuItem";
import SearchBar from "../../components/UI/SearchBar";
import { CHAIN_ICONS, TOKEN_SYMBOLS } from "../../configs/bcNetworks";
import { primaryColor, primaryGray } from "../../configs/theme";
import { NETWORKS } from "../../enum/bcEnum";
import { useWalletSelected } from "../../hooks/useWalletSelected";
import { tw } from "../../utils/tailwind";

const ManageChains = () => {
  const { enabledNetworks, setEnabledNetworks } = useWalletSelected();
  const listNetworks = Object.keys(NETWORKS);
  const [listChainsFiltered, setListChainsFiltered] = useState(listNetworks);
  //background Darkmode

  const handleEnableChain = (chain: string, value: boolean) => {
    if (value) {
      setEnabledNetworks([...enabledNetworks, chain]);
    } else {
      setEnabledNetworks(enabledNetworks.filter((item) => item !== chain));
    }
  };
  const { t } = useTranslation();
  return (
    <ScrollView style={tw`flex flex-col w-full p-3 `}>
      <SearchBar
        placeholder={t("search_bar.search")}
        list={listNetworks}
        onListFiltered={(list: string[]) => {
          setListChainsFiltered(list);
        }}
      />

      {listChainsFiltered &&
        listChainsFiltered?.map((chain, index) => {
          const Icon = CHAIN_ICONS[chain];
          const symbol = TOKEN_SYMBOLS[chain];
          const isEnable = enabledNetworks && enabledNetworks.includes(chain);
          return (
            <MenuItem
              key={index}
              icon={Icon ? <Icon width={30} height={30} /> : <></>}
              iconPadding={""}
              name={
                <View style={tw`flex flex-col text-left`}>
                  <Text style={tw`dark:text-white  text-xs `}>
                    {chain.split("_")[0]} ({symbol})
                  </Text>
                </View>
              }
              onPress={() => handleEnableChain(chain, !isEnable)}
              value={
                <Switch
                  trackColor={{ false: primaryGray, true: primaryColor }}
                  thumbColor="white"
                  onValueChange={(value) => {
                    handleEnableChain(chain, value);
                  }}
                  value={isEnable}
                />
              }
              next={false}
            />
          );
        })}
    </ScrollView>
  );
};

export default ManageChains;
