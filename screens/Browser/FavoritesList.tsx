import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StarIcon } from "react-native-heroicons/outline";
import { useRecoilState, useSetRecoilState } from "recoil";
import { warningColor } from "../../configs/theme";
import FavoritesBrowserController from "../../data/database/controllers/favoritesBrowser.controller";
import { BrowserFavorites } from "../../data/database/entities/favoritesBrowser";
import { browserState, currentTabState } from "../../data/globalState/browser";
import { getHostname } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

const FavoritesList = () => {
  const [browser, setBrowser] = useRecoilState(browserState);
  const favoritesBrowserController = new FavoritesBrowserController();
  const setCurrentTab = useSetRecoilState(currentTabState);
  const [listFavorite, setListFavorite] = useState<BrowserFavorites[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const favorites = await favoritesBrowserController.getFavoritesBrowser();
      setListFavorite(favorites);
    })();
  }, []);

  const handleOpenUrl = (items: BrowserFavorites) => {
    setBrowser([...browser, items]);
    setCurrentTab(browser.length);
    navigation.goBack();
  };
  const onDelete = async (url: string) => {
    const newListFavorite = listFavorite.filter((item) => item.url !== url);
    setListFavorite(newListFavorite);
    await favoritesBrowserController.deleteFavoritesByUrl(url);
  };
  let rowRefs = new Map();
  if (listFavorite.length === 0) {
    return (
      <View
        style={tw`flex-row items-center justify-center flex-1 bg-white dark:bg-[#18191A] `}
      >
        <Text style={tw`text-xl font-bold dark:text-white`}>No favorite</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={tw`flex flex-col w-screen h-full bg-white dark:bg-[#18191A] `}
    >
      <View>
        {listFavorite.map((item) => {
          const handleOnPress = () => {
            handleOpenUrl(item);
          };
          return (
            <View key={item.id}>
              <FavoriteItem
                item={item}
                handleOnPress={handleOnPress}
                handleDelete={onDelete}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FavoritesList;

const FavoriteItem = ({
  item,
  handleOnPress,
  handleDelete,
}: {
  item: BrowserFavorites;
  handleOnPress: () => void;
  handleDelete: (url: string) => Promise<void>;
}) => {
  const [isFavorite, setIsFavorite] = useState(true);

  return (
    <View style={tw`flex-row items-center px-3 py-2`}>
      <TouchableOpacity
        onPress={handleOnPress}
        style={tw`flex-row items-center flex-1 `}
      >
        <View style={tw`justify-center mr-2`}>
          <Favicon url={item.icon} size={7} />
        </View>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`font-bold dark:text-white`} numberOfLines={1}>
            {item.title}
          </Text>
          <Text>{getHostname(item.url)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await handleDelete(item.url);
          setIsFavorite(false);
        }}
      >
        <StarIcon
          width={25}
          height={25}
          stroke={warningColor}
          fill={isFavorite ? warningColor : "none"}
        />
      </TouchableOpacity>
    </View>
  );
};
