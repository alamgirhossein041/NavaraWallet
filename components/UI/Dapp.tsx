import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import { Image, Text, View } from "react-native";
import {
  GlobeAltIcon,
  MinusIcon,
  PlusIcon,
} from "react-native-heroicons/solid";
import { useQuery } from "react-query";
import API from "../../data/api";
import { IDapp } from "../../data/types";
import { tw } from "../../utils/tailwind";
import PressableAnimated from "./PressableAnimated";

interface IDappProps {
  chain: string;
}

export default function DappView(props: IDappProps) {
  const navigation = useNavigation();
  const [expand, setExpand] = useState(false);
  const { chain } = props;
  const keyQuery = `dapp_${chain}`;

  const { data } = useQuery(
    [keyQuery],
    async () =>
      await API.get<IDapp[]>("dapp/all", {
        params: {
          chain,
        },
      })
  );

  const gotoBrowser = (item: any) => {
    navigation.navigate(
      "Browser" as never,
      {
        screen: "MainBrowser",
        params: {
          url: item.link,
        },
      } as never
    );
    // createTabBrowser({url: item.link, title: NEW_TAB});
  };

  // dataRenderItem get value data from API
  const dataRenderItem: IDapp[] = useMemo(() => {
    if (data) {
      return data as any;
    }
    return [];
  }, [data]);

  if (!data) {
    return <></>;
  }

  return (
    <View>
      {!!dataRenderItem && dataRenderItem.length > 0 && (
        <Text
          style={tw`mx-3 mt-5 mb-3 text-xl font-semibold text-black dark:text-white`}
        >
          Top {chain} Dapps
        </Text>
      )}

      <View style={tw`flex-row flex-wrap w-full px-2`}>
        {dataRenderItem
          .slice(0, !expand ? 11 : dataRenderItem.length)
          .map((item: IDapp) => (
            <PressableAnimated
              onPress={() => gotoBrowser(item)}
              style={tw`flex-col items-center justify-center w-1/4 mb-2`}
            >
              <View
                style={tw`items-center justify-center border border-gray-100 rounded-full dark:border-gray-700 h-15 w-15`}
              >
                <RenderImage url={item.logo} />
              </View>
              <Text numberOfLines={1}>{item.name}</Text>
            </PressableAnimated>
          ))}
        {dataRenderItem.length > 0 && (
          <PressableAnimated
            onPress={() => setExpand(!expand)}
            style={tw`flex-col items-center justify-center w-1/4 mb-2`}
          >
            <View
              style={tw`items-center justify-center border border-gray-100 rounded-full dark:border-gray-700 h-15 w-15`}
            >
              {!expand ? (
                <PlusIcon color="gray" size={30} />
              ) : (
                <MinusIcon color="gray" size={30} />
              )}
            </View>
            <Text>{!expand ? "More" : "Collapse"}</Text>
          </PressableAnimated>
        )}
      </View>
    </View>
  );
}

const RenderImage = ({ url }) => {
  const [err, setErr] = useState(false);
  return (
    <View style={tw`flex-row items-center justify-center`}>
      {err ? (
        <View style={tw`flex-row items-center justify-center`}>
          <GlobeAltIcon color={"gray"} height={45} width={45} />
        </View>
      ) : (
        <Image
          onError={() => {
            setErr(true);
          }}
          source={{ uri: url }}
          style={tw`w-12 h-12 rounded-full`}
        />
      )}
    </View>
  );
};
