import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import IconChina from "../../../assets/icons/icon-cn.svg";
import IconEnglish from "../../../assets/icons/icon-eng.svg";
import IconFrance from "../../../assets/icons/icon-france.svg";
import IconPortugal from "../../../assets/icons/icon-portugal.svg";
import IconVietNam from "../../../assets/icons/icon-vi.svg";
import SearchBar from "../../../components/UI/SearchBar";
import { tw } from "../../../utils/tailwind";

import IconChecked from "../../../assets/icons/icon-check-select.svg";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

import i18next, { LanguageDetectorModule } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { languageSelected } from "../../../data/globalState/language";
import common_cn from "../../../language/cn.json";
import common_en from "../../../language/en.json";
import common_fr from "../../../language/fr.json";
import common_por from "../../../language/por.json";
import common_vi from "../../../language/vi.json";
import { SELECTED_LANGUAGE, TYPE_LANGUAGE } from "../../../utils/storage";

const languageDetector: LanguageDetectorModule = {
  type: "languageDetector",
  async: true,
  detect: () => {
    return "en";
  },

  init: () => {},
  cacheUserLanguage: () => {},
};

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: common_en,
      },
      vi: {
        translation: common_vi,
      },
      por: {
        translation: common_por,
      },
      fr: {
        translation: common_fr,
      },
      cn: {
        translation: common_cn,
      },
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const Language = () => {
  const [isSelected, setIsSelected] = useRecoilState(languageSelected);

  const [isLanguage, setIsLanguage] = useState([
    {
      id: 0,
      name: "English",
      label: "English",
      value: "en",
      icon: <IconEnglish />,
    },
    {
      id: 1,
      name: "Vietnam",
      label: "Vietnam",
      value: "vi",
      icon: <IconVietNam />,
    },
    {
      id: 2,
      name: "Portuguese",
      label: "Portuguese",
      value: "por",
      icon: <IconPortugal />,
    },
    {
      id: 3,
      name: "French",
      label: "French",
      value: "fr",
      icon: <IconFrance />,
    },
    {
      id: 4,
      name: "Chinese",
      label: "Chinese",
      value: "cn",
      icon: <IconChina />,
    },
  ]);
  const listLanguage = Object.values(isLanguage);
  const [listLanguageFiltered, setListLanguageFiltered] =
    useState(listLanguage);
  // const [isNameLanguage,setIsNameLanguage]=useRecoilState(nameLanguage)
  const [typeLanguage, setTypeLanguage] = useLocalStorage(TYPE_LANGUAGE);
  const [selectLanguage, setSelectLanguage] =
    useLocalStorage(SELECTED_LANGUAGE);

  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (item) => {
    i18n.changeLanguage(item.value);
    setSelectLanguage(item.value);
    setIsSelected(item.value);
  };
  return (
    <View>
      <View style={tw`w-full flex items-center justify-between px-4 `}>
        <SearchBar
          style={tw`dark:text-white p-2`}
          placeholder={t("search_bar.search_language")}
          list={listLanguage}
          filterProperty={["name"]}
          onListFiltered={(item: any[]) => setListLanguageFiltered(item)}
        />
      </View>
      {listLanguageFiltered &&
        listLanguageFiltered?.map((item, index) => {
          return (
            <View style={tw`my-5`}>
              <TouchableOpacity
                onPress={() => {
                  handleChangeLanguage(item);
                }}
                key={index}
                style={tw`w-full flex items-center justify-between px-4  flex-row`}
              >
                <View style={tw`flex flex-row`}>
                  <Text style={tw`mr-2 `}>{item.icon}</Text>
                  <Text style={tw`py-1 dark:text-white`}>{item.name}</Text>
                </View>
                <View>
                  {selectLanguage === item.value && (
                    <Text>
                      <IconChecked />
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
};
