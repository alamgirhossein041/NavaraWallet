import { Skeleton } from "native-base";
import React from "react";
import { View } from "react-native";
import { tw } from "../../utils/tailwind";

const NewsSkeleton = ({ limit }) => {
  return (
    <View>
      {[...Array(limit)].map((_, index) => (
        <View
          key={index}
          style={tw`flex-row justify-between p-2 mb-3 bg-white dark:bg-[#18191A]  rounded-full`}
        >
          <View>
            <Skeleton rounded="lg" h={"4"} width={200} mb="1" />
            <Skeleton rounded="lg" h={"4"} width={150} mb="1" />
            <Skeleton rounded="lg" h={"3"} w={"16"} />
          </View>
          <View style={tw`px-1`}>
            <Skeleton rounded="lg" h={"24"} w={"24"} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default NewsSkeleton;
