import { Text, View } from "react-native";
import _ from "lodash";
import { tw } from "../../utils/tailwind";
import { primaryColor, primaryGray } from "../../configs/theme";
import Button from "../../components/Button";
import React from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/solid";
import { Modal, Spinner } from "native-base";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useTextDarkMode } from "../../hooks/useTextDarkMode";
import { useGridDarkMode } from "../../hooks/useGridDarkMode";

interface IModalProps {
  showingModal: string;
  setShowingModal: (value: string) => void;
  loading: string;
  message: string;
  onConfirm: () => Promise<void>;
  fromSymbol?: string;
  toSymbol?: string;
}

const ModalResult = ({
  showingModal,
  setShowingModal,
  loading,
  message,
  onConfirm,
  fromSymbol,
  toSymbol,
}: IModalProps) => {
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();
  return (
    <>
      <Modal isOpen={showingModal === "confirmation"}>
        <Modal.Content
          style={tw`p-6 flex flex-col items-center justify-center rounded-3xl ${modeColor}`}
        >
          {loading ? (
            <View style={tw`flex items-center`}>
              <Spinner color={primaryColor} size="lg" />
              <Text style={tw`text-center text-gray-700 mt-3`}>
                {`Swapping ${fromSymbol} for ${toSymbol}...`}
              </Text>
            </View>
          ) : (
            <>
              <View style={tw` w-1/4 h-20`}>
                <ExclamationCircleIcon
                  width="100%"
                  height="100%"
                  fill="#FFE600"
                />
              </View>
              <Text style={tw`text-sm`}>
                {/* {`Are you sure you want to swap ${fromValue} ${fromToken.symbol} for ${toValue} ${toToken.symbol}?`} */}
                {message}
              </Text>
              <View style={tw`flex flex-row justify-between mt-4`}></View>
              <View style={tw`w-full flex flex-row`}>
                <View style={tw`w-1/2 px-1`}>
                  <Button
                    buttonStyle={`rounded-2xl bg-[${primaryGray}]`}
                    stringStyle={"font-semibold"}
                    onPress={() => {
                      setShowingModal("");
                    }}
                  >
                    Cancel
                  </Button>
                </View>
                <View style={tw`w-1/2 px-1`}>
                  <Button
                    buttonStyle={`rounded-2xl`}
                    stringStyle={"font-semibold"}
                    loading={loading === "swap"}
                    onPress={async () => {
                      // setLoading("swap");
                      // const message = await UniswapModule.alphaRouterSwap(
                      //   provider,
                      //   wallet,
                      //   createToken(fromToken),
                      //   createToken(toToken),
                      //   fromValue
                      // );

                      // setShowingModal(message);
                      // setLoading("");
                      await onConfirm();
                    }}
                  >
                    Confirm
                  </Button>
                </View>
              </View>
            </>
          )}
        </Modal.Content>
      </Modal>

      <Modal isOpen={showingModal === "success" || showingModal === "failed"}>
        <Modal.Content
          style={tw`p-6 flex flex-col items-center justify-center rounded-3xl bg-white`}
        >
          <View style={tw` w-1/4 h-20`}>
            {showingModal === "success" && (
              <CheckCircleIcon width="100%" height="100%" fill={primaryColor} />
            )}
            {showingModal === "failed" && (
              <ExclamationCircleIcon width="100%" height="100%" fill="red" />
            )}
          </View>
          <Text style={tw`text-base`}>
            {showingModal === "success" && `Swap successful!`}
            {showingModal === "failed" && `Swap failed!`}
          </Text>

          <View style={tw`flex flex-row justify-between mt-4`}></View>
          <View style={tw`w-full flex flex-row`}>
            <Button
              buttonStyle={`rounded-2xl`}
              stringStyle={"font-semibold"}
              onPress={() => {
                setShowingModal("");
              }}
            >
              Done
            </Button>
          </View>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ModalResult;
