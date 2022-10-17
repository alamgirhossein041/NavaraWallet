import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import {tw} from '../../utils/tailwind';
import {primaryColor} from '../../configs/theme';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
  browserState,
  currentTabState,
  NEW_TAB,
} from '../../data/globalState/browser';
import {useQuery} from 'react-query';
import API from '../../data/api';
import TryAgainButton from '../../components/TryAgainButton';
import NewsSkeleton from '../../components/skeleton/NewsSkeleton';
import {useTabBrowser} from '../Browser/useTabBrowser';
const News = () => {
  const {isLoading, data, isError, refetch} = useQuery(
    ['news'],
    async (): Promise<any> => {
      return await API.get(`/news/all`);
    },
  );

  const dataNew: any = data || [];
  const [browser, setBrowser] = useRecoilState(browserState);
  const setCurrentTab = useSetRecoilState(currentTabState);
  const navigation = useNavigation();
  const {createTabBrowser} = useTabBrowser();
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
    <View style={tw``}>
      <ScrollView style={tw`mb-25`}>
        <View>
          {dataForDisplay.map((item, index) => (
            <TouchableOpacity
              style={tw`flex flex-row w-full mx-3 my-3`}
              onPress={() => goDetail(item)}
              key={index}>
              <View style={tw`w-3/4 mt-1`}>
                <Text style={tw`text-[14px] font-bold`}>{item.title}</Text>
                <View style={tw`flex flex-row w-full `}>
                  <Text style={tw`font-light text-[12px] `}>{item.time}</Text>
                </View>
              </View>
              {item.picture === '' ? (
                <View style={tw`w-1/4 rounded-lg `}>
                  <Image
                    source={
                      item.picture ||
                      require('../../assets/news/imagenotfound.png')
                    }
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              ) : (
                <View style={tw`w-1/4 rounded-lg `}>
                  <Image
                    source={{
                      uri: item.picture,
                    }}
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: 20,
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={tw`text-center mb-5 text-[${primaryColor}]`}>
              {expanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default News;
