import dayjs from 'dayjs';
import {Actionsheet, ScrollView, useDisclose} from 'native-base';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ShieldCheckIcon} from 'react-native-heroicons/solid';
import {useInfiniteQuery} from 'react-query';
import IconCheckOK from '../../assets/icons/icon-checkmark.svg';
import IconHighRisk from '../../assets/icons/icon-high-risk.svg';
import IconNoData from '../../assets/icons/icon-no-data-amico.svg';
import ScreenLoading from '../../components/ScreenLoading';
import {CHAIN_ICONS} from '../../configs/bcNetworks';
import {fetchHistory} from '../../data/api/fetchHistory';
import {IHistory} from '../../data/types';
import {
  useDarkMode,
  useGridDarkMode,
  useTextDarkMode,
} from '../../hooks/useModeDarkMode';
import {shortenAddressForHistory} from '../../utils/stringsFunction';
import {tw} from '../../utils/tailwind';
var relativeTime = require('dayjs/plugin/relativeTime');
const day: any = dayjs;
day.extend(relativeTime);
const HistoryWallets = props => {
  const {route} = props;

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
    async ({pageParam = 1}) => {
      const response: any = await fetchHistory(network, {
        address,
      });

      const data: IHistory[] = Array.prototype.concat.apply(
        [],
        response.map(res => res),
      );
      setLoading(false);
      return data;
    },
    {
      getNextPageParam: (lastPage: any, pages) => lastPage.nextCursor,
    },
  );
  // start groupByArray
  const groups = data?.pages[0].reduce((groups, item) => {
    const date = day(+item.timeStamp * 1000).format('MMMM D, YYYY ');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  const groupArrays =
    data &&
    Object.keys(groups).map(date => {
      return groups[date];
    });
  // end groupByArray
  return data && data.pages[0].length > 0 ? (
    <View>
      <View style={tw`bg-white`}>
        <Text style={tw` text-center font-bold`}>{symbol}</Text>
      </View>
      <ScrollView style={tw`bg-white h-full`}>
        <View style={tw`mx-3`}>
          {groupArrays.map(itemGroup => {
            const dateTime = day(+itemGroup[0].timeStamp * 1000).format(
              'DD-MM-YYYY',
            );
            return (
              data &&
              data.pages[0].length > 0 && (
                <View style={tw`mb-10`}>
                  <Text style={tw`m-2 font-bold`}>{dateTime}</Text>

                  {/* map history to history item  */}
                  {itemGroup &&
                    itemGroup?.map(historyItem => (
                      // console.log(historyItem)
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
const HistoryItem = props => {
  const {isOpen, onOpen, onClose} = useDisclose();

  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  const {historyItem, symbol, address, network} = props;

  const checkFailedOrSuccess = historyItem.from === historyItem.to;

  const shortAddressWhenTooLong =
    historyItem?.from.length > 20
      ? shortenAddressForHistory(historyItem.from)
      : historyItem.from;

  const toAddress = shortenAddressForHistory(historyItem.to);

  const dateTransition = day(+historyItem.timeStamp * 1000).format(
    'h:mm A - MMMM D, YYYY ',
  );

  const hourTransition = day(+historyItem.timeStamp * 1000).format(' h:mm A');

  const takeFirstString = historyItem.from.charAt(0);

  const Icon = CHAIN_ICONS[network];

  const labelSend = address.toLowerCase() === historyItem.from;

  const labelReceive = address.toLowerCase() === historyItem.to;

  return (
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={onOpen} style={tw` `}>
        <View
          style={tw`rounded-full p-3 flex-row justify-between mb-2  border border-gray-200  `}>
          <View style={tw`flex-row  items-center`}>
            <View style={tw`w-1/5`}>
              {historyItem?.from.length > 20 ? (
                <View
                  style={tw`w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center`}>
                  <Text style={tw`text-2xl font-bold uppercase`}>
                    <Icon />
                  </Text>
                </View>
              ) : (
                <View
                  style={tw`w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center`}>
                  <Text style={tw`text-2xl font-bold uppercase`}>
                    {takeFirstString}
                  </Text>
                </View>
              )}
            </View>
            <View style={tw`w-3/5`}>
              <View style={tw`py-1`}>
                <Text style={tw`text-black font-bold text-[12px]`}>
                  {shortAddressWhenTooLong}
                </Text>
                {/* {!checkAlreadyGetDomain &&  <Text style={tw`text-black  text-[10px]`}>({toAddress})</Text>} */}
              </View>
              {!checkFailedOrSuccess ? (
                <Text style={tw`text-gray-500 `}>
                  {!checkFailedOrSuccess ? <IconCheckOK /> : <IconHighRisk />}
                  {labelSend && ' Send '} {labelReceive && ' Receive '}
                </Text>
              ) : (
                <Text style={tw`text-gray-500 `}>
                  {!checkFailedOrSuccess ? <IconCheckOK /> : <IconHighRisk />}{' '}
                  Failed
                </Text>
              )}
            </View>
            <View style={tw`w-1/5 text-right`}>
              <Text style={tw`text-black py-1`}></Text>
              <View style={tw`flex flex-row`}>
                <Text style={tw`text-gray-500 text-[10px]`}>
                  {hourTransition}
                </Text>
                <Text style={tw`m-1`}>
                  <Icon height={10} width={10} />
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={tw`${gridColor}`}>
          <ScrollView style={tw`flex flex-col w-screen px-4`}>
            <View style={tw`mb-4`}>
              {!checkFailedOrSuccess ? (
                <Text
                  style={tw` font-bold ${textColor} text-center capitalize`}>
                  {labelSend && ' Send '} {labelReceive && ' Receive '}
                  {network}
                </Text>
              ) : (
                <Text
                  style={tw` font-bold ${textColor} text-center capitalize`}>
                  Failed
                </Text>
              )}

              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`font-bold mt-2 ${textColor}`}>From</Text>
                {/* FromAddress */}
                <Text style={tw`font-medium ml-auto mt-2 ${textColor}`}>
                  {shortAddressWhenTooLong}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`font-bold mt-2 ${textColor}`}>To</Text>
                <Text style={tw`font-medium ml-auto mt-2 ${textColor}`}>
                  {toAddress}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`font-bold mt-2 ${textColor}`}>Date</Text>
                <Text style={tw`font-medium ml-auto mt-2 ${textColor}`}>
                  {dateTransition}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`font-bold mt-2 ${textColor}`}>Status</Text>
                <Text style={tw`font-medium ml-auto mt-2 ${textColor}`}>
                  {checkFailedOrSuccess ? (
                    <View
                      style={tw`bg-red-100  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `}>
                      <Text style={tw`text-red-800 `}>Failed</Text>
                    </View>
                  ) : (
                    <View
                      style={tw`bg-green-100  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded `}>
                      <Text style={tw`text-green-800 `}>Success</Text>
                    </View>
                  )}
                </Text>
              </View>
              <View style={tw`flex flex-row my-2`}>
                <Text style={tw`font-bold mt-2 ${textColor}`}>Security</Text>
                <Text style={tw`mt-2 ml-auto font-medium text-green-400`}>
                  <ShieldCheckIcon width={15} height={15} color="green" /> Safe
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
