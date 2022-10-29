import React from 'react';
import {View} from 'react-native';
import ImportSeedPhrase from '../../components/ImportSeedPhrase';
import {tw} from '../../utils/tailwind';
const ImportWallet = props => {
  return (
    <View
      style={tw`flex flex-col justify-between h-full px-2 bg-white dark:bg-[#18191A] `}>
      <ImportSeedPhrase {...props} />
    </View>
  );
};

export default ImportWallet;
