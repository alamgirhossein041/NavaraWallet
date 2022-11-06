import {atom} from 'recoil';
import {IHistoryBrowser, ITab} from '../../types';
import uuid from 'react-native-uuid';
const NEW_TAB = 'NEW_TAB';

const newTabDefaultData = {
  title: 'New tab',
  url: NEW_TAB,
  id: uuid.v4() as string,
};

const browserState = atom({
  key: 'browserState',
  default: [newTabDefaultData] as ITab[],
});

const currentTabState = atom({
  key: 'currentTabState',
  default: 0,
});

const browserHistory = atom({
  key: 'browserHistory',
  default: [] as IHistoryBrowser[],
});

const browserApprovedHost = atom({
  key: "browserApprovedHost",
  default: {},
});

export {
  newTabDefaultData,
  currentTabState,
  browserHistory,
  NEW_TAB,
  browserState,
  browserApprovedHost,
};
