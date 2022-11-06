import dayjs from "dayjs";
import { Actionsheet, Spinner, useDisclose } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TrashIcon } from "react-native-heroicons/solid";
import { useRecoilState, useSetRecoilState } from "recoil";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import { primaryColor } from "../../configs/theme";
import { BrowserHistory as BrowserHistoryEntity } from "../../data/database/entities/historyBrowser";
import useDatabase from "../../data/database/useDatabase";
import { browserState, currentTabState } from "../../data/globalState/browser";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import Favicon from "./Favicon";

export default function BrowserHistory({ navigation }) {
  const { historyBrowserController } = useDatabase();
  const setCurrentTab = useSetRecoilState(currentTabState);
  const [histories, setHistories] = React.useState([]);
  const [browser, setBrowser] = useRecoilState(browserState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    historyBrowserController
      .getHistoryBrowser()
      .then((data) => {
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
    toastr.info("Success");
    setHistories([]);
  }, []);

  const deleteHistoryById = async (id) => {
    await historyBrowserController.deleteHistoryById(id);
    toastr.info("Deleted");
    setHistories([...histories].filter((item) => item.id !== id));
  };
  const handleOpenUrl = (items: BrowserHistoryEntity) => {
    setBrowser([...browser, items]);
    setCurrentTab(browser.length);
    navigation.goBack();
  };
  if (loading) {
    return (
      <View
        style={tw`items-center justify-center flex-1 bg-white dark:bg-[#18191A] `}
      >
        <Spinner size={60} color={primaryColor} />
      </View>
    );
  }
  return histories.length === 0 ? (
    <View
      style={tw`flex-row items-center justify-center flex-1 bg-white dark:bg-[#18191A] `}
    >
      <Text style={tw`text-xl font-bold dark:text-white`}>
        No browsing history
      </Text>
    </View>
  ) : (
    <ScrollView style={tw`flex-1 bg-white dark:bg-[#18191A] `}>
      <FlatList
        data={histories}
        renderItem={({ item }: { item: BrowserHistoryEntity }) => (
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
    const { isOpen, onOpen, onClose } = useDisclose();

    const getOnLyDomain = useCallback((url) => {
      const domain = url.split("/")[2];
      return domain;
    }, []);

    return (
      <View>
        <TouchableOpacity
          onLongPress={onOpen}
          onPress={onPress}
          style={tw`flex-row items-center px-3 mb-3`}
        >
          <Favicon url={item.icon} size={7} />
          <View style={tw`flex-1 mx-2`}>
            <Text style={tw`font-bold dark:text-white`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text>{getOnLyDomain(item.url)}</Text>
          </View>
          <Text>
            {dayjs(item.createdAt)
              .subtract(24 - 7, "hours")
              .format("HH:mm")}
          </Text>
        </TouchableOpacity>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
            <ActionSheetItem
              onPress={() => {
                onClose();
                onDelete(item.id);
              }}
            >
              <Text>Delete</Text>
            </ActionSheetItem>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  }
);
