import { Actionsheet } from "native-base";
import React from "react";
import { Image, Text, View } from "react-native";
import { LockClosedIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import Button from "../../components/UI/Button";
import { walletConnectState } from "../../data/globalState/walletConnect";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import usePopupResult from "../../hooks/usePopupResult";
import getAvatar from "../../utils/getAvatar";
import { WALLETCONNECT_SESSIONS } from "../../utils/storage";
import { shortenAddress } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";

export default function WalletConnectApproval() {
  const [state] = useRecoilState(walletConnectState);
  const [walletConnectSessions, setWalletConnectSesstion] = useLocalStorage(
    WALLETCONNECT_SESSIONS
  );

  const params = state.payload.params[0];
  const url = params.peerMeta.url || null;
  const handleCloseModal = () => {
    state.rejectSession();
  };
  const popupResult = usePopupResult();
  const handleApprovalSession = () => {
    state.approved();
    popupResult({
      isOpen: true,
      type: "success",
      title: `Connected`,
      buttonText: "View",
      onPressButton() {},
    });
  };

  return (
    <Actionsheet isOpen={state.session_request} onClose={handleCloseModal}>
      <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
        <Image
          source={{ uri: params?.peerMeta?.icons[0] }}
          style={tw`w-45 h-45`}
          width={45}
          height={45}
        />
        <View style={tw`flex-row items-center mb-3`}>
          <LockClosedIcon color="black" size={15} />
          <Text style={tw`mx-1`}>{url}</Text>
        </View>
        <Text style={tw`text-center`}>{params?.peerMeta?.description}</Text>
        <Text style={tw`mb-5 text-lg font-bold text-center dark:text-white`}>
          Connect this site with WalletConnect
        </Text>

        <View
          style={tw`flex-row items-center w-full p-3 mb-3 border border-gray-300 rounded-lg`}
        >
          <Image
            style={tw`w-8 h-8 rounded-full`}
            source={{
              uri: getAvatar(state.walletSelected.index),
            }}
          />
          <View style={tw`mx-2`}>
            <Text style={tw`font-bold dark:text-white`}>
              {state.walletSelected.data.name ||
                `Wallet ${state.walletSelected.index + 1}`}{" "}
              ({shortenAddress(state.address)})
            </Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button onPress={handleCloseModal} variant="outlined">
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button onPress={handleApprovalSession} variant="primary">
              Connect
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
