import { Actionsheet as BaseActionsheet } from "native-base";
import React, { useState } from "react";
import { View } from "react-native";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import Button, { ButtonVariant } from "../../components/UI/Button";
import { tw } from "../../utils/tailwind";

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void | Promise<void>;
}
interface IActionsheetProps {
  isOpen?: boolean;
  element?: JSX.Element;
  buttons?: ButtonProps[];
}

const ActionsheetState = atom({
  key: "ActionsheetState",
  default: {
    isOpen: false,
    element: <></>,
    buttons: [
      {
        label: "Ok",
        onPress: () => {},
      },
    ],
  } as IActionsheetProps,
});

export function useActionsheet() {
  const [actionsheet, setActionsheet] = useRecoilState(ActionsheetState);

  const show = (params: IActionsheetProps) => {
    setActionsheet({ ...actionsheet, ...params, isOpen: true });
  };

  return {
    show,
  };
}

export const ActionsheetContainer = () => {
  const actionsheet = useRecoilValue(ActionsheetState);
  const resetActionsheet = useResetRecoilState(ActionsheetState);
  const onClose = () => {
    resetActionsheet();
  };
  return (
    <BaseActionsheet isOpen={actionsheet.isOpen} onClose={onClose}>
      <View
        style={tw`flex flex-col items-center justify-center w-full p-6 bg-white rounded-t-3xl dark:bg-[#18191A]`}
      >
        <View>{actionsheet.element}</View>
        <View style={tw`flex-row flex-wrap items-center justify-around w-full`}>
          {actionsheet.buttons?.map((button, index) => (
            <RenderButton
              key={index}
              button={button}
              index={index}
              onClose={onClose}
            />
          ))}
        </View>
      </View>
    </BaseActionsheet>
  );
};

const RenderButton = ({
  button,
  index,
  onClose,
}: {
  button: ButtonProps;
  index: number;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await button?.onPress();
    setLoading(false);
    onClose();
  };
  return (
    <Button
      key={index}
      loading={loading}
      variant={button?.variant || "primary"}
      onPress={handlePress}
    >
      {button.label}
    </Button>
  );
};
