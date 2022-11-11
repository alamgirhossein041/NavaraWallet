import React, { useRef, useState } from "react";
import { Dimensions, Text, View } from "react-native";
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
      img: <ImageOnBoard1 />,
      title: "Simple & Secure Crypto Wallet",
      desc: `Navara is the key to your manage your assets with simple & secure by design`,
    },
    {
      img: <ImageOnBoard2 />,
      title: "Secure Web3 Browser",
      desc: "Navara give you an web3 adblock browser with security & privacy in mind. You can access DApp of any networks",
    },
    {
      img: <ImageOnBoard3 />,
      title: "Free Unique Web3 Name",
      desc: "Navara give you a free unique domain name, one name for all address, no more copying and pasting long addresses",
    },
  ];

  const SLIDER_WIDTH = Dimensions.get("window").width + 8;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);

  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);
  const renderItem = ({ slide, index }) => {
    return (
      <View style={tw`flex-col justify-center `}>
        <View style={tw`items-center justify-center w-auto h-64 mt-20 mb-10`}>
          {onboard[index].img}
        </View>
        <View style={tw`py-5`}>
          <Text
            style={tw`text-3xl font-bold text-center text-black dark:text-white `}
          >
            {onboard[index].title}
          </Text>
        </View>
        <Text style={tw`mb-5 text-center text-gray-500 dark:text-white `}>
          {onboard[index].desc}
        </Text>
      </View>
    );
  };
  return (
    <View style={tw`relative flex flex-col h-full android:my-3 ios:my-3`}>
      <Carousel
        layout={"default"}
        data={onboard}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
      />
      <Pagination
        dotsLength={onboard.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 10,
          marginHorizontal: 5,
          backgroundColor: primaryColor,
        }}
        tappableDots={true}
        inactiveDotStyle={{
          backgroundColor: primaryGray,
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.3}
        inactiveDotScale={0.5}
      />

      <View style={tw`flex-col items-center justify-around px-2 my-5`}>
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
    </View>
  );
};

export default SlideOnBoard;
