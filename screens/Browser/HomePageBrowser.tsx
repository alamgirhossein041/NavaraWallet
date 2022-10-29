import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {primaryColor} from '../../configs/theme';
import {BrowserFavorites} from '../../data/database/entities/favoritesBrowser';
import useDatabase from '../../data/database/useDatabase';
import cutString from '../../utils/splitString';
import {getHostname} from '../../utils/stringsFunction';
import {tw} from '../../utils/tailwind';
import DefaultBrowser from './DefaultBrowser';
import Favicon from './Favicon';

const HomePageBrowser = props => {
  return (
    <View style={tw`w-full h-full px-4 `}>
      <ListFavorite {...props} />
      <DefaultBrowser {...props} />
    </View>
  );
};

const ListFavorite = React.memo(({openLink}: any) => {
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<BrowserFavorites[]>([]);

  useEffect(() => {
    isFocused &&
      (async () => {
        const _favorites =
          await favoritesBrowserController.getFavoritesBrowser();
        setFavorites(_favorites);
      })();
  }, [isFocused]);

  const {favoritesBrowserController} = useDatabase();
  const handleOpenItem = item => {
    openLink(item.url);
  };
  const navigation = useNavigation();
  if (!favorites || favorites.length === 0) {
    return <></>;
  }
  return (
    <View style={tw`mt-2`}>
      <View style={tw`flex flex-row`}>
        <Text style={tw`dark:text-white  mb-1 text-lg font-bold`}>
          Favorite
        </Text>
        <TouchableOpacity
          style={tw`mt-1 ml-auto`}
          onPress={() => {
            navigation.navigate('FavoritesList' as never);
          }}>
          <Text
            style={tw`dark:text-white  text-[14px] text-[${primaryColor}] `}>
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favorites}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                style={tw`pb-2 mr-3 `}
                onPress={() => handleOpenItem(item)}>
                <View style={tw`flex flex-col items-center justify-center`}>
                  <View style={tw`items-center justify-center`}>
                    <Favicon domain={getHostname(item.url)} size={8} />
                  </View>
                  <Text>{cutString(item.title, 12)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
});

export default React.memo(HomePageBrowser);
