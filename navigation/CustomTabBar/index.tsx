import React from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import IconBrowser from '../../assets/logo/logo.svg';
import IconCategory from '../../assets/icons/icon-category.svg';
import IconChart from '../../assets/icons/icon-chart.svg';
import IconHome from '../../assets/icons/icon-home.svg';
import IconProfile from '../../assets/icons/icon-profile.svg';
import PressableAnimated from '../../components/PressableAnimated';
import PressableAnimatedSpin from '../../components/PressableAnimatedSpin';
import {focusedColor, primaryColor, primaryGray} from '../../configs/theme';
import {tw} from '../../utils/tailwind';
import {getPath, getPathUp} from './path';
import {useNavigation} from '@react-navigation/native';
const {width: maxWidth} = Dimensions.get('window');

const CustomTabBar = ({state, descriptors, navigation}) => {
  const insets = useSafeAreaInsets();
  const theme = useColorScheme();
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  const isHideTabBar = focusedOptions?.tabBarStyle?.display === 'none';

  if (isHideTabBar) {
    return null;
  }
  const SVG: any = Svg;
  const PATH: any = Path;

  const type = 'DOWN';
  const bottomInset = insets.bottom;
  const height = 65;
  const barHeight = height + bottomInset;
  const circleWidth = height - 10;
  const bgColor = theme === 'light' ? 'white' : '#18191A';
  const d =
    type === 'DOWN'
      ? getPath(
          maxWidth,
          barHeight,
          circleWidth >= 50 ? circleWidth : 50,
          bottomInset,
        )
      : getPathUp(
          maxWidth,
          barHeight + 30,
          circleWidth >= 50 ? circleWidth : 50,
          bottomInset,
        );

  return (
    <Animated.View style={tw`absolute bottom-0 z-10 w-full shadow-lg`}>
      <SVG width={maxWidth} height={barHeight + (type === 'DOWN' ? 0 : 30)}>
        <PATH
          stroke="gray"
          strokeWidth={Platform.OS === 'android' ? 0.1 : 0}
          fill={bgColor}
          {...{d}}
        />
      </SVG>
      <Animated.View
        style={[
          {
            height: barHeight,
          },
          tw`absolute bottom-0 z-10 flex flex-row items-center justify-around w-full`,
        ]}>
        {state?.routes.map(
          (
            route: {key: string | number; name: any},
            index: number,
            array: any[],
          ) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({name: route.name, merge: true});
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <View
                key={index}
                style={tw`items-center justify-center flex-1 dark:bg-[#18191A]`}>
                {index === Math.floor(array.length / 2) ? (
                  <View
                    style={[
                      {
                        width: height,
                        height: height,
                        borderRadius: height / 2,
                        bottom:
                          bottomInset > 0
                            ? barHeight - circleWidth
                            : circleWidth / 2,
                      },
                      tw`${
                        type === 'DOWN' &&
                        ' bg-white dark:bg-[#1f2124] shadow-lg'
                      }`,
                    ]}>
                    <PressableAnimatedSpin
                      onPress={() => navigation.navigate('Browser')}
                      accessibilityRole="button"
                      // onPress={}
                      style={tw`items-center justify-center flex-1`}>
                      {getIcon('Browser', 46, 'white')}
                    </PressableAnimatedSpin>
                  </View>
                ) : (
                  <PressableAnimated
                    accessibilityRole="button"
                    accessibilityState={isFocused ? {selected: true} : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={tw`items-center justify-center flex-1`}>
                    {theme === 'light'
                      ? getIcon(
                          label,
                          24,
                          isFocused ? focusedColor : primaryGray,
                        )
                      : getIcon(
                          label,
                          24,
                          isFocused ? primaryGray : focusedColor,
                        )}
                    <Text
                      style={tw`font-medium text-[${
                        isFocused ? focusedColor : primaryGray
                      }] dark:text-[${
                        isFocused ? primaryGray : focusedColor
                      }]`}>
                      {label}
                    </Text>
                  </PressableAnimated>
                )}
              </View>
            );
          },
        )}
      </Animated.View>
    </Animated.View>
  );
};

const getIcon = (name: string, size: number, color: string) => {
  switch (name) {
    case 'Home':
      return <IconHome width={size} height={size} fill={color} />;
    case 'Invest':
      return <IconChart width={size} height={size} fill={color} />;
    case 'Browser':
      return <IconBrowser width={size} height={size} fill={color} />;
    case 'More':
      return <IconCategory width={size} height={size} fill={color} />;
    case 'Profile':
      return <IconProfile width={size} height={size} fill={color} />;
    default:
      return <></>;
  }
};

export default CustomTabBar;
