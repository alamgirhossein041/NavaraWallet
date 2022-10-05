import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import Google from '../../assets/icons/icon-google.svg';
import Facebook from '../../assets/icons/icon-facebook.svg';
import Telegram from '../../assets/icons/icon-telegram.svg';
import Twitter from '../../assets/icons/icon-twitter.svg';
import Github from '../../assets/icons/icon-github.svg';
import Mobile from '../../assets/icons/icon-mobile.svg';
import Email from '../../assets/icons/icon-email.svg';
import MenuItem from '../../components/MenuItem';
import {primaryColor} from '../../configs/theme';
import Button from '../../components/Button';
import HeaderScreen from '../../components/HeaderScreen';
import {useDarkMode} from '../../hooks/useDarkMode';

const ConnectedAccounts = ({navigation}) => {
  const accounts = [
    {
      icon: <Google width="100%" height="100%" />,
      name: 'Google',
      status: 'thisismygmail@gmail.com',
      onPress: () => {},
    },
    {
      icon: <Facebook width="100%" height="100%" />,
      name: 'Facebook',
      status: 'Not connected',
      onPress: () => {},
    },
    {
      icon: <Telegram width="100%" height="100%" />,
      name: 'Telegram',
      status: 'Not connected',
      onPress: () => {},
    },
    {
      icon: <Twitter width="100%" height="100%" />,
      name: 'Twitter',
      status: 'Not connected',
      onPress: () => {},
    },
    {
      icon: <Github width="100%" height="100%" />,
      name: 'Github',
      status: 'Not connected',
      onPress: () => {},
    },
    {
      icon: (
        <View style={tw`bg-[${primaryColor}] rounded-full p-1`}>
          <Mobile width="100%" height="100%" />
        </View>
      ),
      name: 'Mobile',
      status: 'Not connected',
      onPress: () => {},
    },
    {
      icon: (
        <View style={tw`bg-[${primaryColor}] rounded-full p-1`}>
          <Email width="100%" height="100%" />
        </View>
      ),
      name: 'Email',
      status: 'Not connected',
      onPress: () => {},
    },
  ];
 
  const modeColor = useDarkMode();
  return (
    <View style={tw`h-full flex flex-col  justify-between ${modeColor}`}>
      {/* <HeaderScreen title="Connected accounts" showBack /> */}
      <ScrollView style={tw`w-full px-4`}>
        <View style={tw`w-full flex flex-col items-center`}>
          <View style={tw`w-full mt-6 `}>
            <View style={tw`my-8`}>
              <Text style={tw`text-base text-red-400`}>Attention!</Text>
              <Text style={tw`text-sm text-gray-400`}>
                It requires at least 02 connected accounts for you to backup
                passphrase and re-import your wallet. ...
              </Text>
            </View>
            {accounts.map((account, index) => (
              <View key={index}>
                <MenuItem
                  icon={account.icon}
                  name={account.name}
                  value={account.status}
                  onPress={() => account.onPress()}
                  iconPadding={''}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConnectedAccounts;
