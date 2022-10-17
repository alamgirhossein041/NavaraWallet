import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {tw} from '../../utils/tailwind';
import {useLinkTo, useNavigation} from '@react-navigation/native';
import {Actionsheet, useDisclose} from 'native-base';
import ActionSheetItem from '../../components/ActionSheetItem';
import IconDomain from '../../assets/icons/icon-domain.svg';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {useRecoilState} from 'recoil';
import {listWalletsState} from '../../data/globalState/listWallets';
import IconDetailWallet from '../../assets/icons/icon-detail-wallet.svg';
import IconGetDomain from '../../assets/icons/icon-get-domain.svg';
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/solid';
import Clipboard from '@react-native-clipboard/clipboard';
import IconCopy from "../../assets/icons/icon-copy.svg"
import toastr from '../../utils/toastr';
const MyDomain = props => {
  return (
    <View style={tw`h-10 mb-5`}>
      <ButtonGetYourDomain {...props} />
    </View>
  );
};

const ButtonGetYourDomain = ({domain, data, index}) => {
  const linkTo = useLinkTo();

  return <RenderDomain domain={domain} data={data} index={index} />
  // return 
};

const RenderDomain = ({domain, data, index}: any) => {
  const handleCopyToClipboard = () => {
    //
    Clipboard.setString(domain);
    toastr.success('Copied');
  };
  const {isOpen, onOpen, onClose} = useDisclose();

  const detailWallet = () => {
    onOpen();
  };
  const linkTo = useLinkTo();
  const onChangeText = text => {
    // setWallet({...wallet, label: text, value: text});
  };
  
  const walletSelected = useWalletSelected();
  const nameWallet =
    data.name === null ? `Wallet ${index + 1}` : `${data.name}`;
  // const nameWallet = walletSelected&&walletSelected?.data.name
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const navigation = useNavigation();
  const handleDetailWallet = () => {
    // console.log("1233")
    onClose();
    navigation.navigate('DetailWallet', {
      index,
      data: listWallets[index],
    });
  };

  const handleGetNameService = () => {
    onClose();
    linkTo('/GetYourDomain');
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={detailWallet}
        style={[tw`flex-row items-center h-10 rounded-full `]}>
        <Text style={tw`mt-2 mr-2`}>
          {domain ?<IconDomain />:<></>}
        </Text>
        {domain?<Text numberOfLines={1} style={tw`text-lg text-white`}>
          {domain}
        </Text>:<Text numberOfLines={1} style={tw`text-lg text-white`}>
          {nameWallet}
        </Text>}
        <Text style={tw`ios:mt-2 android:mt-2`}>
          <ChevronUpIcon width={30} height={30} fill="white" />
        </Text>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <ActionSheetItem
            onPress={() => {
              onClose();
            }}>
            <View style={tw`items-center `}>
              <Text style={tw`font-bold `}>{nameWallet}</Text>
            </View>
          </ActionSheetItem>

          <ActionSheetItem
            onPress={() => {
              onClose();
            }}>
            <View style={tw`flex flex-col `}>
              <Text style={tw`  text-[14px] px-2 `}>Name Wallet</Text>

              {/* {domain ? ( */}
              <TouchableOpacity
                style={tw`w-full flex flex-row p-3 mr-2 border border-white rounded-full `}
                onPress={handleDetailWallet}>
                <View>
                <Text style={tw`font-bold`}> {nameWallet}</Text>
                </View>
                <View style={tw`ml-auto`}>
                  <IconDetailWallet />
                </View>
              </TouchableOpacity>

              <Text style={tw`  text-[14px] px-2 `}>Domain</Text>
              {!domain ? (
                <TouchableOpacity
                  style={tw`w-full flex flex-row p-3 mr-2 border border-white rounded-full `}
                  onPress={handleGetNameService}>
                  <View>
                    <Text style={tw`font-bold `}>Get your favorite domain</Text>
                  </View>
                  <View activeOpacity={0.6} style={tw`ml-auto`}>
                    <IconGetDomain />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                style={tw`w-full flex flex-row p-3 mr-2 border border-white rounded-full `}
                onPress={handleCopyToClipboard}>
                <View>
                  <Text style={tw`font-bold `}>{domain}</Text>
                </View>
                <View activeOpacity={0.6} style={tw`ml-auto`}>
                  <IconCopy />
                </View>
              </TouchableOpacity>
              )}
            </View>
          </ActionSheetItem>

          {/* <ActionSheetItem
            onPress={() => {
              onClose();
            }}>
            <View style={tw`flex items-center w-full mb-3 bottom-3`}>
              <Button
                variant="primary"
                fullWidth
                // onPress={onOpen}
              >
                Save
              </Button>
            </View>
          </ActionSheetItem> */}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default MyDomain;
