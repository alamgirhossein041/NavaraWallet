import React, { useEffect, useRef } from 'react';
import { tw } from '../../utils/tailwind';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  browserState,
  currentTabState,
  newTabDefaultData,
} from '../../data/globalState/browser';
import { useRecoilState, useRecoilValue } from 'recoil';
import PagerView from 'react-native-pager-view';
import ManageTabs from './ManageTabs';
import { cloneDeep, uniqueId } from 'lodash';
import useDatabase from '../../data/database/useDatabase';
import BrowserHistory from './BrowserHistory';
import SettingsMenu from './Settings/SettingsMenu';
import SearchEngine from './Settings/SearchEngine';
import BackButton from '../../components/BackButton';
import { Spinner, View } from 'native-base';
import FavoritesList from './FavoritesList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BROWSER_TABS, localStorage } from '../../utils/storage';
import { primaryColor } from '../../configs/theme';
import { useTabBrowser } from './useTabBrowser';
import BrowserTab from './BrowserTab';

const MainBrowser = ({ route }) => {
  const { params } = route;
  const { historyBrowserController } = useDatabase();
  const { createTabBrowser } = useTabBrowser();
  const tabsRef = useRef(null);
  const [browser, setBrowser] = useRecoilState(browserState);
  const currentTab = useRecoilValue(currentTabState);
  const setToPage = index => {
    const { current } = tabsRef;
    if (!!current) {
      current.setPageWithoutAnimation(index);
    }
  };

  useEffect(() => {
    setToPage(currentTab);
  }, [currentTab]);

  const updateTabData = (data, index, isReloading) => {
    const dataUpdate = cloneDeep(browser);
    dataUpdate[index] = { ...dataUpdate[index], ...data };
    setBrowser(dataUpdate);
    if (isReloading) return;

    //update to history browser if not reloading
    historyBrowserController.createHistoryBrowser(data.url, data.title);
  };
  const [initBrowser, setInitBrowser] = React.useState(true);
  useEffect(() => {
    localStorage
      .get(BROWSER_TABS)
      .then((data: any) => {
        if (data.length > 0) {
          setBrowser(data);
          createTabBrowser({ url: params.url, id: uniqueId() });
        } else {
          setBrowser([newTabDefaultData]);
        }
      })
      .finally(() => {
        setInitBrowser(false);
      });
  }, []);

  useEffect(() => {
    if (browser.length > 0) {
      localStorage.set(BROWSER_TABS, browser);
    }
  }, [browser]);

  if (initBrowser) {
    return (
      <View style={tw`items-center justify-center flex-1 bg-white `}>
        <Spinner color={primaryColor} size={50} />
      </View>
    );
  }
  return (
    <View style={tw`flex-1 bg-white`}>
      <SafeAreaView style={tw`flex-1`} edges={['top']}>
        <PagerView
          testID="pager-view"
          ref={tabsRef}
          scrollEnabled={false}
          style={tw`flex-1`}
          overdrag
          initialPage={currentTab}>
          {browser.map((tab, index) => (
            <BrowserTab
              key={tab.id}
              initialUrl={tab.url}
              updateTabData={(data, isReloading) =>
                updateTabData(data, index, isReloading)
              }
              scrollEnabled={state => { }}
              tabId={tab.id}
            />
          ))}
        </PagerView>
      </SafeAreaView>
    </View>
  );
};

const Stack = createStackNavigator();
const StackBrowser = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        headerLeft: () => (
          <View style={tw`px-3`}>
            <BackButton />
          </View>
        ),
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MainBrowser"
        component={MainBrowser}
      />
      <Stack.Screen
        options={{
          title: 'History',
        }}
        name="BrowserHistory"
        component={BrowserHistory}
      />
      <Stack.Screen
        options={{
          title: 'Favorites List',
        }}
        name="FavoritesList"
        component={FavoritesList}
      />
      <Stack.Screen
        options={{
          title: '',
          headerShown: false,
        }}
        name="ManageTabs"
        component={ManageTabs}
      />
      <Stack.Screen
        name="SettingsBrowser"
        options={{
          title: 'Browser settings',
        }}
        component={SettingsMenu}
      />
      <Stack.Screen
        name="SearchEngine"
        options={{
          title: 'Default search engine',
        }}
        component={SearchEngine}
      />
    </Stack.Navigator>
  );
};
export { MainBrowser };
export default React.memo(StackBrowser);
