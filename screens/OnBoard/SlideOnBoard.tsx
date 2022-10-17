import React, {useEffect, useRef} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {Text} from 'native-base';
import {tw} from '../../utils/tailwind';
import {primaryColor, primaryGray} from '../../configs/theme';
import Button from '../../components/Button';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import imageOnBoard1 from '../../assets/logo/onboard-1.png';
import imageOnBoard2 from '../../assets/logo/onboard-2.png';
import imageOnBoard3 from '../../assets/logo/onboard-3.png';
import PagerView from 'react-native-pager-view';
const SlideOnBoard = ({navigation}) => {
  const [slideIndex, setSlide] = React.useState(0);
  const onboard = [
    {
      img: imageOnBoard1,
      title: 'Simple & Secure Crypto Wallet',
      desc: `Navara is the key to your manage your assets with simple & secure by design`,
    },
    {
      img: imageOnBoard2,
      title: 'Secure Web3 Browser',
      desc: 'Navara give you an web3 adblock browser with security & privacy in mind. You can access DApp of any networks',
    },
    {
      img: imageOnBoard3,
      title: 'Free Unique Web3 Name',
      desc: 'Navara give you a free unique domain name, one name for all address, no more copying and pasting long addresses',
    },
  ];
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  const slideRef = useRef(null);
  useEffect(() => {
    const autoChangeSlide = setInterval(() => {
      setSlide(currentSlide => {
        return currentSlide === 2 ? 0 : currentSlide + 1;
      });
    }, 2000);
    return () => {
      clearInterval(autoChangeSlide);
    };
  }, []);

  useEffect(() => {
    const {current} = slideRef;
    current.setPage(slideIndex);
  }, [slideIndex]);
  return (
    <View style={tw` h-full ${modeColor} pt-10 relative`}>
      <PagerView
        ref={slideRef}
        overdrag
        style={tw`flex-1`}
        initialPage={slideIndex}>
        {onboard.map((slide, index) => (
          <View style={tw`flex-col justify-center px-5`}>
            <View style={tw`items-center justify-center mb-10`}>
              <Image source={onboard[index].img} />
            </View>
            <View style={tw`mb-5`}>
              <Text style={tw`text-3xl text-center font-bold ${textColor}`}>
                {slide.title}
              </Text>
            </View>
            <Text style={tw`text-center text-gray-400`}>{slide.desc}</Text>
          </View>
        ))}
      </PagerView>
      <View style={tw`flex-col items-center justify-around p-5 h-1/3`}>
        <View style={tw`items-center my-5`}>
          <DotSlide highlight={slideIndex} />
        </View>
        <Button
          fullWidth
          onPress={() => {
            navigation.replace('CreateWallet');
          }}>
          Create a new wallet
        </Button>
        <Button
          fullWidth
          variant="text"
          onPress={() => {
            navigation.navigate('ImportWallet'); // enable applock -> import first wallet
          }}>
          Import Wallet
        </Button>
      </View>
    </View>
  );
};

const DotSlide = ({highlight}: {highlight: number}) => {
  const dots = [0, 1, 2];
  return (
    <View style={tw`flex flex-row`}>
      {dots.map((dot, index) => (
        <View
          key={index}
          style={tw`bg-[${
            highlight === dot ? primaryColor : primaryGray
          }] mr-2 h-2 w-2 rounded-full`}></View>
      ))}
    </View>
  );
};
export default SlideOnBoard;
