import React, {useState} from 'react';
import {LayoutAnimation, ScrollView, Switch, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Button from '../../components/Button';
import MenuItem from '../../components/MenuItem';
import {primaryColor, primaryGray} from '../../configs/theme';
import {useRecoilState} from 'recoil';
import {enabledNetworkState} from '../../data/globalState/networkData';
import networks from './NetworkData';
import SearchBar from '../../components/SearchBar';

const AddNetwork = ({navigation}) => {
  const [storedEnabledNetwork, setStoredEnabledNetwork] =
    useRecoilState(enabledNetworkState);
  const [enabledNetwork, setEnabledNetwork] =
    useState<string[]>(storedEnabledNetwork);
  const [networkList, setNetworkList] = useState<any[]>(
    networks.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }),
  );

  const onValueChange = (value: boolean, index: number) => {
    if (value) {
      if (enabledNetwork.indexOf(networkList[index].id) === -1)
        setEnabledNetwork([...enabledNetwork, networkList[index].id]);
    } else {
      setEnabledNetwork(
        enabledNetwork.filter(net => net !== networkList[index].id),
      );
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  return (
    <View style={tw`h-full p-4 flex flex-col  justify-between bg-white`}>
      {/* <HeaderScreen
        title={`Choose network (${enabledNetwork.length}/${networks.length})`}
      /> */}
      <Text style={tw`text-base mt-10`}>
        Choose network (${enabledNetwork.length}/${networks.length})
      </Text>
      <SearchBar
        style="mt-4"
        placeholder="Search for a network"
        list={networks}
        filterProperty={['name']}
        onListFiltered={(list: any[]) => setNetworkList(list)}
      />
      <ScrollView style={tw`w-full`}>
        <View style={tw`w-full flex flex-col items-center`}>
          <View style={tw`w-full mt-6`}>
            {networkList.map((network, index) => (
              <View style={tw``} key={index}>
                {enabledNetwork.indexOf(network.id) !== -1 && (
                  <MenuItem
                    icon={network.icon}
                    iconPadding={''}
                    name={network.name}
                    disabled
                    value={
                      <Switch
                        trackColor={{false: primaryGray, true: primaryColor}}
                        thumbColor="white"
                        onValueChange={value => onValueChange(value, index)}
                        value={enabledNetwork.indexOf(network.id) !== -1}
                      />
                    }
                    next={false}
                  />
                )}
              </View>
            ))}
            {networkList.map((network, index) => (
              <View style={tw``} key={index}>
                {enabledNetwork.indexOf(network.id) === -1 && (
                  <MenuItem
                    icon={network.icon}
                    iconPadding={''}
                    name={network.name}
                    disabled
                    value={
                      <Switch
                        trackColor={{false: primaryGray, true: primaryColor}}
                        thumbColor="white"
                        onValueChange={value => onValueChange(value, index)}
                        value={enabledNetwork.indexOf(network.id) !== -1}
                      />
                    }
                    next={false}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={tw`flex items-center w-full px-4`}>
        <Button
          onPress={() => {
            setStoredEnabledNetwork(enabledNetwork);
            navigation.goBack();
          }}>
          Confirm
        </Button>
      </View>
    </View>
  );
};

export default AddNetwork;
