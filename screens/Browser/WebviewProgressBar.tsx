import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
export default function WebviewProgressBar(props) {
  const { progress } = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    //@ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    //@ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (progress === 1) {
      fadeOut();
    } else if (progress < 1 && progress > 0) {
      fadeIn();
    }
  }, [progress]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={tw`bg-white dark:bg-[#18191A] h-[2px] w-full`}>
        <View
          style={[
            tw`bg-[${primaryColor}] h-[2px] `,
            {
              width: `${(100 / 1) * progress}%`,
            },
          ]}
        ></View>
      </View>
    </Animated.View>
  );
}
