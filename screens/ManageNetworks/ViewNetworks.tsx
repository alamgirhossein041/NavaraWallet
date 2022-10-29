import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import AllNetwork from '../../assets/icons/icon-all-networks.svg';
import Button from '../../components/Button';
import MenuItem from '../../components/MenuItem';
import networks from './NetworkData';
import {
  enabledNetworkState,
  selectedNetworkState,
} from '../../data/globalState/networkData';
import {useRecoilState, useRecoilValue} from 'recoil';
import RadioButton from '../../components/RadioButton';
import HeaderScreen from '../../components/HeaderScreen';

const ViewNetworks = ({navigation}) => {
  const [storedSelectedNetwork, setStoredSelectedNetwork] =
    useRecoilState(selectedNetworkState);
  const storedEnabledNetwork = useRecoilValue(enabledNetworkState);
  const [selectedNetwork, setSelectedNetwork] = useState(storedSelectedNetwork);
  let networkList = networks.filter(
    network => storedEnabledNetwork.indexOf(network.id) !== -1,
  );

  networkList = [
    {
      id: 'all',
      icon: <AllNetwork width="100%" height="100%" />,
      name: 'All Networks',
    },
    ...networkList,
  ];

  return (
    <View
      style={tw`h-full flex flex-col justify-between bg-white dark:bg-[#18191A] `}>
      {/* <HeaderScreen title="Select network" showBack /> */}
      <Text style={tw`dark:text-white  text-base mt-10`}>Select network</Text>
      <ScrollView style={tw`w-full px-4`}>
        <View style={tw`w-full flex flex-col items-center`}>
          <View style={tw`w-full mt-6`}>
            {networkList.map((network, index) => (
              <View style={tw``} key={index}>
                <MenuItem
                  icon={network.icon}
                  iconPadding={''}
                  name={network.name}
                  disabled
                  value={
                    <RadioButton
                      value={network.id === selectedNetwork}
                      onValueChange={() => setSelectedNetwork(network.id)}
                    />
                  }
                  next={false}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={tw`flex items-center w-full px-4`}>
        <Button
          onPress={() => {
            navigation.navigate('AddNetwork');
          }}>
          <Text
            style={tw`dark:text-white  text-center text-base font-medium text-white`}>
            Add network ({networkList.length - 1}/{networks.length})
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default ViewNetworks;
