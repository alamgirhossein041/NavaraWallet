import {View, Text} from 'react-native';
import React from 'react';
import SelectOption from '../../components/SelectOption';

export default function SelectChain() {
  return (
    <View>
      <SelectOption
        onSetValue={() => {}}
        value={'Ethereum'}
        options={[
          {
            label: 'Ethereum',
            value: 'ethereum',
          },
        ]}
      />
    </View>
  );
}
