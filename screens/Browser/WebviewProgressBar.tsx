import React, {useEffect} from 'react';
import {primaryColor} from '../../configs/theme';
import ProgressBar from 'react-native-progress/Bar';
import {View} from 'react-native';
import {tw} from '../../utils/tailwind';
export default function WebviewProgressBar(props) {
  const {progress} = props;
  const [isShow, setIsShow] = React.useState(progress > 0);

  const hide = () => {
    setTimeout(() => {
      setIsShow(false);
    }, 0);
  };
  const show = () => {
    setIsShow(true);
  };

  useEffect(() => {
    if (progress === 1) {
      hide();
    } else if (!isShow && progress !== 1) {
      show();
    }
  }, [progress]);

  return (
    <View>
      {isShow ? (
        <ProgressBar
          progress={progress}
          color={primaryColor}
          width={null}
          height={3}
          borderRadius={0}
          borderWidth={0}
          useNativeDriver
        />
      ) : (
        <View style={tw`h-1`}></View>
      )}
    </View>
  );
}
