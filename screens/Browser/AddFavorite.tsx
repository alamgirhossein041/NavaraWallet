import React, { useCallback, useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { StarIcon as StarIconDefault } from "react-native-heroicons/outline";
import { StarIcon as StarIconAdded } from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import FavoritesBrowserController from "../../data/database/controllers/favoritesBrowser.controller";
import { browserState, currentTabState } from "../../data/globalState/browser";
import { tw } from "../../utils/tailwind";

export interface IFavoriteWebSite {
  title: string;
  url: string;
  updatedAt: string;
}

export default function AddFavorite() {
  const currentTab = useRecoilValue(currentTabState);
  const favoritesBrowserController = new FavoritesBrowserController();
  const browser = useRecoilValue(browserState);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAddFavorite = useCallback(async (): Promise<void> => {
    const favorites = await favoritesBrowserController.createFavoritesBrowser(
      browser[currentTab]
    );
    if (favorites) {
      setIsFavorite(true);
    }
  }, [browser, favoritesBrowserController, currentTab]);

  const handleRemoveFavorite = useCallback(async () => {
    const { url } = browser[currentTab];
    const { affected } = await favoritesBrowserController.deleteFavoritesByUrl(
      url
    );
    if (affected) {
      setIsFavorite(false);
    }
  }, [browser, favoritesBrowserController, currentTab]);

  useEffect(() => {
    (async () => {
      const { url } = browser[currentTab];
      const exiting = await favoritesBrowserController.findFavoritesByUrl(url);

      if (exiting) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    })();
  }, [browser, favoritesBrowserController, currentTab]);

  return isFavorite === true ? (
    <TouchableOpacity
      onPress={handleRemoveFavorite}
      style={tw`flex-col items-center w-1/4`}
    >
      <StarIconAdded height={30} width={30} style={tw`m-1`} color={"gray"} />
      <Text style={tw`dark:text-white `}>Added</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={handleAddFavorite}
      style={tw`flex-col items-center w-1/4`}
    >
      <StarIconDefault height={30} width={30} style={tw`m-1`} color={"gray"} />
      <Text style={tw`dark:text-white `}>Add Favorite</Text>
    </TouchableOpacity>
  );
}
