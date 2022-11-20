import Clipboard from "@react-native-clipboard/clipboard";
import { ScrollView } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/solid";
import Blur from "../../assets/blur.png";
import IconMessenge from "../../assets/icons/icon-message-question.svg";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
// interface IViewSeedPhraseProps {
//   seedPhrase: [];
// }
export default function ViewSeedPhrase(props) {
  const { seedPhrase } = props;
  const [isShowSeed, setIsShowSeed] = useState(false);
  const copyToClipboard = () => {
    Clipboard.setString(seedPhrase.join(" "));
    toastr.info("Copied");
  };
  const { t } = useTranslation();

  return (
    <ScrollView style={tw`px-4 mb-15`} showsVerticalScrollIndicator={false}>
      <Text
        style={tw`dark:text-white  my-1 android:mt-5 ios:mt-10 text-2xl font-bold text-center`}
      >
        {t("import_seedphrase.your_seed_phrase")}
      </Text>
      <Text style={tw`dark:text-white  mx-5 my-1 text-center text-gray-500`}>
        {t("import_seedphrase.description_your_seed_phrase")}
      </Text>
      <TouchableOpacity
        style={tw`items-center my-2`}
        onPress={() => {
          setIsShowSeed(!isShowSeed);
        }}
      >
        {isShowSeed ? (
          <EyeIcon width={35} height={35} color="gray" />
        ) : (
          <EyeSlashIcon width={35} height={35} color="gray" />
        )}
      </TouchableOpacity>
      <View styles={tw`relative`}>
        <Image
          source={Blur}
          style={tw`absolute z-10 w-full h-full opacity-${
            isShowSeed ? "0" : "95"
          } rounded-xl`}
        />
        <View style={tw`relative flex flex-row flex-wrap items-center `}>
          {seedPhrase &&
            seedPhrase?.map((item, index) => {
              return (
                <View
                  activeOpacity={0.6}
                  key={index}
                  style={tw`flex flex-row items-center p-2 py-2 mx-auto my-2 bg-[${primaryColor}]/15 rounded-lg  w-26`}
                >
                  <View
                    style={tw`flex items-center justify-center w-5 h-5 mr-auto bg-white dark:bg-[#18191A]  rounded-full `}
                  >
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
          style={tw`mx-auto ${!isShowSeed && "hidden"}`}
          onPress={copyToClipboard}
        >
          <Text
            style={tw`text-center text-[${primaryColor}] font-bold text-[16px] my-3`}
          >
            {t("import_seedphrase.copy_to_clipboard")}
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={tw`mx-auto items-center dark:bg-gray-800 bg-gray-200  p-3 my-3 rounded-lg`}>
        <View style={tw`flex flex-row`}>
          <IconCloud style={tw``} />
          <Text style={tw`dark:text-white  font-bold text-[14px] mt-1`}>
            {t('import_seedphrase.backup_your_wallet')}
          </Text>
        </View>

        <Text style={tw`dark:text-white  text-center `}>
          {t('import_seedphrase.description_backup_your_wallet')}
        </Text>
      </View> */}
      <View
        style={tw`mx-auto items-center dark:bg-gray-800 bg-gray-200  p-3 mb-10 rounded-lg`}
      >
        <View style={tw`flex flex-row`}>
          <IconMessenge style={tw``} />
          <Text style={tw`dark:text-white  font-bold text-[14px] mt-1`}>
            {t("import_seedphrase.what_is_seed_phrase")}
          </Text>
        </View>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          {t("import_seedphrase.description_first")}
        </Text>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          {t("import_seedphrase.description_second")}
        </Text>
        <Text style={tw`dark:text-white  py-2 text-justify`}>
          {t("import_seedphrase.description_third")}
        </Text>
      </View>
    </ScrollView>
  );
}
