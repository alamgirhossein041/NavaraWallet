import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { primaryColor } from "../../configs/theme";
export default function WebviewProgressBar(props) {
  const { progress } = props;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    //@ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    //@ts-ignore
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (progress === 1) {
      fadeOut();
    } else if (progress < 1 && progress > 0.2) {
      fadeIn();
    }
  }, [progress]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ProgressBar
        progress={progress}
        color={primaryColor}
        width={null}
        height={3}
        borderRadius={0}
        borderWidth={0}
      />
    </Animated.View>
  );
}
