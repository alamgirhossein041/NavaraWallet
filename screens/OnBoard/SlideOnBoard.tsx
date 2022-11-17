import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ImageOnBoard1 from "../../assets/logo/onboard-1.svg";
import ImageOnBoard2 from "../../assets/logo/onboard-2.svg";
import ImageOnBoard3 from "../../assets/logo/onboard-3.svg";
import Button from "../../components/UI/Button";
import { primaryColor, primaryGray } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
const SlideOnBoard = ({ navigation }) => {
  const onboard = [
    {
      img: <ImageOnBoard1 width="100%" height="100%" />,
      title: "Simple & Secure Crypto Wallet",
      desc: `Navara is the key to your manage your assets with simple & secure by design`,
    },
    {
      img: <ImageOnBoard2 width="100%" height="100%" />,
      title: "Secure Web3 Browser",
      desc: "Navara give you an web3 adblock browser with security & privacy in mind. You can access DApp of any networks",
    },
    {
      img: <ImageOnBoard3 width="100%" height="100%" />,
      title: "Free Unique Web3 Name",
      desc: "Navara give you a free unique domain name, one name for all address, no more copying and pasting long addresses",
    },
  ];

  const SLIDER_WIDTH = Dimensions.get("window").width + 8;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
  const IMAGE_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
  const [dotIndex, setDotIndex] = useState(0);
  const renderItem = ({ item, index }) => {
    return (
      <View key={index} style={tw`flex-col items-center justify-start`}>
        <View
          style={[
            tw`items-center justify-center`,
            { width: SLIDER_WIDTH, height: IMAGE_WIDTH },
          ]}
        >
          {item.img}
        </View>
        <View style={tw`py-5`}>
          <Text
            style={tw`text-2xl font-bold text-center text-black dark:text-white `}
          >
            {item.title}
          </Text>
        </View>
        <Text style={tw`text-center text-gray-500 dark:text-white `}>
          {item.desc}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={tw`relative flex flex-col h-full android:my-3 ios:my-3`}
    >
      <View>
        <Carousel
          layout={"default"}
          data={onboard}
          renderItem={renderItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={(index) => setDotIndex(index)}
        />
        <Pagination
          dotsLength={onboard.length}
          activeDotIndex={dotIndex}
          dotStyle={tw`w-3 h-3 rounded-full bg-[${primaryColor}]`}
          tappableDots={true}
          inactiveDotStyle={{
            backgroundColor: primaryGray,
            // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.3}
          inactiveDotScale={0.5}
        />
      </View>

      <View
        style={tw`absolute flex-col items-center justify-around w-full px-4 bottom-5`}
      >
        <Button
          fullWidth
          onPress={() => {
            navigation.navigate("CreateWallet");
          }}
        >
          Create a new wallet
        </Button>
        <Button
          fullWidth
          variant="text"
          onPress={() => {
            navigation.navigate("ImportWallet"); // enable applock -> import first wallet
          }}
        >
          Import Wallet
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SlideOnBoard;
