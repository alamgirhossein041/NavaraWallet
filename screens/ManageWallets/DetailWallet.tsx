import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { cloneDeep } from "lodash";
import { Actionsheet, KeyboardAvoidingView, useDisclose } from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Platform, Text, TouchableOpacity, View } from "react-native";
import { EyeIcon, PencilAltIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import IconBackupCloud from "../../assets/icons/icon-backup-cloud.svg";
import ExclamationIcon from "../../assets/icons/icon-exclamation.svg";
import IconDelete from "../../assets/icons/icon-trash.svg";
import Button from "../../components/UI/Button";
import MenuItem from "../../components/UI/MenuItem";
import TextField from "../../components/UI/TextField";
import { dangerColor, primaryColor } from "../../configs/theme";
import { Wallet } from "../../data/database/entities/wallet";
import useDatabase from "../../data/database/useDatabase";
import { listWalletsState } from "../../data/globalState/listWallets";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import usePopupResult from "../../hooks/usePopupResult";
import { shortWalletName } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import LoginToCloudModal from "../Backup/LoginToCloudModal";
const DetailWallet = ({ route, navigation }) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const { data, index } = route.params;
  const [walletData] = useState<Wallet>(data);
  const [isOpenLoginModal, setIsOpenModal] = useState(false);
  const { t } = useTranslation();
  const subStringWalletId = shortWalletName(data.id);

  const [nameWallet, setNameWallet] = useState(
    `${
      walletData?.name !== null
        ? `${walletData.name}`
        : `Wallet #${subStringWalletId}`
    }`
  );
  // const [nameChange, setNameChange] = useState(nameWallet);

  useEffect(() => {
    navigation.setOptions({
      title: nameWallet,
    });
  }, [nameWallet]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        listWallets &&
        listWallets.length > 1 && (
          <RemoveWallet
            item={listWallets && listWallets[index]}
            index={subStringWalletId}
            id={listWallets && listWallets[index].id}
          />
        ),
    });
  }, []);

  const backupWallet = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        navigation.navigate("BackupWallet", { indexSelected: index });
        // await GoogleSignin.signOut();
      } else {
        setIsOpenModal(true);
        if (await GoogleSignin.isSignedIn()) {
          navigation.navigate("BackupWallet", { indexSelected: index });
        }
      }
    } catch (error) {}
  };
  const { isOpen, onOpen, onClose } = useDisclose();

  const actions = [
    {
      icon: <PencilAltIcon fill={primaryColor} />,
      name: t("manage_wallets.wallet_dislay_name"),
      value: <></>,
      onPress: () => {
        onOpen();
      },
    },
    {
      icon: <IconBackupCloud fill={primaryColor} />,
      name: t("manage_wallets.backup_seedphrase"),
      value: (
        <View style={tw`w-4 h-4 `}>
          {walletData?.isBackedUp === false && (
            <ExclamationIcon width="100%" height="100%" fill={dangerColor} />
          )}
        </View>
      ),
      onPress: () => backupWallet(),
    },

    {
      icon: <EyeIcon fill={primaryColor} />,
      name: t("manage_wallets.show_seedphrase"),
      value: <></>,
      onPress: () =>
        navigation.navigate("PrivacySeedPhrase", walletData.seedPhrase),
    },
  ];
  const popupResult = usePopupResult();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nameWallet: `${
        walletData?.name !== null
          ? `${walletData.name}`
          : `Wallet #${subStringWalletId}`
      }`,
    },
  });
  const onSubmit = async (data) => {
    try {
      await walletController.updateWallet({
        ...walletData,
        name: data.nameWallet,
      });
      // const wallets = await walletController.getWallets();
      const _listWallet = cloneDeep(listWallets);
      _listWallet[index].name = data.nameWallet;
      setNameWallet(data.nameWallet);
      setListWallets(_listWallet);
      popupResult({
        title: t("manage_wallets.changed_name"),
        isOpen: true,
        type: "success",
      });

      onClose();
      // navigation.replace('TabsNavigation');
    } catch (error) {
      onClose();
      popupResult({
        title: t("manage_wallets.changed_name_failed"),
        isOpen: true,
        type: "error",
      });
    }
  };

  const { walletController } = useDatabase();

  //

  const handleCloseEdit = () => {
    setValue("nameWallet", nameWallet);
    onClose();
  };
  return (
    <View style={tw`h-full px-4 flex flex-col  justify-between `}>
      <View style={tw`w-full`}>
        <View style={tw`w-full `}>
          {actions.map((action, i) => (
            <MenuItem
              key={i}
              icon={action.icon}
              name={action.name}
              value={action.value}
              onPress={action.onPress}
              next
            />
          ))}
          <Actionsheet isOpen={isOpen} onClose={handleCloseEdit}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={tw`flex flex-col items-center justify-around flex-1 w-full`}
            >
              <Actionsheet.Content style={tw``}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    maxLength: 20,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      styleText={``}
                      type="text"
                      labelStyle={``}
                      label={`${t("manage_wallets.name_wallet")}`}
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="nameWallet"
                />
                {errors.nameWallet?.type === "required" && (
                  <Text style={tw`dark:text-white  text-red-500 py-1`}>
                    {t("manage_wallets.wallet_name_is_required")}
                  </Text>
                )}
                {errors.nameWallet?.type === "maxLength" && (
                  <Text style={tw`dark:text-white  text-red-500 py-1`}>
                    {t(
                      "manage_wallets.wallet_name_reached_a_limit_of_20_characters"
                    )}
                  </Text>
                )}

                <TouchableOpacity>
                  <Button
                    variant="primary"
                    onPress={handleSubmit(onSubmit)}
                    //  onPress={handleChangeNameWallet}
                  >
                    {t("manage_wallets.rename")}
                  </Button>
                </TouchableOpacity>
              </Actionsheet.Content>
            </KeyboardAvoidingView>
          </Actionsheet>
        </View>
      </View>

      <LoginToCloudModal
        isOpenModal={isOpenLoginModal}
        onClose={async () => {
          if (await GoogleSignin.isSignedIn()) {
            navigation.navigate("BackupWallet", { indexSelected: index });
          }
          setIsOpenModal(false);
        }}
      />
    </View>
  );
};

const RemoveWallet = ({
  id,
  item,
  index,
}: {
  id: string;
  item: any;
  index: any;
}) => {
  const popupResult = usePopupResult();
  const navigation: any = useNavigation();
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isDelete, setIsDelete] = useState({ value: "", error: null });
  const onChangeValue = (value) => {
    //
    setIsDelete({ error: null, value: value });
  };
  const subStringWalletId = shortWalletName(item.id);

  const walletActions = useWalletsActions();
  const { t } = useTranslation();

  const handleRemoveWallet = async () => {
    try {
      await walletActions.remove(id);
      toastr.info(t("manage_wallets.deleted"));
      // popupResult({
      //   title: ,
      //   isOpen: true,
      //   type: "success",
      // });
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
  };

  const validateDeleteWallet = `${
    item?.name !== null ? `${item.name}` : `Wallet #${subStringWalletId}`
  }`;

  return (
    <View style={tw``}>
      <TouchableOpacity
        style={tw` h-10 w-10 rounded-full items-center pt-2`}
        onPress={onOpen}
      >
        <IconDelete />
        {/* <Button
          variant="danger"
          onPress={onOpen}
          buttonStyle={
            listWallets && listWallets.length <= 1 ? `` : `bg-[${dangerColor}]`
          }
          disabled={listWallets && listWallets.length <= 1}>
          Remove
        </Button> */}
      </TouchableOpacity>

      <View style={tw``}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <KeyboardAvoidingView
            // ref={focusRef}
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={tw`flex flex-col items-center justify-around flex-1 w-full`}
          >
            <Actionsheet.Content style={tw`bg-white dark:bg-[#18191A]`}>
              <Actionsheet.Item
                style={tw`items-center justify-content-between`}
                // onPress={handleRemoveWallet}
              >
                <Text style={tw`dark:text-white  text-center py-2`}>
                  {t("manage_wallets.delete_wallet")}
                </Text>
                <Text style={tw`dark:text-white  py-2 mx-3`}>
                  {t("manage_wallets.description_delete_wallet")}
                </Text>
                <Text style={tw`dark:text-white  py-2 mx-3`}>
                  {t("manage_wallets.input")} "{validateDeleteWallet}"{" "}
                  {t("manage_wallets.to_confirm_action")}
                </Text>
                <TextField
                  type="text"
                  value={isDelete.value}
                  onChangeText={onChangeValue}
                  label={t("manage_wallets.name_wallet")}
                  err={isDelete.error}
                />
                <Button
                  variant="danger"
                  onPress={handleRemoveWallet}
                  fullWidth
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
                <Button fullWidth variant="outlined" onPress={onClose}>
                  {t("manage_wallets.cancel")}
                </Button>
              </Actionsheet.Item>
            </Actionsheet.Content>
          </KeyboardAvoidingView>
        </Actionsheet>
      </View>
    </View>
  );
};
export default DetailWallet;
