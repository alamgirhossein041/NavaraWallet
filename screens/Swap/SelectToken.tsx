import React, {useState} from 'react';
import {useQuery} from 'react-query';
import TokenIcon from '../../components/TokenIcon';
import API from '../../data/api';
import {IToken} from '../../data/types';
import {
  useDarkMode,
  useGridDarkMode,
  useTextDarkMode,
} from '../../hooks/useModeDarkMode';
import ModalSelectOption, {IOption} from './ModalSelectOption';

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
  const [options, setOptions] = useState<IOption[]>();

  //text darkmode

  //grid, shadow darkmode

  const {
    isLoading,
    data: listTokens,
    isError,
  } = useQuery(
    ['tokens', chainId, searchValue],
    async (): Promise<IToken[]> => {
      const params =
        searchValue.length > 0
          ? {
              chainId: chainId,
              symbol: searchValue.length > 0 && searchValue.toLowerCase(),
            }
          : {
              chainId: chainId,
            };

      const response = await API.get('/tokens', {
        params: params,
      });

      const _listTokens = response as any;
      const _options = _listTokens.map((token: IToken) => {
        return {
          label: token.symbol,
          value: token.address,
          iconUri: token.img,
        };
      });
      setOptions(_options);
      return _listTokens;
    },
  );

  return (
    <ModalSelectOption
      icon={<TokenIcon uri={iconUri} />}
      loading={isLoading}
      error={isError ? 'Cannot load' : undefined}
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
