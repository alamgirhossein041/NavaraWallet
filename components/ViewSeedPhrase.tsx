import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {tw} from '../utils/tailwind';
import {useDarkMode} from '../hooks/useModeDarkMode';
import {useTextDarkMode} from '../hooks/useModeDarkMode';
import {useGridDarkMode} from '../hooks/useModeDarkMode';
import {primaryColor, grayseedPhrase} from '../configs/theme';
import Clipboard from '@react-native-clipboard/clipboard';
import toastr from '../utils/toastr';
import IconCopy from '../assets/icons/icon-copy.svg';
import {EyeIcon, EyeOffIcon} from 'react-native-heroicons/outline';
import {ScrollView} from 'native-base';
import Blur from '../assets/blur.png';
import IconCloud from '../assets/icons/icon-cloud.svg';
import IconMessenge from '../assets/icons/icon-message-question.svg';
// interface IViewSeedPhraseProps {
//   seedPhrase: [];
// }
export default function ViewSeedPhrase(props) {
  const {seedPhrase} = props;
  const [isShowSeed, setIsShowSeed] = useState(false);
  const copyToClipboard = () => {
    Clipboard.setString(seedPhrase.join(' '));
    toastr.info('Copied');
  };
  return (
    <ScrollView style={tw`px-4 mb-15`} showsVerticalScrollIndicator={false}>
      <Text
        style={tw`dark:text-white  my-1 android:mt-5 ios:mt-10 text-2xl font-bold text-center`}>
        Your seed phrase
      </Text>
      <Text style={tw`dark:text-white  mx-5 my-1 text-center text-gray-500`}>
        Your seed phrase is used to generate and recover your wallet. Backup it
        to safety place.
      </Text>
      <TouchableOpacity
        style={tw`items-center my-2`}
        onPress={() => {
          setIsShowSeed(!isShowSeed);
        }}>
        {isShowSeed ? (
          <EyeIcon width={35} height={35} color="gray" />
        ) : (
          <EyeOffIcon width={35} height={35} color="gray" />
        )}
      </TouchableOpacity>
      <View styles={tw`relative`}>
        <Image
          source={Blur}
          style={tw`absolute z-10 w-full h-full opacity-${
            isShowSeed ? '0' : '95'
          } rounded-xl`}
        />
        <View style={tw`relative flex flex-row flex-wrap items-center `}>
          {seedPhrase &&
            seedPhrase?.map((item, index) => {
              return (
                <View
                  activeOpacity={0.6}
                  key={index}
                  style={tw`flex flex-row items-center p-2 py-2 mx-auto my-2 bg-[${primaryColor}]/15 rounded-lg  w-26`}>
                  <View
                    style={tw`flex items-center justify-center w-5 h-5 mr-auto bg-white dark:bg-[#18191A]  rounded-full `}>
                    <Text style={tw`dark:text-white  font-bold`}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={tw`dark:text-white  mr-auto font-semibold`}>
                    {item}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
      <View style={tw` h-12`}>
        <TouchableOpacity
          style={tw`mx-auto ${!isShowSeed && 'hidden'}`}
          onPress={copyToClipboard}>
          <Text
            style={tw`text-center text-[${primaryColor}] font-bold text-[16px] my-3`}>
            Copy to clipboard
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={tw`mx-auto items-center dark:bg-gray-800 bg-gray-200  p-3 my-3 rounded-lg`}>
        <View style={tw`flex flex-row`}>
          <IconCloud style={tw``} />
          <Text style={tw`dark:text-white  font-bold text-[14px] mt-1`}>
            Backup Your Wallet
          </Text>
        </View>

        <Text style={tw`dark:text-white  text-center `}>
          Write down or copy these words in the right order and save them
          somewhere safe. Please dont screenshot or paste clipboard to other
          apps that you can’t trust. Many app haves ability to read your seed
          phrase from that.
        </Text>
      </View>
      <View
        style={tw`mx-auto items-center dark:bg-gray-800 bg-gray-200  p-3 mb-10 rounded-lg`}>
        <View style={tw`flex flex-row`}>
          <IconMessenge style={tw``} />
          <Text style={tw`dark:text-white  font-bold text-[14px] mt-1`}>
            What's seed phrase ?
          </Text>
        </View>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          Seed phrase is an universal standard for private key generation in all
          blockchains.
        </Text>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          It’s more user-frendly, human-readable and even secure (in practice)
          than primitive private-key- only solutions.
        </Text>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          Just with onr suite of seed phrase, you can access all blockchains and
          create multiple accounts.
        </Text>
      </View>
    </ScrollView>
  );
}
