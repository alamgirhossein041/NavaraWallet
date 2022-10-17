import React, {useCallback, useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {StarIcon as StarIconDefault} from 'react-native-heroicons/outline';
import {StarIcon as StarIconAdded} from 'react-native-heroicons/solid';
import {useRecoilValue} from 'recoil';
import useDatabase from '../../data/database/useDatabase';
import {browserState, currentTabState} from '../../data/globalState/browser';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';

export interface IFavoriteWebSite {
  title: string;
  url: string;
  updatedAt: string;
}

export default function AddFavorite() {
  const currentTab = useRecoilValue(currentTabState);
  const {favoritesBrowserController} = useDatabase();
  const browser = useRecoilValue(browserState);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddFavorite = useCallback(async (): Promise<void> => {
    const {title, url} = browser[currentTab];
    const favorites = await favoritesBrowserController.createFavoritesBrowser(
      url,
      title,
    );
    if (favorites) {
      setIsFavorite(true);
    }
  }, [browser, favoritesBrowserController, currentTab]);

  const handleRemoveFavorite = useCallback(async () => {
    const {url} = browser[currentTab];
    const {affected} = await favoritesBrowserController.deleteFavoritesByUrl(
      url,
    );
    if (affected) {
      setIsFavorite(false);
    }
  }, [browser, favoritesBrowserController, currentTab]);

  useEffect(() => {
    (async () => {
      const {url} = browser[currentTab];
      const exiting = await favoritesBrowserController.findFavoritesByUrl(url);

      if (exiting) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    })();
  }, [browser, favoritesBrowserController, currentTab]);

  const textColor = useTextDarkMode();
  return isFavorite === true ? (
    <TouchableOpacity
      onPress={handleRemoveFavorite}
      style={tw`flex-col items-center w-1/4`}>
      <StarIconAdded height={30} width={30} style={tw`m-1`} color={'gray'} />
      <Text style={tw`${textColor}`}>Added</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddFavorite}
      style={tw`flex-col items-center w-1/4`}>
      <StarIconDefault height={30} width={30} style={tw`m-1`} color={'gray'} />
      <Text style={tw`${textColor}`}>Add Favorite</Text>
    </TouchableOpacity>
  );
}
