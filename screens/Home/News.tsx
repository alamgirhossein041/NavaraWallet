import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import uuid from "react-native-uuid";
import NewsSkeleton from "../../components/Skeleton/NewsSkeleton";
import TryAgainButton from "../../components/UI/TryAgainButton";
import { primaryColor } from "../../configs/theme";
import API from "../../data/api";
import { tw } from "../../utils/tailwind";
const dateFormat: any = dayjs;
interface INewsProps {
  keyword: string | "blockchain";
  isPreview?: boolean;
}
const News = (props: INewsProps) => {
  const { keyword, isPreview = false } = props;
  const { t } = useTranslation();

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

  const navigation = useNavigation();
  const goDetail = (item: any) => {
    navigation.navigate(
      "Browser" as never,
      {
        screen: "MainBrowser",
        params: {
          url: item.url,
        },
      } as never
    );
    // createTabBrowser({url: item.link, title: NEW_TAB});
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

  if (!isLoading && data.length === 0) {
    return <></>;
  }
  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (!isPreview && !isLoading && isCloseToBottom(nativeEvent)) {
          fetchMore();
        }
      }}
      scrollEventThrottle={400}
      style={tw`mb-8 dark:text-white`}
    >
      <Text
        style={tw`mx-3 mt-5 text-xl font-semibold text-black dark:text-white`}
      >
        {t("home.news")}
      </Text>
      {data.length === 0 && !isLoading && (
        <View>
          <Text style={tw`text-lg text-center text-gray-500`}>No news yet</Text>
        </View>
      )}
      {isError && <TryAgainButton onPress={fetchNews} />}
      {data.map((item) => (
        <TouchableOpacity
          style={tw`flex flex-row justify-between w-full px-3 py-1 mb-3 border-b border-gray-100 dark:border-stone-800`}
          onPress={() => goDetail(item)}
          key={uuid.v4() as string}
        >
          <View style={tw`flex-col flex-1 mr-3`}>
            <Text
              numberOfLines={3}
              style={tw`font-bold text-[15px]  text-black dark:text-white`}
            >
              {item.title}
            </Text>
            <View style={tw`flex flex-row justify-between w-full `}>
              <Text style={tw`font-bold text-gray-500`}>
                {item?.source?.name}
              </Text>
              <Text numberOfLines={1} style={tw`font-bold text-gray-400 `}>
                {dateFormat(item.publishedAt).fromNow(true)} ago
              </Text>
            </View>
          </View>

          <Image
            source={
              item.picture === ""
                ? require("../../assets/imagenotfound.png")
                : { uri: item.urlToImage }
            }
            style={tw`rounded-lg w-23 h-23`}
          />
        </TouchableOpacity>
      ))}

      {isLoading ? (
        <NewsSkeleton limit={limit} />
      ) : (
        <View style={tw`flex-row items-center justify-center w-full`}>
          {isPreview && (
            <View style={tw`w-1/3`}>
              <TouchableOpacity
                style={tw`bg-[${primaryColor}] p-3 rounded-full `}
                // onPress={fetchMore}
                onPress={() => {
                  navigation.navigate("NewsScreen" as never);
                }}
              >
                <Text style={tw`text-center text-white`}>Read more</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export const NewsScreen = () => {
  return <News keyword="blockchain" />;
};

export default News;
