import {View, ImageBackground, Text} from 'react-native';
import React, {memo} from 'react';
import {Wallet} from '../../data/database/entities/wallet';
import {tw} from '../../utils/tailwind';
import MyDomain from './MyDomain';
import TotalAssets from './TotalAssets';
interface ICardWallet {
  wallet: Wallet;
  index: any;
}
const backgroundCard = [
  require('../../assets/backgroundCard/bg-13.png'),
  require('../../assets/backgroundCard/bg-14.png'),
  require('../../assets/backgroundCard/bg-15.png'),
  require('../../assets/backgroundCard/bg-16.png'),
  require('../../assets/backgroundCard/bg-01.png'),
  require('../../assets/backgroundCard/bg-02.png'),
  require('../../assets/backgroundCard/bg-17.png'),
  require('../../assets/backgroundCard/bg-12.png'),
  require('../../assets/backgroundCard/bg-03.png'),
  require('../../assets/backgroundCard/bg-04.png'),
  require('../../assets/backgroundCard/bg-05.png'),
  require('../../assets/backgroundCard/bg-06.png'),
  require('../../assets/backgroundCard/bg-07.png'),
  require('../../assets/backgroundCard/bg-08.png'),
  require('../../assets/backgroundCard/bg-09.png'),
  require('../../assets/backgroundCard/bg-10.png'),
  require('../../assets/backgroundCard/bg-11.png'),
  require('../../assets/backgroundCard/bg-12.png'),
  require('../../assets/backgroundCard/bg-12.png'),



];
const CardWallet = memo((props: ICardWallet) => {
  const {wallet, index} = props;

  return (
    <View style={tw`w-full`}>
      <ImageBackground
        borderRadius={20}
        style={[tw`relative p-6 mb-3 h-55`]}
        source={backgroundCard[index]}>
        <View style={tw`flex-row`}>
          <View style={tw`w-2/3`}>
            <MyDomain domain={wallet.domain} data={wallet} index={index} />
          </View>
        </View>
        <React.Suspense fallback={<></>}>
          <TotalAssets balanceChains={wallet.chains} wallet={wallet} />
        </React.Suspense>
      </ImageBackground>
    </View>
  );
});
export {backgroundCard};
export default CardWallet;
