import {Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {tw} from '../../utils/tailwind';
import TabBrowser from '../../components/TabBrowser';
import LogoUniswap from '../../assets/logoDApp/logo-uniswap.svg';
import LogoSushiswap from '../../assets/logoDApp/logo-sushiswap.svg';
import LogoOasis from '../../assets/logoDApp/logo-oasis.svg';
import LogoPancake from '../../assets/logoDApp/logo-pancake.svg';
import LogoBalancer from '../../assets/logoDApp/logo-balancer-bal.svg';
import LogoAvalache from '../../assets/logoDApp/logo-avalanche.svg';
import LogoBinance from '../../assets/logoDApp/logo-binance.svg';
import LogoChainLink from '../../assets/logoDApp/logo-chainlink.svg';
import LogoDai from '../../assets/logoDApp/logo-dai.svg';
import LogoTopShot from '../../assets/logoDApp/logo-topshot.svg';
import LogoAxie from '../../assets/logoDApp/logo-axie.svg';
import LogoOpenSea from '../../assets/logoDApp/logo-opensea.svg';
import LogoRarible from '../../assets/logoDApp/logo-rarible.svg';
import LogoZapper from '../../assets/logoDApp/logo-zapper.svg';
import LogoApy from '../../assets/logoDApp/logo-apy-vision.svg';
import LogoDeBank from '../../assets/logoDApp/logo-debank.svg';
import LogoOrion from '../../assets/logoDApp/logo-orion.svg';
import LogoDune from '../../assets/logoDApp/logo-dune.svg';
import LogoDefiKingDoms from '../../assets/logoDApp/logo-defi-kingdom.svg';
import LogoMLB from '../../assets/logoDApp/logo-mlb.svg';
import LogoCryptoKitties from '../../assets/logoDApp/logo-cryptokitties.svg';
import LogoIlluvium from '../../assets/logoDApp/logo-illuvium.svg';
import LogoMind from '../../assets/logoDApp/logo-mind.svg';
import LogoSteemit from '../../assets/logoDApp/logo-steemit.svg';
import LogoAllme from '../../assets/logoDApp/logo-allme.svg';
import LogoMastodon from '../../assets/logoDApp/logo-mastodon.svg';
import LogoSocial from '../../assets/logoDApp/logo-socialx.svg';

import {itemListBrowser} from '../../configs/dappBrowser';
const DefaultBrowser = ({openLink}: any) => {
  const [typeSelected, setTypeSelected] = useState(0);
  const listDAPP = [
    {
      title: 'DEX',
      urls: [
        {
          title: 'Uniswap v3',
          description:
            'Uniswap is a fully decentralized protocol for automated liquidity provision on Ethereum',
          icon: <LogoUniswap width={40} height={40} />,
          href: 'https://app.uniswap.org/#/swap?chain=mainnet',
        },
        {
          title: 'Sushiswap',
          description:
            'Sushiswap (Arbitrum One) is a decentralized cryptocurrency exchange',
          icon: <LogoSushiswap width={40} height={40} />,
          href: 'https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        },
        {
          title: 'Oasis',
          description:
            'Built on the OasisDEX  protocol, Oasis Trade is a decentralized exchange',
          icon: <LogoOasis width={40} height={40} />,
          href: 'https://oasisprotocol.org/wallets',
        },
        {
          title: 'Pancakeswap v3',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoPancake width={40} height={40} />,
          href: 'https://pancakeswap.finance/swap',
        },
        {
          title: 'Balancer',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoBalancer width={40} height={40} />,
          href: 'https://app.balancer.fi/#/trade',
        },
      ],
    },
    {
      title: 'DeFi',
      urls: [
        {
          title: 'Uniswap v3',
          description:
            'Uniswap is a fully decentralized protocol for automated liquidity provision on Ethereum',
          icon: <LogoUniswap width={40} height={40} />,
          href: 'https://uniswap.org/',
        },
        {
          title: 'Avalanche',
          description:
            'Sushiswap (Arbitrum One) is a decentralized cryptocurrency exchange',
          icon: <LogoAvalache width={40} height={40} />,
          href: 'https://www.avax.network/',
        },
        {
          title: 'Dai',
          description:
            'Built on the OasisDEX  protocol, Oasis Trade is a decentralized exchange',
          icon: <LogoDai width={40} height={40} />,
          href: 'https://makerdao.com/vi/',
        },
        {
          title: 'Pancakeswap v3',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoPancake width={40} height={40} />,
          href: 'https://pancakeswap.finance/swap',
        },
        {
          title: 'Chainlink',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoChainLink width={40} height={40} />,
          href: 'https://chain.link/',
        },
      ],
    },
    {
      title: 'NFT',
      urls: [
        {
          title: 'OpenSea',
          description:
            'Uniswap is a fully decentralized protocol for automated liquidity provision on Ethereum',
          icon: <LogoOpenSea width={40} height={40} />,
          href: 'https://opensea.io/',
        },
        {
          title: 'Axie Marketplace',
          description:
            'Sushiswap (Arbitrum One) is a decentralized cryptocurrency exchange',
          icon: <LogoAxie width={40} height={40} />,
          href: 'https://marketplace.axieinfinity.com/',
        },
        {
          title: 'Binance',
          description:
            'Built on the OasisDEX  protocol, Oasis Trade is a decentralized exchange',
          icon: <LogoBinance width={40} height={40} />,
          href: 'https://www.binance.com/vi',
        },
        {
          title: 'NBA Top shot',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoTopShot width={40} height={40} />,
          href: 'https://nbatopshot.com/',
        },
        {
          title: 'Rarible',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoRarible width={40} height={40} />,
          href: 'https://rarible.com/',
        },
      ],
    },
    {
      title: 'Game Fi',
      urls: [
        {
          title: 'DeFi Kingdoms',
          description:
            'Uniswap is a fully decentralized protocol for automated liquidity provision on Ethereum',
          icon: <LogoDefiKingDoms width={40} height={40} />,
          href: 'https://defikingdoms.com/',
        },
        {
          title: 'MLB Champions',
          description:
            'Sushiswap (Arbitrum One) is a decentralized cryptocurrency exchange',
          icon: <LogoMLB width={40} height={40} />,
          href: 'https://www.mlbc.app/',
        },
        {
          title: 'Axie Infinity',
          description:
            'Built on the OasisDEX  protocol, Oasis Trade is a decentralized exchange',
          icon: <LogoAxie width={40} height={40} />,
          href: 'https://axieinfinity.com/',
        },
        {
          title: 'Illuvium',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoIlluvium width={40} height={40} />,
          href: 'https://www.illuvium.io/',
        },
        {
          title: 'CryptoKitties',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoCryptoKitties width={40} height={40} />,
          href: 'https://www.cryptokitties.co/',
        },
      ],
    },
    {
      title: 'Tools',
      urls: [
        {
          title: 'Zapper',
          description:
            'Uniswap is a fully decentralized protocol for automated liquidity provision on Ethereum',
          icon: <LogoZapper width={40} height={40} />,
          href: 'https://zapper.fi/fr',
        },
        {
          title: 'Apy Vision',
          description:
            'Sushiswap (Arbitrum One) is a decentralized cryptocurrency exchange',
          icon: <LogoApy width={40} height={40} />,
          href: 'https://apy.vision/',
        },
        {
          title: 'DeBank',
          description:
            'Built on the OasisDEX  protocol, Oasis Trade is a decentralized exchange',
          icon: <LogoDeBank width={40} height={40} />,
          href: 'https://debank.com/',
        },
        {
          title: 'Orion Protocol',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoOrion width={40} height={40} />,
          href: 'https://www.orionprotocol.io/',
        },
        {
          title: 'Dune Analytics',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoDune width={40} height={40} />,
          href: 'https://dune.com/browse/dashboards',
        },
      ],
    },
    {
      title: 'Social',
      urls: [
        {
          title: 'Minds.com',
          description:
            'Minds.com is a social networking application based on the blockchain system',
          icon: <LogoMind width={40} height={40} />,
          href: 'https://minds.com',
        },
        {
          title: 'Steemit',
          description:
            'Steemit, while looking very much similar to Reddit, is one of the most advanced blockchain social community networks in the world.',
          icon: <LogoSteemit width={40} height={40} />,
          href: 'https://steemit.com/',
        },
        {
          title: 'All.me',
          description:
            'Mail3 is a crypto native communication protocol that promises security, privacy preservation and self-sovereign identity.',
          icon: <LogoAllme width={40} height={40} />,
          href: 'https://app.mail3.me/',
        },
        {
          title: 'Mastodon.social',
          description:
            'PancakeSwap (v2) is a decentralized cryptocurrency exchange',
          icon: <LogoMastodon width={40} height={40} />,
          href: 'https://mastodon.social/about',
        },
        {
          title: 'SocialX',
          description:
            'Balancer is a non-custodial portfolio manager, liquidity provider, and price sensor protocol.',
          icon: <LogoSocial width={40} height={40} />,
          href: 'https://socialx.network/',
        },
      ],
    },
  ];
  return (
    <View style={tw`flex flex-row my-3`}>
      <View style={tw``}>
        <TabBrowser
          tabSelected={typeSelected}
          setTabSelected={index => setTypeSelected(index)}
          itemTabBar={itemListBrowser}
          styleViewSelected="border-b border-blue-600"
          styleTextSelected="text-blue-600 "
        />
        <View style={tw`mb-5`}>
          <View style={tw`flex flex-col py-3 mr-10`}>
            {listDAPP[typeSelected].urls.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => openLink(item.href)}
                  style={tw`flex flex-row mt-3 items-center`}>
                  <View style={tw`bg-gray-100 h-10 w-10 rounded-full`}>
                    {item.icon}
                  </View>
                  <View style={tw`px-2`}>
                    <Text style={tw`text-[16px] font-bold`}>{item.title}</Text>
                    <Text style={tw`text-[14px] text-gray-400 mr-5`}>
                      {item.description}{' '}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DefaultBrowser;
