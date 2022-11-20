import { useLinkTo } from "@react-navigation/native";
import React, { useEffect } from "react";
import * as Animatable from "react-native-animatable";
import { LinkIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import { primaryColor } from "../../configs/theme";
import { isConnectedState } from "../../data/globalState/walletConnect";
import { localStorage, WALLETCONNECT_SESSIONS } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import PressableAnimated from "./PressableAnimated";
export default function IconSessions() {
  const [isConnected, setIsConnected] = useRecoilState(isConnectedState);
  useEffect(() => {
    localStorage.get(WALLETCONNECT_SESSIONS).then((sessions: any[]) => {
      if (!!sessions && sessions.length > 0) {
        setIsConnected(true);
      }
    });
  }, []);
  const linkTo = useLinkTo();

  if (!isConnected) {
    return <></>;
  }
  return (
    <PressableAnimated
      onPress={() => linkTo("/ManageSessions")}
      style={tw`mx-2`}
    >
      <Animatable.View animation="flash" iterationCount="infinite">
        <LinkIcon color={primaryColor} size={30} />
      </Animatable.View>
    </PressableAnimated>
  );
}
