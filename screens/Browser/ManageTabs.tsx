import { cloneDeep } from "lodash";
import React, { useEffect } from "react";
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import {
  browserState,
  currentTabState,
  newTabDefaultData,
  NEW_TAB,
} from "../../data/globalState/browser";
import { useBrowserActions } from "../../data/globalState/browser/browser.actions";
import { ITab } from "../../data/types";
import { tw } from "../../utils/tailwind";
import Favicon from "./Favicon";

const ManageTabs = ({ navigation, route }) => {
  const { createTabBrowser, closeTabBrowser, closeAllTabsBrowser } =
    useBrowserActions();
  const [browser, setBrowser] = useRecoilState(browserState);
  const [currentTab, setCurrentTab] = useRecoilState(currentTabState);
  const { imageURI } = route.params;

  useEffect(() => {
    if (imageURI && browser[currentTab]) {
      const dataUpdate = cloneDeep(browser);
      dataUpdate[currentTab].screenShot = imageURI;
      setBrowser(dataUpdate);
    }
  }, []);

  const handleSetCurrentTabId = (id) => {
    navigation.goBack();
    setCurrentTab(id);
  };

  const handleAddNewTab = () => {
    createTabBrowser(newTabDefaultData);
    navigation.goBack();
  };

  const handleCloseAllTabs = () => {
    closeAllTabsBrowser();
  };

  const handleCloseTab = (event, tabId) => {
    closeTabBrowser(tabId);

    event.preventDefault();
  };
  return (
    <View style={tw`flex-1 bg-white dark:bg-[#18191A]  android:py-3`}>
      <SafeAreaView style={tw`flex-1`}>
        <ScrollView style={tw`px-3`}>
          <View style={tw`flex-row flex-wrap `}>
            {browser.map((tab: ITab, index) => {
              const url =
                tab.url === NEW_TAB ? { hostname: NEW_TAB } : new URL(tab.url);
              return (
                <View style={tw`w-1/2 p-1`} key={tab.id}>
                  <PressableAnimated
                    key={index}
                    onPress={() => handleSetCurrentTabId(index)}
                    style={[
                      tw`relative border-4 rounded-2xl h-60 z-2`,
                      tw`${
                        currentTab === index
                          ? "border-blue-500"
                          : "border-gray-100 dark:border-gray-800"
                      }`,
                    ]}
                  >
                    <View
                      style={[
                        tw`flex-row items-center justify-between px-1 rounded-t`,
                        tw`${
                          currentTab === index
                            ? "bg-blue-500"
                            : "dark:bg-gray-800 bg-gray-100   "
                        }`,
                      ]}
                    >
                      <Favicon url={tab.icon} size={5} />
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={(event) => handleCloseTab(event, tab.id)}
                        style={tw`items-center justify-center rounded-full w-9 h-9`}
                      >
                        <XMarkIcon
                          size={25}
                          color={currentTab === index ? "white" : "gray"}
                        />
                      </TouchableOpacity>
                    </View>
                    <ImageBackground
                      borderBottomLeftRadius={11}
                      borderBottomRightRadius={11}
                      style={tw`flex-1 w-full z-1`}
                      source={{ uri: tab?.screenShot }}
                      resizeMode="cover"
                    ></ImageBackground>
                  </PressableAnimated>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View
          style={tw`flex-row justify-between bg-white dark:bg-[#18191A]  rounded-t-xl`}
        >
          <TouchableOpacity
            onPress={handleCloseAllTabs}
            style={tw`flex-row items-center justify-center w-1/3 px-3`}
          >
            <XMarkIcon style={tw`mx-1`} fill={"red"} />
            <Text style={tw`text-red-500 dark:text-white`}>Close all</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddNewTab}
            style={tw`flex-row items-center justify-center w-1/3 px-3 `}
          >
            <View
              style={tw`items-center justify-center w-10 h-10 bg-gray-100 rounded-full dark:bg-gray-700`}
            >
              <PlusIcon style={tw`mx-1`} fill={"gray"} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`flex-row items-center justify-center w-1/3 px-3`}
          >
            <CheckIcon style={tw`mx-1`} fill={primaryColor} />
            <Text style={tw`dark:text-white  text-[${primaryColor}] font-bold`}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default React.memo(ManageTabs);
