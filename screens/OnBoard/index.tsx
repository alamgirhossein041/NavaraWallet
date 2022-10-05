import React, { useEffect } from "react";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import WalletImg from "../../assets/logo/Wallet.svg";
import ManagerImg from "../../assets/logo/Manage.svg";
import LockImg from "../../assets/logo/Lock.svg";
import { Text } from "native-base";
import { tw } from "../../utils/tailwind";
import { bgGray, primaryColor, primaryGray } from "../../configs/theme";
import Button from "../../components/Button";
import { XIcon } from "react-native-heroicons/solid";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";


const OnBoard = ({ navigation }) => {
  const [slide, setSlide] = React.useState(0);
  const onboard = [
    {
      img: <WalletImg />,
      title: "Wallet",
      desc: "Create wallet with your name",
    },
    { img: <LockImg />, title: "Lock", desc: "Secure reliable wallet" },
    { img: <ManagerImg />, title: "Manager", desc: "Quick & easy payments" },
  ];
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  useEffect(() => {
    const autoChangeSlide = setInterval(() => {
      setSlide((currentSlide) => {
        return currentSlide === 2 ? 0 : currentSlide + 1;
      });
    }, 2000)
    return () => {
      clearInterval(autoChangeSlide)
    }
  }, [])
  return (
    <View style={tw` h-full ${modeColor} pt-10 relative`}>
      <View style={tw`flex items-end w-full pr-4`}>
        {/* <TouchableOpacity activeOpacity={0.6}
          onPress={() => navigation.replace("TabsNavigation")}
          style={tw`w-10 h-10 bg-gray-100 rounded-full p-1.5`}
        >
          <XIcon width="100%" height="100%" fill="gray" />
        </TouchableOpacity> */}
      </View>
      <View style={tw`h-3/5 items-center justify-center`}>
        {onboard[slide].img}
      </View>
      <View
        style={tw`flex-1 ${gridColor} rounded-t-2xl flex shadow-xl flex-col items-center justify-between p-5`}
      >
        <View style={tw``}>
          <Text style={tw`text-xl text-center font-bold ${textColor}`}>
            {onboard[slide].desc}
          </Text>

        </View>
        <View style={tw`items-center`}>
          <DotSlide highlight={slide} />
        </View>
        <TouchableOpacity activeOpacity={0.6}
          style={tw`items-center border-yellow-500 border-b-2  mx-auto`}
          onPress={() => {
            navigation.navigate("ImportAlreadyWallet");
          }}
        >
          <Text style={tw` text-[16px] text-center ${textColor}`}>
            I already have a wallet
          </Text>
        </TouchableOpacity>
        <Button
          stringStyle="text-sm"
          buttonStyle={`w-2/3`}
          onPress={() => {
            navigation.replace("NotUse");
          }}
        >
          Create a new wallet
        </Button>
      </View>
    </View>
  );
};

const DotSlide = ({ highlight }: { highlight: number }) => {
  const dots = [0, 1, 2];
  return (
    <View style={tw`flex flex-row`}>
      {dots.map((dot, index) => (
        <View
          key={index}
          style={tw`bg-[${highlight === dot ? primaryColor : primaryGray
            }] mr-2 h-3 w-3 rounded-full`}
        ></View>
      ))}
    </View>
  );
};
export default OnBoard;
