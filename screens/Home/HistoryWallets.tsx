import React, { FunctionComponent } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRecoilValue } from "recoil";
import { selectGray } from "../../configs/theme";
import { historyStateQuery } from "../../data/globalState/history";
import { IHistory } from "../../data/types";
import shortenAddress from "../../utils/shortenAddress";
import { tw } from "../../utils/tailwind";
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
} from "react-native-heroicons/outline";
import dayjs from "dayjs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "native-base";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import { fetchHistory } from "../../data/api/fetchHistory";
import { log } from "util";
var relativeTime = require("dayjs/plugin/relativeTime");
const day: any = dayjs;
day.extend(relativeTime);
const HistoryWallets = () => {
  const address = "0x96d8c4f7839f1da51bfe4d8262d0ab2c842ed02a";
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    "projects",
    async ({ pageParam = 1 }) => {
      const response: any = await axios.all(
        fetchHistory({
          address,
          page: pageParam,
          offset: "50",
          sort: "desc",
        })
      );

      const data: IHistory[] = Array.prototype.concat.apply(
        [],
        response.map((res) => res.data.result)
      );
      return data;
    },
    {
      getNextPageParam: (lastPage: any, pages) => lastPage.nextCursor,
    }
  );

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return data && data.pages[0].length > 0 ? (
    <FlatList
      data={data.pages[0] as any}
      style={tw`px-3 mb-5 mt-2`}
      keyExtractor={(_item, index) => index.toString()}
      renderItem={(dataItem: IHistory | any) => {
        return <ItemHistory {...dataItem.item} address={address} />;
      }}
      onEndReached={loadMore}
    ></FlatList>
  ) : (
    <View></View>
  );
};

interface IItemHistory extends IHistory {
  address: string;
}

const ItemHistory = (props: IItemHistory) => {
  const navigation = useNavigation();
  const isFrom = props.from === props.address;
  const label = props.from === props.address ? "To" : "From";
  const addressFrom = isFrom
    ? shortenAddress(props.to)
    : shortenAddress(props.from);
  const dateTime = day(+props.timeStamp * 1000).fromNow();

  return (
    <TouchableOpacity activeOpacity={0.6}
      onPress={() => navigation.navigate("DetailTransaction" as never)}
      style={tw`bg-[${selectGray}] rounded-full p-3 flex-row justify-between mb-2  `}
    >
      <View>
        <View style={tw`flex-row items-center`}>
          <View style={tw`mr-2`}>
            {isFrom ? (
              <ArrowCircleDownIcon height={30} color={"red"} width={30} />
            ) : (
              <ArrowCircleUpIcon height={30} color={"green"} width={30} />
            )}
          </View>
          <View>
            <Text style={tw`font-bold`}>
              {label} {addressFrom}
            </Text>
            <Text style={tw`text-gray-500`}>{dateTime}</Text>
          </View>
        </View>
        <View style={tw`flex-row`}></View>
      </View>
    </TouchableOpacity>
  );
};
export default HistoryWallets;
