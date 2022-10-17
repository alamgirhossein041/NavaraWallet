import React, {useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {useDarkMode} from '../hooks/useModeDarkMode';
import {useLocalStorage} from '../hooks/useLocalStorage';
import {COLOR_SCHEME} from '../utils/storage';
import {tw} from '../utils/tailwind';

interface IAnimatedScrollProps {
  animatedHeader?: JSX.Element;
  children?: JSX.Element;
  styleBottomSheet?: boolean;
}

const AnimatedScrollView = ({
  animatedHeader,
  children,
  styleBottomSheet = false,
}: IAnimatedScrollProps) => {
  const {height: screenHeight} = useWindowDimensions();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollRef, setScrollRef] = useState(null);
  const [colorSchemeRecoil] = useLocalStorage(COLOR_SCHEME);
  const modeColor = useDarkMode();

  const onScrollEndDragHandler = (
    scrollEvent: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const scrolling = scrollEvent.nativeEvent.contentOffset.y;
    if (scrolling <= headerHeight) {
      if (scrolling > headerHeight / 2) {
        scrollRef.scrollTo({
          x: 0,
          y: headerHeight,
          animated: true,
        });
      } else {
        scrollRef.scrollTo({
          x: 0,
          y: 0,
          animated: true,
        });
      }
    }
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      // stickyHeaderIndices={[1]}
      ref={ref => {
        setScrollRef(ref);
      }}
      onScrollEndDrag={scrollEvent => onScrollEndDragHandler(scrollEvent)}>
      <View
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          setHeaderHeight(layout.height);
        }}>
        {animatedHeader}
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        style={[
          tw`flex-1 pt-2  ${
            styleBottomSheet && 'rounded   h-full overflow-hidden'
          }`,
          {
            minHeight: (screenHeight * 4) / 3,
          },
        ]}>
        {children}
      </ScrollView>
    </ScrollView>
  );
};

export default AnimatedScrollView;
