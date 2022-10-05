import { ScrollView } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import InputIcon from '../../components/InputIcon';
import { primaryGray } from '../../configs/theme';
import IconScanSeedPhrase from "../../assets/icons/icon-scan-seedphrase.svg";
import { tw } from "../../utils/tailwind";
const ImportByPrivateKey = () => {
  return (
    <ScrollView style={tw``}>
      <View style={tw`h-full`}>
        <InputIcon
          style="my-1 mx-2 "
          styleText={`border border-[${primaryGray}]  text-black w-full rounded-full px-3 py-2 mx-2`}
          type="text"
          title="Private key : "

          placeholder="e.g Trading"
          icon={
            <View>
              <TouchableOpacity activeOpacity={0.6} style={tw``}>
                <IconScanSeedPhrase width={30} height={30} />
              </TouchableOpacity>
            </View>
          }
        />
        <InputIcon
          style="my-1 mx-2 "
          styleText={`border border-[${primaryGray}] text-black w-full rounded-full px-3 py-2 mx-2 `}
          type="text"
          title="Wallet nickname : "
          placeholder="e.g Trading"
        />
        <View style={tw`mx-5 my-3`}>
          <Button stringStyle="py-1 px-5 text-white rounded-full  ">
            Connect Wallet
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default ImportByPrivateKey;