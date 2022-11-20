import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { ChevronRightIcon } from "react-native-heroicons/solid";
import { useQuery } from "react-query";
import { SkeletonFlatList } from "../../components/Skeleton/Loading";
import PressableAnimated from "../../components/UI/PressableAnimated";
import SelectWalletForETH from "../../components/UI/SelectWalletForETH";
import { getDomainOwn } from "../../data/api/navara";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import { IDomain } from "../../data/types";
import diffDays from "../../utils/diffDays";
import getETHAddressFromChains from "../../utils/getETHAddressFromChains";
import { tw } from "../../utils/tailwind";
const dayjs: any = require("dayjs");
export default function ManageDomains({ navigation }) {
  const [walletSelected, setWalletSelected] = useState(0);
  const walletActions = useWalletsActions();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("here");
  }, []);

  const ethAddress = useMemo(() => {
    const listWallets = walletActions.get();
    return getETHAddressFromChains(listWallets[walletSelected].chains);
  }, [walletSelected]);

  const { isLoading, isFetching, data, refetch } = useQuery(
    [`quertDomainOwn-${ethAddress}`],
    async () => getDomainOwn(ethAddress)
  );

  useEffect(() => {
    // refetch when focused screen
    if (!!data && isFocused) {
      refetch();
    }
  }, [isFocused]);

  const domains: IDomain[] = data as any;

  const renderItem = ({ item: data }) => {
    return (
      <Animatable.View animation={"fadeInDown"}>
        <PressableAnimated
          onPress={() => navigation.navigate("DetailDomain", { data })}
          style={tw`flex-row items-center justify-between mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3`}
        >
          <View style={tw`flex-row items-center`}>
            <View style={tw``}>
              <Text
                numberOfLines={1}
                style={tw`font-bold text-[16px] text-gray-700 dark:text-dark`}
              >
                {data.domain}
              </Text>
              <Text style={tw`text-xs text-gray-500`}>
                Expire: {dayjs(data.expired).format("YYYY-MM-DD")} (
                {diffDays(data.expired)} days)
              </Text>
            </View>
          </View>
          <View>
            <ChevronRightIcon color="gray" size={25} />
          </View>
        </PressableAnimated>
      </Animatable.View>
    );
  };
  if (isLoading || isFetching) {
    return (
      <View style={tw`px-4`}>
        <SkeletonFlatList />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 px-4`}>
      {domains.length === 0 ? (
        <View style={tw`items-center justify-center h-full`}>
          <Text style={tw`text-lg font-bold`}>Domain not found</Text>
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          data={domains as any}
          renderItem={renderItem}
        />
      )}
      <Animatable.View
        style={tw`absolute bottom-0 flex-row px-3  right-0 left-0`}
        animation="slideInUp"
      >
        <SelectWalletForETH
          walletSelected={walletSelected}
          setWalletSelected={setWalletSelected}
          countDomain={domains.length}
        />
        {/* <View style={tw`w-1/8 p-2`}>
          <PressableAnimated
            onPress={() =>
              navigation.navigate("CreateDomain", { createMore: true })
            }
            style={tw`justify-center items-center rounded-full  h-15 w-15 bg-[${primaryColor}]`}
          >
            <PlusIcon width={30} height={30} color="white" />
          </PressableAnimated>
        </View> */}
      </Animatable.View>
    </View>
  );
}
