import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  browserApprovedHost,
  browserState,
  currentTabState,
  newTabDefaultData,
} from ".";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { APPROVED_HOSTS } from "../../../utils/storage";
import { ITab } from "../../types";
interface IBrowserActions {
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
  addApprovedHost: (host: string) => void;
}

/**
 * Hook manager tab browser
 * @returns
 */

const useBrowserActions = (): IBrowserActions => {
  const navigation = useNavigation();
  const [browser, setBrowser] = useRecoilState(browserState);
  const [approvedHosts, setApprovedHosts] = useRecoilState(browserApprovedHost);
  const [_, setApprovedHostsToLocalStorage] = useLocalStorage(
    APPROVED_HOSTS,
    {}
  );
  const setCurrentTab = useSetRecoilState(currentTabState);
  const tabBrowser: IBrowserActions = {
    createTabBrowser: (tab: ITab) => {
      setBrowser([...browser, { ...tab, id: uuid.v4() as string }]);
      setCurrentTab(browser.length);
    },

    closeTabBrowser: (tabId, goBack = true) => {
      let newTabsBrowser = [...browser];
      if (browser.length > 1) {
        newTabsBrowser = browser.filter((tab) => tab.id !== tabId);
      } else {
        newTabsBrowser = [{ ...newTabDefaultData }];
      }
      setBrowser(newTabsBrowser);
      setCurrentTab((currentTab) => {
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
      setBrowser([{ ...newTabDefaultData, id: uuid.v4() as string }]);
      setCurrentTab(0);
      navigation.goBack();
    },
    addApprovedHost: (host: string) => {
      const newApprovedHosts = { ...approvedHosts, [host]: true };
      setApprovedHosts(newApprovedHosts);
      setApprovedHostsToLocalStorage(newApprovedHosts);
    },
  };
  return tabBrowser;
};

export { useBrowserActions };
