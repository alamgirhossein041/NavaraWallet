import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {tw} from '../../utils/tailwind';
import useDatabase from '../../data/database/useDatabase';
import Favicon from './Favicon';
import dayjs from 'dayjs';
import {BrowserHistory as BrowserHistoryEntity} from '../../data/database/entities/historyBrowser';
import toastr from '../../utils/toastr';
import {TrashIcon} from 'react-native-heroicons/solid';
import {Actionsheet, Spinner, useDisclose} from 'native-base';
import ActionSheetItem from '../../components/ActionSheetItem';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {browserState, currentTabState} from '../../data/globalState/browser';
import {useQuery} from 'react-query';
import {primaryColor} from '../../configs/theme';
export default function BrowserHistory({navigation}) {
  const {historyBrowserController} = useDatabase();
  const setCurrentTab = useSetRecoilState(currentTabState);
  const [histories, setHistories] = React.useState([]);
  const [browser, setBrowser] = useRecoilState(browserState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    historyBrowserController
      .getHistoryBrowser()
      .then(data => {
        if (data.length > 0) {
          setHistories(data);
          navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity style={tw`px-3`} onPress={clearHistory}>
                <TrashIcon fill="gray" />
              </TouchableOpacity>
            ),
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const clearHistory = useCallback(async () => {
    await historyBrowserController.deleteAllHistoryBrowser();
    toastr.info('Success');
    setHistories([]);
  }, []);

  const deleteHistoryById = async id => {
    await historyBrowserController.deleteHistoryById(id);
    toastr.info('Deleted');
    setHistories([...histories].filter(item => item.id !== id));
  };
  const handleOpenUrl = (items: BrowserHistoryEntity) => {
    setBrowser([...browser, items]);
    setCurrentTab(browser.length);
    navigation.goBack();
  };
  if (loading) {
    return (
      <View
        style={tw`items-center justify-center flex-1 bg-white dark:bg-[#18191A] `}>
        <Spinner size={60} color={primaryColor} />
      </View>
    );
  }
  return histories.length === 0 ? (
    <View
      style={tw`flex-row items-center justify-center flex-1 bg-white dark:bg-[#18191A] `}>
      <Text style={tw`dark:text-white  text-xl font-bold`}>
        No browsing history
      </Text>
    </View>
  ) : (
    <ScrollView style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
      <FlatList
        data={histories}
        renderItem={({item}: {item: BrowserHistoryEntity}) => (
          <ItemHistoryBrowser
            onPress={() => handleOpenUrl(item)}
            item={item}
            onDelete={deleteHistoryById}
          />
        )}
      />
    </ScrollView>
  );
}

const ItemHistoryBrowser = React.memo(
  ({
    item,
    onDelete,
    onPress,
  }: {
    onDelete: (id) => void;
    onPress: () => void;
    item: BrowserHistoryEntity;
  }) => {
    const {isOpen, onOpen, onClose} = useDisclose();

    const getOnLyDomain = useCallback(url => {
      const domain = url.split('/')[2];
      return domain;
    }, []);

    return (
      <View>
        <TouchableOpacity
          onLongPress={onOpen}
          onPress={onPress}
          style={tw`flex-row items-center px-3 mb-3`}>
          <Favicon domain={getOnLyDomain(item.url)} size={7} />
          <View style={tw`flex-1 mx-2`}>
            <Text style={tw`dark:text-white  font-bold`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text>{getOnLyDomain(item.url)}</Text>
          </View>
          <Text>
            {dayjs(item.createdAt)
              .subtract(24 - 7, 'hours')
              .format('HH:mm')}
          </Text>
        </TouchableOpacity>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <ActionSheetItem
              onPress={() => {
                onClose();
                onDelete(item.id);
              }}>
              <Text>Delete</Text>
            </ActionSheetItem>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  },
);
