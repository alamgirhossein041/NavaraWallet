import {useRecoilState, useSetRecoilState} from 'recoil';
import {
  browserState,
  currentTabState,
  newTabDefaultData,
} from '../../data/globalState/browser';
import uuid from 'react-native-uuid';
import {ITab} from '../../data/types';
import {useNavigation} from '@react-navigation/native';
interface ITabBrowserManager {
  /**
   * Create tab browser, push data new tab to browser state
   * @param tab
   */
  createTabBrowser: (tabBrowser: any) => void;

  /**
   * Close tab browser with id
   * @param tabId id of tab browser
   */
  closeTabBrowser: (tabId: string, goBack?: boolean) => void;
  closeAllTabsBrowser: () => void;
}

/**
 * Hook manager tab browser
 * @returns
 */

const useTabBrowser = (): ITabBrowserManager => {
  const navigation = useNavigation();
  const [browser, setBrowser] = useRecoilState(browserState);
  const setCurrentTab = useSetRecoilState(currentTabState);
  const tabBrowser: ITabBrowserManager = {
    createTabBrowser: (tab: ITab) => {
      setBrowser([...browser, {...tab, id: uuid.v4() as string}]);
      setCurrentTab(browser.length);
    },

    closeTabBrowser: (tabId, goBack = true) => {
      let newTabsBrowser = [...browser];
      if (browser.length > 1) {
        newTabsBrowser = browser.filter(tab => tab.id !== tabId);
      } else {
        newTabsBrowser = [{...newTabDefaultData}];
      }
      setBrowser(newTabsBrowser);
      setCurrentTab(currentTab => {
        if (browser.length === 1) {
          return currentTab;
        }
        if (currentTab === browser.length - 1) {
          return browser.length - 2;
        }
        return currentTab;
      });
      goBack && navigation.goBack();
    },
    closeAllTabsBrowser: () => {
      // override browser state to a tab and generate new id
      setBrowser([{...newTabDefaultData, id: uuid.v4() as string}]);
      setCurrentTab(0);
      navigation.goBack();
    },
  };
  return tabBrowser;
};

export {useTabBrowser};
