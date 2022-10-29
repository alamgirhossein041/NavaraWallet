import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import NewsSkeleton from '../../components/skeleton/NewsSkeleton';
import TryAgainButton from '../../components/TryAgainButton';
import { primaryColor } from '../../configs/theme';
import API from '../../data/api';
import {
  browserState,
  currentTabState
} from '../../data/globalState/browser';
import { tw } from '../../utils/tailwind';
import { useTabBrowser } from '../Browser/useTabBrowser';
const News = () => {
  const { isLoading, data, isError, refetch } = useQuery(
    ['news'],
    async (): Promise<any> => {
      return await API.get(`/news/all`);
    },
  );

  const dataNew: any = data || [];
  const [browser, setBrowser] = useRecoilState(browserState);
  const setCurrentTab = useSetRecoilState(currentTabState);
  const navigation = useNavigation();
  const { createTabBrowser } = useTabBrowser();
  const goDetail = (item: any) => {
    navigation.navigate(
      'Browser' as never,
      {
        screen: 'MainBrowser',
        params: {
          url: item.link,
        },
      } as never,
    );
    // createTabBrowser({url: item.link, title: NEW_TAB});
  };

  const [expanded, setExpanded] = useState(false);
  const dataForDisplay = expanded ? dataNew : dataNew.slice(0, 5);

  if (isLoading) {
    return <NewsSkeleton />;
  }

  if (isError) {
    return <TryAgainButton onPress={refetch} />;
  }
  return (
    <View style={tw`dark:text-white`}>
      <ScrollView style={tw`mb-25`}>
        <View>
          {dataForDisplay.map((item, index) => (
            <TouchableOpacity
              style={tw`flex flex-row justify-between w-full px-3 py-1 mb-3 border-b border-gray-100 dark:border-stone-800`}
              onPress={() => goDetail(item)}
              key={index}>
              <View style={tw`flex-col flex-1 mr-1`}>
                <Text
                  numberOfLines={3}
                  style={tw`font-bold text-[15px] text-black dark:text-white`}>
                  {item.title}
                </Text>
                <View style={tw`flex flex-row w-full `}>
                  <Text numberOfLines={1} style={tw`text-gray-400 text-light`}>
                    {item.time}
                  </Text>
                </View>
              </View>

              <Image
                source={
                  item.picture === ''
                    ? require('../../assets/news/imagenotfound.png')
                    : { uri: item.picture }
                }
                style={tw`rounded-lg w-25 h-25`}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text
              style={tw`dark:text-white  text-center mb-5 text-[${primaryColor}]`}>
              {expanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default News;
