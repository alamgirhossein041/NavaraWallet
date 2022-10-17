import {Image, Text, View} from 'native-base';
import React from 'react';
import {tw} from '../../utils/tailwind';
import BonusCryptoCard from '../Home/BonusCryptoCard';
import IconCopy from '../../assets/icons/icon-copy.svg';
import {ScrollView, Touchable, TouchableOpacity} from 'react-native';
import TextField from '../../components/TextField';
import IconNPoint from "../../assets/icons/icon-npoint.svg"

export const Rewards = () => {
  return (
    <ScrollView style={tw`bg-white `}>
      <View style={tw`items-center `}>
        <Image source={require('../../assets/bg-rewards.png')} />
      </View>
      <BonusCryptoCard description="Invite your friends with referral code and get special bonus" />
      <View
        style={tw`mx-4 py-5 flex bg-[#F0F9FF] flex-row items-center justìfy-content-between`}>
        <TouchableOpacity style={tw`mr-auto px-7`}>
          <IconCopy />
        </TouchableOpacity>
        <View style={tw`mx-auto`}>
          <Text>FGX4456R</Text>
        </View>
        <TouchableOpacity style={tw`px-5 ml-auto`}>
          <Text style={tw`text-[#2FA2B9]`}>Share</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw`text-center text-[12px] my-5`}>
        You earn 15 points for the first time using Navara's wallet
      </Text>
      <View
        style={tw`mx-4 py-5 flex bg-[#F0F9FF] flex-row items-center justìfy-content-between`}>
        <View style={tw`mr-auto px-7`}>
          <Text>Wallet1</Text>
        </View>

        <TouchableOpacity style={tw`ml-auto px-5`}>
          <Text style={tw``}>15 Npoint</Text>
        </TouchableOpacity>
      </View>
      <Text style={tw` mx-5 text-[12px] my-5`}>Who invites you?</Text>
      <View style={tw`mx-5`}>
        <TextField
          autoFocus
          type="text"
          // value={inputDomain.value}
          // onChangeText={onChangeText}
          label="Referral code"
          // err={inputDomain.error}
        />
      </View>
      <View style={tw`mx-auto my-5 items-center bg-[#F0F9FF] p-3 mx-5 rounded-lg`}>
        <View style={tw`flex flex-row`}>
          <IconNPoint style={tw``} />
          <Text style={tw`font-bold text-[14px] mt-1`}>
            Npoint
          </Text>
        </View>

        <Text style={tw`text-center `}>
          Write down or copy these words in the right order and save them
          somewhere safe. Please dont screenshot or paste clipboard to other
          apps that you can’t trust. Many app haves ability to read your seed
          phrase from that.
        </Text>
      </View>
    </ScrollView>
  );
};
