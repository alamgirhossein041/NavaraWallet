import dayjs from "dayjs";
import { Actionsheet, ScrollView, useDisclose } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ShieldCheckIcon } from "react-native-heroicons/solid";
import { useInfiniteQuery } from "react-query";
import IconCheckOK from "../../assets/icons/icon-checkmark.svg";
import IconHighRisk from "../../assets/icons/icon-high-risk.svg";
import IconNoData from "../../assets/icons/icon-no-data-amico.svg";
import ScreenLoading from "../../components/Skeleton/ScreenLoading";
import { CHAIN_ICONS } from "../../configs/bcNetworks";
import { fetchHistory } from "../../data/api/fetchHistory";
import { IHistory } from "../../data/types";
import { shortenAddressForHistory } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
var relativeTime = require("dayjs/plugin/relativeTime");
const day: any = dayjs;
day.extend(relativeTime);
const HistoryWallets = (props) => {
  const { route } = props;

  const symbol = route.params.token.symbol;
  const address = route.params.token.address;
  const network = route.params.token.network;

  const [loading, setLoading] = useState(true);
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
    address,
    async ({ pageParam = 1 }) => {
      const response: any = await fetchHistory(network, {
        address,
      });

      const data: IHistory[] = Array.prototype.concat.apply(
        [],
        response.map((res) => res)
      );
      setLoading(false);
      return data;
    },
    {
      getNextPageParam: (lastPage: any, pages) => lastPage.nextCursor,
    }
  );
  // start groupByArray
  const groups = data?.pages[0].reduce((groups, item) => {
    const date = day(+item.timeStamp * 1000).format("MMMM D, YYYY ");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const groupArrays =
    data &&
    Object.keys(groups).map((date) => {
      return groups[date];
    });
  // end groupByArray
  return data && data.pages[0].length > 0 ? (
    <View>
      <View style={tw`bg-white dark:bg-[#18191A] `}>
        <Text style={tw`dark:text-white   text-center font-bold`}>
          {symbol}
        </Text>
      </View>
      <ScrollView style={tw`bg-white dark:bg-[#18191A]  h-full`}>
        <View style={tw`mx-3`}>
          {groupArrays.map((itemGroup) => {
            const dateTime = day(+itemGroup[0].timeStamp * 1000).format(
              "DD-MM-YYYY"
            );
            return (
              data &&
              data.pages[0].length > 0 && (
                <View style={tw`mb-10`}>
                  <Text style={tw`dark:text-white  m-2 font-bold`}>
                    {dateTime}
                  </Text>

                  {/* map history to history item  */}
                  {itemGroup &&
                    itemGroup?.map((historyItem) => (
                      //
                      <HistoryItem
                        historyItem={historyItem}
                        symbol={symbol}
                        address={address}
                        network={network}
                      />
                    ))}
                </View>
              )
            );
          })}
        </View>
      </ScrollView>
    </View>
  ) : (
    <View>{loading ? <ScreenLoading show={loading} /> : <IconNoData />}</View>
  );
};
const HistoryItem = (props) => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const { historyItem, symbol, address, network } = props;

  const checkFailedOrSuccess = historyItem.from === historyItem.to;

  const shortAddressWhenTooLong =
    historyItem?.from.length > 20
      ? shortenAddressForHistory(historyItem.from)
      : historyItem.from;

  const toAddress = shortenAddressForHistory(historyItem.to);

  const dateTransition = day(+historyItem.timeStamp * 1000).format(
    "h:mm A - MMMM D, YYYY "
  );

  const hourTransition = day(+historyItem.timeStamp * 1000).format(" h:mm A");

  const takeFirstString = historyItem.from.charAt(0);

  const Icon = CHAIN_ICONS[network];

  const labelSend = address.toLowerCase() === historyItem.from;

  const labelReceive = address.toLowerCase() === historyItem.to;
  const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={onOpen} style={tw` `}>
        <View
          style={tw`rounded-full p-3 flex-row justify-between mb-2  border border-gray-200  `}
        >
          <View style={tw`flex-row  items-center`}>
            <View style={tw`w-1/5`}>
              {historyItem?.from.length > 20 ? (
                <View
                  style={tw`w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center`}
                >
                  <Text
                    style={tw`dark:text-white  text-2xl font-bold uppercase`}
                  >
                    <Icon />
                  </Text>
                </View>
              ) : (
                <View
                  style={tw`w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center`}
                >
                  <Text style={tw` text-2xl font-bold uppercase`}>
                    {takeFirstString}
                  </Text>
                </View>
              )}
            </View>
            <View style={tw`w-3/5`}>
              <View style={tw`py-1`}>
                <Text
                  style={tw`dark:text-white  dark:text-white  font-bold text-[12px]`}
                >
                  {shortAddressWhenTooLong}
                </Text>
                {/* {!checkAlreadyGetDomain &&   <Text style={tw`dark:text-white  dark:text-white   text-[10px]`}>({toAddress})</Text>} */}
              </View>
              {!checkFailedOrSuccess ? (
                <Text style={tw`dark:text-white  text-gray-500 `}>
                  {!checkFailedOrSuccess ? <IconCheckOK /> : <IconHighRisk />}
                  {labelSend && `${t("history.send")}`}{" "}
                  {labelReceive && `${t("history.receive")}`}
                </Text>
              ) : (
                <Text style={tw`dark:text-white  text-gray-500 `}>
                  {!checkFailedOrSuccess ? <IconCheckOK /> : <IconHighRisk />}{" "}
                  Failed
                </Text>
              )}
            </View>
            <View style={tw`w-1/5 text-right`}>
              <Text style={tw`dark:text-white  dark:text-white  py-1`}></Text>
              <View style={tw`flex flex-row`}>
                <Text style={tw`dark:text-white  text-gray-500 text-[10px]`}>
                  {hourTransition}
                </Text>
                <Text style={tw`dark:text-white  m-1`}>
                  <Icon height={10} width={10} />
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw``}>
          <ScrollView style={tw`flex flex-col w-screen px-4`}>
            <View style={tw`mb-4`}>
              {!checkFailedOrSuccess ? (
                <Text
                  style={tw` font-bold dark:text-white  text-center capitalize`}
                >
                  {labelSend && `${t("history.send")}`}{" "}
                  {labelReceive && `${t("history.receive")}`} {network}
                </Text>
              ) : (
                <Text style={tw` font-bold  text-center capitalize`}>
                  {t("history.failed")}
                </Text>
              )}

              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`dark:text-white  font-bold mt-2 `}>
                  {t("history.from")}
                </Text>
                {/* FromAddress */}
                <Text style={tw`dark:text-white  font-medium ml-auto mt-2 `}>
                  {shortAddressWhenTooLong}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`dark:text-white  font-bold mt-2 `}>
                  {t("history.to")}
                </Text>
                <Text style={tw`dark:text-white  font-medium ml-auto mt-2 `}>
                  {toAddress}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`dark:text-white  font-bold mt-2 `}>
                  {t("history.date")}
                </Text>
                <Text style={tw`dark:text-white  font-medium ml-auto mt-2 `}>
                  {dateTransition}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`dark:text-white  font-bold mt-2 `}>
                  {t("history.status")}
                </Text>
                <Text style={tw`dark:text-white  font-medium ml-auto mt-2 `}>
                  {checkFailedOrSuccess ? (
                    <View
                      style={tw`bg-red-100  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `}
                    >
                      <Text style={tw`dark:text-white  text-red-800 `}>
                        {t("history.failed")}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={tw`bg-green-100  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `}
                    >
                      <Text style={tw` text-green-800 `}>
                        {t("history.success")}
                      </Text>
                    </View>
                  )}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`dark:text-white  font-bold mt-2 `}>
                  {t("history.security")}
                </Text>
                <Text
                  style={tw`dark:text-white  mt-2 ml-auto font-medium text-green-400`}
                >
                  <ShieldCheckIcon width={15} height={15} color="green" />{" "}
                  {t("history.safe")}
                </Text>
              </View>
            </View>
            <View></View>
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default HistoryWallets;
