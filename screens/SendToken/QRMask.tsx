/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import { Animated, Dimensions, Easing, Platform, View } from "react-native";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

const SCREEN_HEIGHT = Dimensions.get("screen").height;
const SCREEN_WIDTH = Dimensions.get("screen").width;
const frameSize = 200;

const scanAreaX = (SCREEN_WIDTH - frameSize) / (2 * SCREEN_WIDTH);
const scanAreaY = (SCREEN_HEIGHT - frameSize) / (2 * SCREEN_HEIGHT);
const scanAreaWidth = frameSize / SCREEN_WIDTH;
const scanAreaHeight = frameSize / SCREEN_HEIGHT;

const bg = "bg-black/80";
const padding = 15;
const duration = 2000;

export const rectOfInterest =
  Platform.OS === "ios"
    ? {
        rectOfInterest: {
          x: scanAreaX,
          y: scanAreaY,
          width: scanAreaWidth,
          height: scanAreaHeight,
        },
      }
    : {};

const QRMask = () => {
  const animationValues = new Animated.Value(0);
  const lineAnimation = animationValues.interpolate({
    inputRange: [0, 1],
    outputRange: [padding, frameSize - padding],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValues, {
          toValue: 1,
          duration: duration,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(animationValues, {
          toValue: 0,
          duration: duration,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animationValues]);

  return (
    <>
      <View style={tw`flex-col w-full h-full`}>
        <View style={tw`flex-1 w-full ${bg}`} />

        <View
          style={[
            tw`flex-row items-center justify-between w-screen`,
            {
              height: frameSize,
            },
          ]}
        >
          {[...Array(2)].map((item) => (
            <View
              key={item}
              style={[
                tw`${bg}`,
                {
                  width: (SCREEN_WIDTH - frameSize) / 2,
                  height: frameSize,
                },
              ]}
            />
          ))}
        </View>
        <View style={tw`flex-1 w-full ${bg}`} />
      </View>
      <View style={tw`absolute z-20 items-center justify-center w-full h-full`}>
        <View
          style={[
            tw`relative w-full h-full`,
            {
              width: frameSize,
              height: frameSize,
            },
          ]}
        >
          <View
            style={[
              tw`absolute flex-row justify-between w-full`,
              {
                width: frameSize + 2 * padding,
                top: -padding,
                left: -padding,
              },
            ]}
          >
            <Edge rotate={0} />
            <Edge rotate={90} />
          </View>
          <View
            style={[
              tw`absolute flex-row justify-between w-full`,
              {
                width: frameSize + 2 * padding,
                bottom: -padding,
                left: -padding,
              },
            ]}
          >
            <Edge rotate={270} />
            <Edge rotate={180} />
          </View>
          <Animated.View
            style={[
              tw`absolute z-30 top-0 w-full h-1 bg-[${primaryColor}]`,
              {
                transform: [
                  {
                    translateY: lineAnimation,
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </>
  );
};

const Edge = ({ rotate }: { rotate: number }) => {
  return (
    <View
      style={[
        tw`w-10 h-10 border-l-[1] border-t-[1] rounded-tl-xl border-[${primaryColor}]`,
        {
          transform: [{ rotate: `${rotate}deg` }],
        },
      ]}
    />
  );
};
export default QRMask;
