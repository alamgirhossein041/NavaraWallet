import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import SearchBar from '../../../components/SearchBar';
import TextField from '../../../components/TextField';
import {tw} from '../../../utils/tailwind';
import IconEnglish from '../../../assets/icons/icon-eng.svg';
import IconVietNam from '../../../assets/icons/icon-vi.svg';
import IconChecked from '../../../assets/icons/icon-check-select.svg';
import {Icon} from 'native-base';
import CheckBox from '../../../components/CheckBox';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { TYPE_LANGUAGE } from '../../../utils/storage';
import { languageSelected } from '../../../data/globalState/language';
import { useRecoilState } from 'recoil';
export const Language = () => {
    const [isSelected, setIsSelected] = useRecoilState(languageSelected);
  const [isLanguage, setIsLanguage] = useState([
    {id: 0, name: 'English',label: 'English',  icon: <IconEnglish />},
    {id: 1, name: 'Vietnam',label: 'Vietnam', icon: <IconVietNam />},
  ]);

  const [typeLanguage,setTypeLanguage] = useLocalStorage(TYPE_LANGUAGE)
 
  
  const itemPick = isLanguage.find(item => item.id === isSelected);

  useEffect(() => {
    setTypeLanguage(itemPick.label);
  }, [itemPick]);
  console.log(isSelected)
  return (
    <View>
      <View style={tw`w-full flex items-center justify-between px-4 `}>
        <SearchBar
          placeholder="Search language"
          //   list={tokens}
          filterProperty={['name']}
          //   onListFiltered={(list: any[]) => setTokenList(list)}
          //   onChangeText={text => setSearchText(text)}
        />
      </View>
      {isLanguage.map((item, index) => {
        return <View style={tw`my-5`}>
          <TouchableOpacity
           onPress={() => {
            setIsSelected(item.id);
          }}
            style={tw`w-full flex items-center justify-between px-4  flex-row`}>
            <View style={tw`flex flex-row`}>
              <Text style={tw`mr-2`}>{item.icon}</Text>
              <Text style={tw`py-1`}>{item.name}</Text>
            </View>
            <View>
              {/* <CheckBox
            // check={confirmStep.theFirst}
            onPress={() => {
              console.log("123")
            }}
            
          /> */}
             {isSelected === index && <Text><IconChecked/></Text>} 
            </View>
          </TouchableOpacity>
        </View>;
      })}


      
    </View>
  );
};
