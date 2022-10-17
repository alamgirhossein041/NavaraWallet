import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import MenuItem from '../../components/MenuItem';
import {useRecoilState} from 'recoil';
import {selectedTokenState} from '../../data/globalState/tokenData';
import tokens from './TokenData';
import SelectButton from '../../components/SelectButton';
import SelectNetwork from './SelectNetwork';
import NetworkGroup from './NetworkGroup';
import HeaderScreen from '../../components/HeaderScreen';
import {bgGray} from '../../configs/theme';
import SearchBar from '../../components/SearchBar';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';

const AddToken = ({navigation}) => {
  const [storedSelectedToken, setStoredSelectedToken] =
    useRecoilState(selectedTokenState);
  const [selectedToken, setSelectedToken] =
    useState<string[]>(storedSelectedToken);
  const [tokenList, setTokenList] = useState<any[]>(
    tokens.sort((a, b) => {
      if (a.networkId < b.networkId) {
        return -1;
      }
      if (a.networkId > b.networkId) {
        return 1;
      }
      return 0;
    }),
  );
  const [searchText, setSearchText] = useState<string>('');
  // store the selected token in global state
  const onValueChange = (token: any, value: boolean) => {
    if (value) {
      if (selectedToken.indexOf(token.id) === -1)
        setSelectedToken([...selectedToken, token.id]);
    } else {
      setSelectedToken(selectedToken.filter(net => net !== token.id));
    }
  };

  // change the network of the tokens in the list
  const onSetValue = (value: string) => {
    if (value === 'all') {
      setTokenList(tokens);
      setSearchText('');
    } else {
      setTokenList(tokens.filter(token => token.networkId === value));
      setSearchText(value);
    }
  };
  useEffect(() => {
    setStoredSelectedToken(selectedToken);
  }, [selectedToken]);

  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  return (
    <View style={tw`h-full flex flex-col ${modeColor}`}>
      {/* <HeaderScreen
        title="Add token"
        showBack
        right={<SelectNetwork onSetValue={(value) => onSetValue(value)} />}
      /> */}
      <View style={tw`ml-auto px-4`}>
        <SelectNetwork onSetValue={value => onSetValue(value)} />
      </View>

      <View style={tw`w-full flex items-center justify-between px-4 `}>
        <SearchBar
          style="my-1"
          placeholder="Search for a token or contract"
          list={tokens}
          filterProperty={['name']}
          onListFiltered={(list: any[]) => setTokenList(list)}
          onChangeText={text => setSearchText(text)}
        />
      </View>

      <View
        style={tw`w-full flex-1 flex-col items-center justify-between p-4 bg-white rounded-t-3xl ${modeColor}`}>
        <ScrollView style={tw`w-full flex `}>
          <View style={tw`w-full flex flex-col items-center`}>
            <View style={tw`w-full`}>
              {tokenList.map((token, index) => (
                <View style={tw``} key={index}>
                  {/* show network group when searching */}
                  {searchText.length > 0 ? (
                    <>{NetworkGroup(token.networkId, index, tokenList)}</>
                  ) : (
                    <>
                      {index === 0 && (
                        <Text style={tw`text-base mb-4 ${textColor}`}>
                          Common tokens
                        </Text>
                      )}
                    </>
                  )}
                  <MenuItem
                    icon={token.icon}
                    iconPadding={''}
                    name={
                      <View style={tw`flex flex-row items-center`}>
                        <Text style={tw`text-base dark:text-white`}>
                          {token.name}
                        </Text>
                        <Text style={tw`text-xs text-gray-500 dark:text-white`}>
                          ({token.symbol})
                        </Text>
                      </View>
                    }
                    disabled
                    value={
                      <SelectButton
                        rlt
                        value={selectedToken.indexOf(token.id) !== -1}
                        onValueChange={value => {
                          onValueChange(token, value);
                        }}>
                        {token.address}
                      </SelectButton>
                    }
                    next={false}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddToken;
