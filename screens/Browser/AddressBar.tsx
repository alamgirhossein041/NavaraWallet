import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {tw} from '../../utils/tailwind';
import {ClockIcon, SearchIcon, XIcon} from 'react-native-heroicons/outline';
import {defaultSettings, searchDefault} from '../../configs/browser';
import {useNavigation} from '@react-navigation/native';
import {
  DocumentDuplicateIcon,
  PencilIcon,
} from 'react-native-heroicons/outline';
import isUrl from 'is-url';
import API from '../../data/api';
import Favicon from './Favicon';
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from '../../utils/toastr';
const isValidDomain = require('is-valid-domain');
import {
  browserState,
  currentTabState,
  NEW_TAB,
} from '../../data/globalState/browser';
import {useLocalStorage} from '../../hooks/useLocalStorage';
import {BROWSER_SETTINGS} from '../../utils/storage';
import WebviewProgressBar from './WebviewProgressBar';
import useDatabase from '../../data/database/useDatabase';
import {BrowserHistory} from '../../data/database/entities/historyBrowser';
import {debounce} from 'lodash';
import {
  ArrowSmUpIcon,
  ExclamationIcon,
  LockClosedIcon,
} from 'react-native-heroicons/solid';
import getHostnameFromUrl from '../../utils/getHostname';
import {useRecoilValue} from 'recoil';
import SelectWalletForBrowser from './SelectWalletForBrowser';
import {SearchRecent} from '../../data/database/entities/searchRecent';
const PROTOCOL = 'https';
const getProtocol = url => {
  return url.split(':')[0];
};
const AddressBar = props => {
  const {historyBrowserController} = useDatabase();
  const currentTab = useRecoilValue(currentTabState);
  const {onGotoUrl, url, progress} = props;
  const browser = useRecoilValue(browserState);
  const isNewTab = url === NEW_TAB || !url;
  const currentUrl = isNewTab ? {hostname: 'NEW_TAB'} : new URL(url);
  const navigation = useNavigation();
  const [searchInput, setSearchInput] = React.useState<string>('');

  const [browserSettings] = useLocalStorage(BROWSER_SETTINGS);
  const searchEngine =
    searchDefault[browserSettings?.searchEngine]?.url ||
    searchDefault[defaultSettings?.searchEngine]?.url;

  const handleSetUrlBrowser = url => {
    onGotoUrl(url);
  };

  const handleGoTo = input => {
    setIsEditing(false);
    setSearchInput('');
    if (input.trim().length === 0) {
      return;
    }

    if (isValidDomain(input)) {
      const url = !input.includes(PROTOCOL) ? `${PROTOCOL}://${input}` : input;
      handleSetUrlBrowser(url);
      return;
    }

    if (input && input.length === 0) {
      setSearchInput(url);
      return;
    }

    if (isUrl(input)) {
      const url = !input.includes('http') ? `${PROTOCOL}://${input}` : input;
      handleSetUrlBrowser(url);
    } else {
      handleSetUrlBrowser(`${searchEngine}${input.replace('', '+')}`);
      historyBrowserController.createSearchRecent(input.trim());
    }
  };

  const handleClearAllSearchInput = () => {
    if (searchInput.length > 0) {
      setSearchInput('');
    } else {
      setSearchInput(url);
      closeInputMode();
    }
  };

  const [isEditing, setIsEditing] = React.useState(false);
  const handleOnFocus = useCallback(() => {
    setIsEditing(true);
  }, []);
  const closeInputMode = () => {
    setIsEditing(false);
  };

  const handleCloseBrowser = useCallback(() => {
    navigation.goBack();
  }, []);

  const [searchRecent, setSearchRecent] = React.useState<SearchRecent[]>([]);
  useEffect(() => {
    isEditing &&
      historyBrowserController.getSearchRecent().then(response => {
        setSearchRecent(response);
      });
  }, [isEditing]);

  const handleClearSearchRecent = () => {
    setSearchRecent([]);
    historyBrowserController.deleteAllSearchRecent();
  };

  return (
    <View
      scrollEnabled={false}
      style={[
        tw`absolute z-10 w-full  bg-white dark:bg-[#18191A]  ${
          isEditing ? 'h-full' : ''
        } `,
      ]}>
      <View
        style={tw`flex-row items-center w-full px-3 py-1 bg-white dark:bg-[#18191A] `}>
        {!isEditing && url !== NEW_TAB && <SelectWalletForBrowser {...props} />}
        <View
          style={tw`flex-row items-center justify-center flex-1 w-full h-10 px-1 bg-gray-100 border border-gray-100 rounded-full dark:bg-stone-800 dark:border-stone-800`}>
          {!isEditing && !isNewTab ? (
            <View style={tw`flex-row items-center justify-between px-1`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setIsEditing(true);
                  setSearchInput('');
                }}
                style={tw`flex-row items-center justify-center flex-1`}>
                {getProtocol(url) === PROTOCOL ? (
                  <LockClosedIcon width={15} color={'gray'} />
                ) : (
                  <ExclamationIcon width={15} color={'red'} />
                )}

                <Text
                  style={tw`mx-1 text-center text-gray-600 dark:text-gray-200`}>
                  {currentUrl.hostname}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={tw`flex-row items-center`}>
              <SearchIcon color="gray" width={25} />
              <TextInput
                autoFocus={!isNewTab}
                onFocus={handleOnFocus}
                selectTextOnFocus
                autoCapitalize="none"
                returnKeyType="go"
                onChangeText={text => setSearchInput(text)}
                value={searchInput}
                onSubmitEditing={() => handleGoTo(searchInput)}
                style={tw`flex-1 h-20 p-3 dark:text-white `}
                placeholderTextColor="gray"
                placeholder="Search name or link"
              />
              {searchInput.trim().length > 0 && (
                <TouchableOpacity
                  style={tw`mx-3`}
                  onPress={handleClearAllSearchInput}>
                  <XIcon color="gray" width={20} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View>
          {isEditing ? (
            <TouchableOpacity
              onPress={() => {
                setIsEditing(false);
                setSearchInput('');
              }}
              style={tw`mx-3`}>
              <Text style={tw`text-black dark:text-white`}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <View style={tw`flex-row ml-3`}>
              <TouchableOpacity
                onPress={handleCloseBrowser}
                style={tw`flex-row`}>
                <XIcon width={30} height={30} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <WebviewProgressBar progress={progress} />
      {isEditing && (
        <View>
          {!searchInput && (
            <View>
              {!isNewTab && (
                <View
                  style={tw`flex-row items-center px-3 py-2 border-b border-gray-100 dark:border-gray-600`}>
                  <View style={tw`justify-center mr-1`}>
                    <Favicon domain={currentUrl.hostname} size={7} />
                  </View>
                  <View style={tw`flex-row flex-1`}>
                    <View style={tw`flex-col`}>
                      <Text numberOfLines={1} style={tw`font-bold`}>
                        {browser[currentTab].title}
                      </Text>
                      <Text numberOfLines={1} style={tw`text-blue-500`}>
                        {url}
                      </Text>
                    </View>
                  </View>
                  <View style={tw`flex-row`}>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(url);
                        toastr.info('Copied to clipboard');
                      }}
                      style={tw`flex-row items-center mx-2`}>
                      <DocumentDuplicateIcon
                        height={30}
                        width={30}
                        color="gray"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSearchInput(url)}
                      style={tw`flex-row items-center `}>
                      <PencilIcon size={30} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
          {!isUrl(searchInput) && (
            <SuggestionAutoComplete
              handleClearSearchRecent={handleClearSearchRecent}
              searchRecent={searchRecent}
              historyBrowserController={historyBrowserController}
              searchInput={searchInput.trim()}
              onSearch={handleGoTo}
              updateKeyWord={newKeyWord => setSearchInput(newKeyWord)}
            />
          )}
        </View>
      )}
    </View>
  );
};

const SuggestionAutoComplete = ({
  searchInput,
  onSearch,
  updateKeyWord,
  historyBrowserController,
  searchRecent,
  handleClearSearchRecent,
}: {
  searchInput: string;
  onSearch: (value: string) => void;
  updateKeyWord: (newKeyWord: string) => void;
  historyBrowserController: any;
  searchRecent: SearchRecent[];
  handleClearSearchRecent;
}) => {
  const [asyncSuggetion, setAsyncSuggsetion] = React.useState<any>([]);
  const [suggetsHistory, setSuggetsHistory] = React.useState<
    BrowserHistory | any
  >();

  const fetchSuggestion = debounce(async () => {
    const searchSuggests: any[] = await API.get(
      `${PROTOCOL}://duckduckgo.com/ac/?q=${searchInput}`,
    );
    const historySuggests: BrowserHistory =
      await historyBrowserController.suggestHistoryBrowser(searchInput);
    setSuggetsHistory(historySuggests);
    setAsyncSuggsetion(searchSuggests.map(item => item.phrase));
  }, 100);

  useEffect(() => {
    if (searchInput.length > 0 && !isUrl(searchInput)) {
      fetchSuggestion();
    }
  }, [searchInput]);
  const handleSearchByKeyWord = (event, keyword) => {
    event.preventDefault();
    onSearch(keyword);
  };

  const hanleUpdateKeyWord = (event, keyword) => {
    event.preventDefault();
    updateKeyWord(keyword);
  };

  return (
    <View>
      {searchInput.length > 0 && suggetsHistory && (
        <TouchableHighlight
          onPress={e => handleSearchByKeyWord(e, suggetsHistory.history_url)}
          activeOpacity={0.6}
          underlayColor="#DDDDDD">
          <View style={tw`flex-row items-center px-4 my-3`}>
            <View style={tw`justify-center mr-1`}>
              <Favicon
                domain={getHostnameFromUrl(suggetsHistory.history_url)}
                size={6}
              />
            </View>
            <View style={tw`flex-row flex-1`}>
              <View style={tw`flex-col`}>
                <Text numberOfLines={1} style={tw`font-bold`}>
                  {suggetsHistory.history_title}
                </Text>
                <Text numberOfLines={1} style={tw`text-blue-500`}>
                  {suggetsHistory.history_url}
                </Text>
              </View>
            </View>
            <View>
              <ArrowSmUpIcon color="gray" rotation={45} />
            </View>
          </View>
        </TouchableHighlight>
      )}

      <View style={tw`flex-col w-full`}>
        {searchInput.length > 0 &&
          asyncSuggetion.map((keyword: string, index) => {
            if (searchInput === keyword) {
              return <></>;
            }
            return (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                style={tw`px-4 py-2`}
                onPress={event => handleSearchByKeyWord(event, keyword)}>
                <View style={tw`flex-row items-center justify-between`}>
                  <View style={tw`flex-row items-center flex-1 px-1`}>
                    <SearchIcon color="gray" width={25} />
                    <Text
                      style={tw`mx-2 text-lg text-gray-600 dark:text-white `}>
                      {keyword}
                    </Text>
                  </View>

                  <Pressable
                    onPress={event => hanleUpdateKeyWord(event, keyword)}>
                    <ArrowSmUpIcon color="gray" rotation={-45} />
                  </Pressable>
                </View>
              </TouchableHighlight>
            );
          })}
        {(asyncSuggetion.length === 0 || searchInput.length === 0) &&
          searchRecent.length > 0 && (
            <View>
              <Text
                style={tw`px-5 mt-5 font-bold text-gray-600 dark:text-white`}>
                Search recent
              </Text>
              {searchRecent.map((result: SearchRecent) => {
                const {keyword} = result;
                if (searchInput === keyword) {
                  return <></>;
                }
                return (
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#DDDDDD"
                    style={tw`px-4 py-2`}
                    onPress={event => handleSearchByKeyWord(event, keyword)}>
                    <View style={tw`flex-row items-center justify-between`}>
                      <View style={tw`flex-row items-center flex-1 px-1`}>
                        <ClockIcon color="gray" width={25} />
                        <Text
                          style={tw`mx-2 text-lg text-gray-600 dark:text-white `}>
                          {keyword}
                        </Text>
                      </View>

                      <Pressable
                        onPress={event => hanleUpdateKeyWord(event, keyword)}>
                        <ArrowSmUpIcon color="gray" rotation={-45} />
                      </Pressable>
                    </View>
                  </TouchableHighlight>
                );
              })}
              <View style={tw`flex-row justify-center`}>
                <TouchableOpacity onPress={handleClearSearchRecent}>
                  <Text style={tw`font-bold text-red-500`}>
                    Clear search recent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {searchInput.length > 0 && asyncSuggetion.length === 0 && (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            style={tw`px-4 py-2`}
            onPress={event => handleSearchByKeyWord(event, searchInput)}>
            <View style={tw`flex-row items-center px-1`}>
              <SearchIcon color="gray" width={25} />
              <Text style={tw`mx-2 text-lg text-gray-600 dark:text-white `}>
                {searchInput}
              </Text>
            </View>
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
};

export default React.memo(AddressBar);
