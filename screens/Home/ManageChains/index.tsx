import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Switch, Text, View } from "react-native";
import CollapsibleView from "../../../components/UI/CollapsibleView";
import MenuItem from "../../../components/UI/MenuItem";
import SearchBar from "../../../components/UI/SearchBar";
import { CHAIN_ICONS, TOKEN_SYMBOLS } from "../../../configs/bcNetworks";
import { primaryColor, primaryGray } from "../../../configs/theme";
import { NETWORKS } from "../../../enum/bcEnum";
import { useWalletSelected } from "../../../hooks/useWalletSelected";
import { capitalizeFirstLetter } from "../../../utils/stringsFunction";
import { tw } from "../../../utils/tailwind";
import TokenList from "./TokenList";

const ManageChains = () => {
  const {
    enabledNetworks,
    setEnabledNetworks,
    data: wallets,
  } = useWalletSelected();
  const listNetworks = Object.keys(NETWORKS);
  const [listChainsFiltered, setListChainsFiltered] = useState(listNetworks);

  const handleEnableChain = (chain: string, value: boolean) => {
    if (value) {
      setEnabledNetworks([...enabledNetworks, chain]);
    } else {
      setEnabledNetworks(enabledNetworks.filter((item) => item !== chain));
    }
  };

  const { t } = useTranslation();

  return (
    <ScrollView style={tw`flex flex-col w-full p-3`}>
      <SearchBar
        style={tw`dark:text-white`}
        placeholder={t("search_bar.search")}
        list={listNetworks}
        onListFiltered={(list: string[]) => {
          setListChainsFiltered(list);
        }}
      />
      <View style={tw`flex-col pb-10`}>
        {listChainsFiltered &&
          listChainsFiltered?.map((chain, index) => {
            const isEnable = enabledNetworks && enabledNetworks.includes(chain);
            return (
              <View key={index}>
                <RenderChain
                  chain={chain}
                  index={index}
                  walletId={wallets.id}
                  isEnable={isEnable}
                  handleEnableChain={handleEnableChain}
                />
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
};

const RenderChain = ({
  chain,
  isEnable,
  handleEnableChain,
  walletId,
}: {
  chain: string;
  isEnable: boolean;
  walletId: string;
  handleEnableChain: (chain: string, value: boolean) => void;
}) => {
  const Icon = CHAIN_ICONS[chain];
  const symbol = TOKEN_SYMBOLS[chain];

  const renderHeader = (
    <MenuItem
      icon={Icon ? <Icon width={32} height={32} /> : <></>}
      iconPadding={""}
      disabled
      name={
        <Text style={tw`pl-2 font-medium text-gray-800 dark:text-white `}>
          {capitalizeFirstLetter(chain.split("_")[0])} ({symbol})
        </Text>
      }
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

  return (
    <CollapsibleView
      isCollapsed={true}
      disabled={!isEnable}
      header={renderHeader}
    >
      <TokenList chain={chain} walletId={walletId} />
    </CollapsibleView>
  );
};

export default ManageChains;
