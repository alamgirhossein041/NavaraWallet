import { Modal } from "native-base";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { CheckIcon, XIcon } from "react-native-heroicons/solid";
import { atom, useRecoilState } from "recoil";
import { tw } from "../../utils/tailwind";

export interface IPopupResultProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  onPressButton?: () => void;
  buttonText?: string;
  isOpen: boolean;
}

const openPopupResultState = atom({
  key: "openPopupResult",
  default: {
    isOpen: false,
  } as IPopupResultProps,
});
const PopupResult = () => {
  const [popupResult, setPopupResult] = useRecoilState(openPopupResultState);

  const { isOpen, type, title, onPressButton, buttonText } = popupResult;

  const onClose = () => {
    setPopupResult({ ...popupResult, isOpen: false });
  };

  useEffect(() => {
    if (!!isOpen) {
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View
        style={tw`relative flex items-center w-3/4 bg-white h-1/5 rounded-xl dark:bg-gray-800`}
      >
        {type === "success" && (
          <View
            style={tw`absolute flex items-center justify-center bg-green-400 border-2 border-white rounded-full w-15 h-15 -top-10`}
          >
            <CheckIcon fill="white" height={30} width={30} />
          </View>
        )}
        {type === "error" && (
          <View
            style={tw`absolute flex items-center justify-center bg-red-400 border-2 border-white rounded-full w-15 h-15 -top-10`}
          >
            <XIcon fill="white" height={30} width={30} />
          </View>
        )}
        <View
          style={tw`flex flex-row items-center justify-center w-full h-full px-5`}
        >
          <Text style={tw`pt-5 text-xl font-bold text-center dark:text-white `}>
            {title}
          </Text>
        </View>
        {/* <View style={tw`absolute w-full px-3 bottom-3`}>
          <Button onPress={onClose}>{buttonText ? buttonText : 'Close'}</Button>
        </View> */}
      </View>
    </Modal>
  );
};
export { openPopupResultState, PopupResult };
