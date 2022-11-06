import {View, Text} from 'react-native';
import React from 'react';
import {Skeleton} from 'native-base';
import {tw} from '../../utils/tailwind';

const NewsSkeleton = () => {
  return (
    <View>
      {[...Array(3)].map((_, index) => (
        <View
          key={index}
          style={tw`flex-row justify-between p-2 mb-3 bg-white dark:bg-[#18191A]  rounded-full`}>
          <View>
            <Skeleton rounded="lg" h={'4'} width={200} mb="1" />
            <Skeleton rounded="lg" h={'4'} width={150} mb="1" />
            <Skeleton rounded="lg" h={'3'} w={'16'} />
          </View>
          <View style={tw`right-4`}>
            <Skeleton rounded="lg" h={'16'} w={'16'} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default NewsSkeleton;
