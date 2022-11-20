import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { primaryColor } from "../../configs/theme";
import FavoritesBrowserController from "../../data/database/controllers/favoritesBrowser.controller";
import { BrowserFavorites } from "../../data/database/entities/favoritesBrowser";
import cutString from "../../utils/splitString";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

const ListFavorite = React.memo(({ openLink }: any) => {
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

  const favoritesBrowserController = new FavoritesBrowserController();
  const handleOpenItem = (item) => {
    openLink(item.url);
  };
  const navigation = useNavigation();
  if (!favorites || favorites.length === 0) {
    return <></>;
  }

  return (
    <View style={tw`mt-2`}>
      <View style={tw`flex flex-row`}>
        <Text style={tw`mb-1 text-lg font-bold text-black dark:text-white`}>
          Favorite
        </Text>
        <TouchableOpacity
          style={tw`mt-1 ml-auto`}
          onPress={() => {
            navigation.navigate("FavoritesList" as never);
          }}
        >
          <Text
            style={tw`dark:text-white  text-[14px] text-[${primaryColor}] `}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row flex-wrap w-full`}>
        {favorites.map((item) => {
          return (
            <TouchableOpacity
              style={tw`items-center justify-center w-1/4 mb-2`}
              onPress={() => handleOpenItem(item)}
            >
              <View style={tw`items-center justify-center`}>
                <Favicon url={item.icon} size={8} />
              </View>
              <Text
                numberOfLines={1}
                style={tw`text-xs text-black dark:text-white`}
              >
                {cutString(item.title, 12)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

export default ListFavorite;
