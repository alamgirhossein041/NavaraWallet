import React, {useEffect, useState} from 'react';
import {Switch, Text, TouchableOpacity, View} from 'react-native';
import {CheckIcon} from 'react-native-heroicons/solid';
import {primaryColor, primaryGray} from '../../../configs/theme';
import {useLocalStorage} from '../../../hooks/useLocalStorage';
import {ENABLE_NETWORKS, TYPE_NETWORKS} from '../../../utils/storage';
import {tw} from '../../../utils/tailwind';

const DeveloperOptions = () => {
  const [isShow, setIsShow] = useLocalStorage(ENABLE_NETWORKS, false);
  const [isSelected, setIsSelected] = useState(0);
  const [typeNetworks, setTypeNetworks] = useLocalStorage(TYPE_NETWORKS);

  const type = [
    {id: 0, name: 'Mainet', label: 'MAINNET'},
    {id: 1, name: 'Testnet', label: 'TESTNET'},
  ];

  const itemPick = type.find(item => item.id === isSelected);

  useEffect(() => {
    setTypeNetworks(itemPick.label);
  }, [itemPick]);

  return (
    <View style={tw`mx-2 p-2`}>
      <View>
        <View style={tw` flex flex-row items-center justify-between`}>
          <Text style={tw`ml-2 text-gray-400 text-sm dark:text-white`}>
            Testnet Availability
          </Text>

          <View style={tw`flex flex-row items-center `}>
            <Switch
              trackColor={{false: primaryGray, true: primaryColor}}
              thumbColor="white"
              onValueChange={value => setIsShow(!isShow)}
              value={isShow}
            />
          </View>
        </View>
      </View>
      {isShow && (
        <View style={tw`border-t border-slate-200 mt-5`}>
          {type?.map((item, key) => {
            return (
              <View>
                {isSelected === key ? (
                  <TouchableOpacity
                    style={tw` my-5  flex flex-row items-center justify-between`}>
                    <Text
                      style={tw`ml-2 text-gray-400 text-sm dark:text-white`}>
                      {item.name}
                    </Text>

                    <View style={tw`flex flex-row items-center`}>
                      <CheckIcon width={30} height={30} fill={primaryColor} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setIsSelected(item.id);
                    }}
                    style={tw` my-5  flex flex-row items-center justify-between`}>
                    <Text
                      style={tw`ml-2 text-gray-400 text-sm dark:text-white`}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default DeveloperOptions;
