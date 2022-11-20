import { useNavigation } from "@react-navigation/native";
import { Actionsheet, useDisclose } from "native-base";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clipboard, KeyboardAvoidingView, Text, View } from "react-native";
import { useRecoilValue } from "recoil";
import IconDelete from "../../assets/icons/icon-trash.svg";
import ActionSheetItem from "../../components/UI/ActionSheetItem";
import Button from "../../components/UI/Button";
import TextField from "../../components/UI/TextField";
import { dangerColor } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import usePopupResult from "../../hooks/usePopupResult";
import { shortWalletName } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
const RemoveWallet = ({ id, item }: { id: string; item: any }) => {
  const popupResult = usePopupResult();
  const navigation: any = useNavigation();
  const listWallets = useRecoilValue(listWalletsState);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isDelete, setIsDelete] = useState({ value: "", error: null });
  const onChangeValue = (value) => {
    //
    setIsDelete({ error: null, value: value });
  };
  const subStringWalletId = shortWalletName(item.id);

  const walletActions = useWalletsActions();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleRemoveWallet = async () => {
    setLoading(true);
    try {
      await walletActions.remove(id);
      toastr.info(t("manage_wallets.deleted"));
      onClose();
      navigation.goBack();
    } catch (error) {
      onClose();
      popupResult({
        title: t("manage_wallets.deleted_failed"),
        isOpen: true,
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <View style={tw`w-full`}>
      <ActionSheetItem onPress={onOpen}>
        <View style={tw`flex-row items-center`}>
          <IconDelete height={30} />
          <Text style={tw`mx-1 mb-2 font-bold text-red-500`}>
            {t("manage_wallets.delete_wallet")}
          </Text>
        </View>
      </ActionSheetItem>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <KeyboardAvoidingView
          // ref={focusRef}
          behavior={"padding"}
          // style={tw`flex flex-col items-center justify-around flex-1 w-full`}
        >
          <Actionsheet.Content
            style={tw`bg-white w-full  dark:bg-[#18191A] items-center justify-content-between`}
          >
            <Text style={tw`mb-3 text-lg font-bold text-center text-red-500 `}>
              {t("manage_wallets.delete_wallet")}
            </Text>
            <Text style={tw`mb-5 text-center text-black dark:text-white`}>
              {t("manage_wallets.description_delete_wallet")}
            </Text>
            <Text style={tw`mb-5 dark:text-white`}>
              {t("manage_wallets.input")}
              <Text
                onPress={() => Clipboard.setString(item.name)}
                style={tw`mx-2 font-bold text-black`}
              >
                {" "}
                {item.name}{" "}
              </Text>
              {t("manage_wallets.to_confirm_action")}
            </Text>
            <TextField
              type="text"
              value={isDelete.value}
              onChangeText={onChangeValue}
              label={t("manage_wallets.name_wallet")}
              err={isDelete.error}
            />

            <View style={tw`w-96`}>
              <Button
                loading={loading}
                variant="danger"
                onPress={handleRemoveWallet}
                buttonStyle={
                  listWallets && listWallets.length <= 1
                    ? ``
                    : `bg-[${dangerColor}]`
                }
                disabled={
                  item?.name !== null
                    ? item?.name !== isDelete.value
                    : `Wallet #${subStringWalletId}` !== isDelete.value
                }
              >
                {t("manage_wallets.delete")}
              </Button>
              <Button variant="text" onPress={onClose}>
                {t("manage_wallets.cancel")}
              </Button>
            </View>
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet>
    </View>
  );
};

export default RemoveWallet;
