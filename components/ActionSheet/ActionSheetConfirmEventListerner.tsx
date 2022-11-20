import { Actionsheet } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { eventHub } from "../../App";
import { ConfirmEventParams } from "../../core/eventConfirm";
import {
  EVENT_APPROVED_ACTION_RESPONSE,
  EVENT_REQUEST_CONFIRM,
  EVENT_REQUEST_CONFIRM_APPROVED,
  EVENT_REQUEST_CONFIRM_REJECTED,
  EVENT_TYPE,
} from "../../core/eventHub";
import walletConnect from "../../core/WalletConnect";
import { WalletConnectConfirmConnectorUI } from "../../core/WalletConnect/WalletConnectConfirmConnectorUI";
import { ApproveAccessModal } from "../../screens/Browser/ApprovalAccessModal";
import { ConfirmTransactionModal } from "../../screens/Browser/ConfirmTransactionModal";
import { tw } from "../../utils/tailwind";
import Button from "../UI/Button";

export default function ActionSheetConfirmEventListerner() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<ConfirmEventParams>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initInstanceWalletConnect = () => {
    walletConnect.initInstance();
  };

  useEffect(() => {
    initInstanceWalletConnect();
    eventHub.removeAllListeners(EVENT_REQUEST_CONFIRM);
    eventHub.removeAllListeners(EVENT_APPROVED_ACTION_RESPONSE);
    eventHub.on(EVENT_REQUEST_CONFIRM, (params: ConfirmEventParams) => {
      setParams({ ...params });
      setIsOpen(true);
    });

    eventHub.on(EVENT_APPROVED_ACTION_RESPONSE, () => {
      onClose();
      setIsLoading(false);
    });
  }, []);

  const onClose = () => setIsOpen(false);

  const handleApproved = () => {
    eventHub.emit(EVENT_REQUEST_CONFIRM_APPROVED);
    setIsLoading(true);
  };

  const handleRejected = () => {
    eventHub.emit(EVENT_REQUEST_CONFIRM_REJECTED);
    onClose();
  };

  const renderUIChildren = useCallback(() => {
    if (!params) {
      return;
    }
    const payload = params.payload;
    switch (params?.type) {
      case EVENT_TYPE.WALLET_CONNECT_NEW_SESSION: {
        return <WalletConnectConfirmConnectorUI {...params} />;
      }
      case EVENT_TYPE.DAPP_CONNECT_REQUEST: {
        return <ApproveAccessModal {...payload} />;
      }
      case EVENT_TYPE.CONFIRM_TRANSACTION: {
        return <ConfirmTransactionModal {...payload} />;
      }
    }
  }, [params]);

  return (
    <Actionsheet isOpen={isOpen} onClose={handleRejected}>
      <Actionsheet.Content>
        <View style={tw`flex-row justify-center`}>{renderUIChildren()}</View>
        <View style={tw`flex-row justify-between w-full`}>
          <View style={tw`w-1/2 px-2`}>
            <Button onPress={handleRejected} variant="outlined">
              Cancel
            </Button>
          </View>
          <View style={tw`w-1/2 px-2`}>
            <Button
              onPress={handleApproved}
              variant="primary"
              loading={isLoading}
            >
              {params?.approvalButtonText || "OK"}
            </Button>
          </View>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
