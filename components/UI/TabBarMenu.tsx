import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";

interface ITabBarMenu {
  itemTabBar?: string[];
  style?: string;
  children?: JSX.Element[];
}

const TabBarMenu = ({ itemTabBar, style = "p-4", children }: ITabBarMenu) => {
  const [tabSelected, setTabSelected] = React.useState(0);
  useColorScheme();
  return (
    <>
      <View style={tw`flex-row items-center justify-center ${style}`}>
        <View
          style={tw`flex flex-row w-full p-1 bg-gray-100 dark:bg-stone-800 rounded-2xl `}
        >
          {itemTabBar &&
            itemTabBar.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setTabSelected(index)}
                disabled={index === tabSelected}
                key={item}
                style={[
                  tw`${
                    tabSelected === index ? "bg-white dark:bg-[#18191A] " : ""
                  } flex-row justify-center w-1/2 p-3 rounded-xl `,
                ]}
              >
                <Text
                  style={tw`text-[${
                    tabSelected === index ? `${primaryColor}` : "#8e9bae"
                  }] font-bold text-center`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {children && (
        <View style={tw`flex-col items-center justify-start flex-1 w-full`}>
          {children[tabSelected]}
        </View>
      )}
    </>
  );
};

export default TabBarMenu;
