import {
  Actionsheet,
  KeyboardAvoidingView,
  Text,
  useDisclose,
} from "native-base";
import React, { useEffect } from "react";
import { Linking, Platform } from "react-native";
import IconTelegram from "../../assets/icons/icon-telegram.svg";
import Button from "../../components/UI/Button";
import { localStorage } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
const OPEN_TELEGRAM_LINKING = "OPEN_TELEGRAM_LINKING";
export const TelegramLinking = () => {
  const { isOpen, onOpen, onClose } = useDisclose();
  useEffect(() => {
    (async () => {
      const check = await localStorage.get(OPEN_TELEGRAM_LINKING);

      if (!check) {
        onOpen();
        localStorage.set(OPEN_TELEGRAM_LINKING, 1);
        return;
      }
    })();
  }, []);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <KeyboardAvoidingView
        // ref={focusRef}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={tw`flex flex-col items-center w-full`}
      >
        <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
          <IconTelegram />
          <Text style={tw`py-2 text-xl font-bold text-center dark:text-white`}>
            Already on telegram ?
          </Text>
          <Text style={tw`py-2 mx-3 text-center dark:text-white`}>
            Join our Navara Community
          </Text>

          <Button
            fullWidth
            variant="primary"
            onPress={() => Linking.openURL("https://t.me/navaranetwork")}
          >
            Join now
          </Button>
        </Actionsheet.Content>
      </KeyboardAvoidingView>
    </Actionsheet>
  );
};
