import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import uuid from "react-native-uuid";
import { eventHub } from "../../App";
import LogoApp from "../../assets/logo/logo.svg";
import NewsSkeleton from "../../components/Skeleton/NewsSkeleton";
import PressableAnimated from "../../components/UI/PressableAnimated";
import TryAgainButton from "../../components/UI/TryAgainButton";
import { searchDefault } from "../../configs/browser";
import { FOCUS_ADDRESS_BROWSER } from "../../core/eventHub";
import API from "../../data/api";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { BROWSER_SETTINGS } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import DappsMenu from "./DappsMenu";
import ListFavorite from "./ListFavorite";
const dateFormat: any = dayjs;

const HomePageBrowser = (props) => {
  const navigation = useNavigation();
  const keyword = "blockchain";
  const isPreview = false;
  const { t } = useTranslation();
  const [browserSettings] = useLocalStorage(BROWSER_SETTINGS);

  const Logo = props.logoSearchEngine;
  searchDefault[browserSettings?.searchEngine || "google"].logo || LogoApp;

  const limit = isPreview ? 5 : 10;
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [data, setData] = useState([]);

  const fetchNews = useCallback(async () => {
    if (isPreview && page !== 1 && data.length > 0) {
      return;
    }
    try {
      setIsLoading(true);
      const dataNews: any[] = await API.get(`news/chain`, {
        params: {
          keyword,
          page,
          limit,
        },
      });

      setData((oldData) => [...oldData, ...dataNews]);
      setError(false);
    } catch (e) {
      setError(true);
    }
    setIsLoading(false);
  }, [keyword, page, limit, isPreview]);

  useEffect(() => {
    (async () => {
      await fetchNews();
    })();
  }, [fetchNews]);

  const goDetail = (item: any) => {
    props.openLink(item.url);
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 120;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const fetchMore = () => setPage(page + 1);
  const scrollRef: any = useRef(null);
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleFocusAddressBrowser = useCallback(() => {
    scrollRef.current.scrollTo({
      y: 300,
      animated: true,
    });
    setTimeout(() => {
      eventHub.emit(FOCUS_ADDRESS_BROWSER);
      scrollRef.current?.scrollTo(0); // reset scroll position
    }, 30);
  }, []);

  const handleCloseBrowser = useCallback(() => {
    navigation.goBack();
  }, []);

  if (!isLoading && data.length === 0) {
    return <></>;
  }
  return (
    <ScrollView
      ref={scrollRef}
      stickyHeaderIndices={[1]}
      onScroll={({ nativeEvent }) => {
        if (!isPreview && !isLoading && isCloseToBottom(nativeEvent)) {
          fetchMore();
        }
      }}
      scrollEventThrottle={100}
      style={tw`w-full dark:text-white`}
    >
      <View style={tw`px-3`}>
        <View style={tw`flex-row items-center justify-between mt-2`}>
          <View>{/* <SelectWalletForBrowser {...props} /> */}</View>
          <TouchableOpacity
            onPress={handleCloseBrowser}
            style={tw`flex-row items-center justify-center rounded-full w-7 h-7`}
          >
            <XMarkIcon width={30} height={30} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row items-center justify-center mb-7 mt-30`}>
          <LogoApp width={45} height={45} />
          <Text style={tw`mx-3 text-3xl font-bold text-black dark:text-white `}>
            Browser
          </Text>
        </View>
        <Pressable
          onPress={handleFocusAddressBrowser}
          style={tw`flex-row items-center h-12 px-2 mb-5 bg-gray-100 border border-gray-100 rounded-full dark:bg-stone-800 dark:border-stone-800`}
        >
          <Logo width={30} height={30} />
          <Text style={tw`mx-1`}>Search name or type URL</Text>
        </Pressable>
        <ListFavorite {...props} />
        <DappsMenu {...props} />
      </View>

      <Pressable
        onPress={onPressTouch}
        style={tw`border-b border-gray-100 bg-white  dark:bg-[#18191A]`}
      >
        <Text
          style={tw`px-3 my-3 text-lg font-bold text-black dark:border-slate-700 dark:text-white`}
        >
          {t("home.news")}
        </Text>
      </Pressable>
      {data.length === 0 && !isLoading && (
        <View>
          <Text style={tw`text-lg text-center text-gray-500`}>No news yet</Text>
        </View>
      )}
      {isError && <TryAgainButton onPress={fetchNews} />}
      {data.map((item) => (
        <PressableAnimated
          style={tw`flex flex-row justify-between w-full p-3 border-b border-gray-100 dark:border-stone-800`}
          onPress={() => goDetail(item)}
          key={item.url + uuid.v4()}
        >
          <View style={tw`flex-col justify-between flex-1 mr-3`}>
            <Text
              numberOfLines={3}
              style={tw`font-bold text-[15px]  text-black dark:text-white`}
            >
              {item.title}
            </Text>
            <View style={tw`flex flex-row justify-between w-full `}>
              <Text style={tw`font-bold text-gray-500  text-[12px]`}>
                {item?.source?.name}
              </Text>
              <Text
                numberOfLines={1}
                style={tw`font-bold text-gray-400 text-[12px] `}
              >
                {dateFormat(item.publishedAt).fromNow(true)} ago
              </Text>
            </View>
          </View>

          <View style={tw`bg-gray-100 rounded-2xl w-23 h-23`}>
            <Image
              source={{ uri: item.urlToImage }}
              style={tw`rounded-2xl w-23 h-23`}
            />
          </View>
        </PressableAnimated>
      ))}

      {/* render sleleton */}
      {isLoading && <NewsSkeleton limit={limit} />}
    </ScrollView>
  );
};

export default HomePageBrowser;
