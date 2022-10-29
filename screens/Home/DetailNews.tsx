import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {tw} from '../../utils/tailwind';

const DetailNews = ({navigation, route}) => {
  return (
    <ScrollView style={tw`mx-1 my-5`}>
      <Text
        style={tw`dark:text-white  font-bold my-3 text-[20px] dark:text-white `}>
        {route.params.title}
      </Text>
      <Image
        source={route.params.imageDetail}
        style={{width: '100%', height: 200}}
      />
      <Text style={tw`dark:text-white  my-2 text-justify`}>
        {route.params.content}
      </Text>
    </ScrollView>
  );
};

export default DetailNews;
