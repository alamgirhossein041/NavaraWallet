import axios from 'axios';
import React, {useEffect, useState} from 'react';
import ActionsheetSelectOption, {IOption} from './ActionsheetSelectOption';
import TokenIcon from '../../components/TokenIcon';
import {apiUrl} from '../../configs/apiUrl';
import {IToken} from '../../data/types';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';

type SelectNetworkProps = {
  value: string;
  onSetValue?: (value: IToken) => void;
  iconUri?: string;
  disabledValue?: string;
  chainId?: number | string;
};

const SelectToken = ({
  value,
  onSetValue = () => {},
  iconUri,
  disabledValue,
  chainId,
}: SelectNetworkProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [listTokens, setListTokens] = useState<IToken[]>();
  const [options, setOptions] = useState<IOption[]>();
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode

  const gridColor = useGridDarkMode();
  useEffect(() => {
    (async () => {
      const params = {
        chainId: chainId,
        limit: 20,
        symbol: searchValue.length > 0 ? searchValue : 'normal',
      };

      const response = await axios.get(`${apiUrl}/tokens`, {
        params: params,
      });

      const _listTokens = response.data;
      setListTokens(_listTokens);
      const _options = _listTokens.map((token: IToken) => {
        return {
          label: token.symbol,
          value: token.address,
          iconUri: token.img,
        };
      });

      setOptions(_options);
    })();
  }, [chainId, searchValue]);

  return (
    <ActionsheetSelectOption
      icon={<TokenIcon uri={iconUri} />}
      iconSize="w-10 h-10"
      filterType="debounce"
      searchValue={searchValue}
      handleChange={text => {
        setSearchValue(text);
      }}
      stringStyle="font-semibold text-base"
      value={value === '' ? 'Select' : value}
      disabledValue={disabledValue}
      options={options}
      onSetValue={address => {
        const token = listTokens.find(t => t.address === address);
        onSetValue(token);
      }}
    />
  );
};

export default SelectToken;
