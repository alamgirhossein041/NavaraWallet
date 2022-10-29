import {Heading, HStack, Skeleton, Spinner} from 'native-base';
import React, {FunctionComponent} from 'react';

import {View} from 'react-native';
import {primaryColor} from '../configs/theme';
import {useWalletSelected} from '../hooks/useWalletSelected';
import {tw} from '../utils/tailwind';

/**
 * @param children: JSX.Element
 * @return React.Suspense for Recoil async state
 */
interface ILoading {
  children: JSX.Element;
  type?: 'spin' | 'skeleton';
}
const Loading = ({children, type = 'spin'}: ILoading) => {
  return (
    <React.Suspense
      fallback={
        <View>
          {type === 'spin' && <SpinnerLoading />}
          {type === 'skeleton' && <SkeletonFlatList />}
        </View>
      }>
      {children}
    </React.Suspense>
  );
};
const SpinnerLoading = () => {
  return (
    <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel="Loading" color={primaryColor} />
    </HStack>
  );
};
const SkeletonFlatList = () => {
  const {enabledNetworks} = useWalletSelected();
  return (
    <View>
      {[...Array(enabledNetworks.length || 3)].map((_, index) => (
        <View
          key={index}
          style={tw`flex-row items-center mb-1 bg-white dark:bg-[#18191A]  rounded-full`}>
          <View style={tw`mr-3`}>
            <Skeleton size="12" rounded="full" />
          </View>
          <View>
            <Skeleton rounded="lg" h={'3'} w={'32'} mb="1" />
            <Skeleton rounded="lg" h={'3'} w={'8'} />
          </View>
          <View style={tw`absolute right-4`}>
            <Skeleton rounded="lg" h={'3'} w={'16'} />
          </View>
        </View>
      ))}
    </View>
  );
};
export {SkeletonFlatList};
export default Loading;
