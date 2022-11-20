import Clipboard from "@react-native-clipboard/clipboard";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useNavigation } from "@react-navigation/native";
import { Actionsheet, KeyboardAvoidingView, useDisclose } from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import {
  BellAlertIcon,
  BellSlashIcon,
  EyeIcon,
  PencilSquareIcon,
} from "react-native-heroicons/solid";
import { useRecoilValue } from "recoil";
import IconBackupCloud from "../../assets/icons/icon-backup-cloud.svg";
import ExclamationIcon from "../../assets/icons/icon-exclamation.svg";
import IconDelete from "../../assets/icons/icon-trash.svg";
import Button from "../../components/UI/Button";
import MenuItem from "../../components/UI/MenuItem";
import TextField from "../../components/UI/TextField";
import { dangerColor, primaryColor } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import useWalletsActions from "../../data/globalState/listWallets/listWallets.actions";
import usePopupResult from "../../hooks/usePopupResult";
import { shortWalletName } from "../../utils/stringsFunction";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
import LoginToCloudModal from "../Backup/LoginToCloudModal";
import EnableNotification from "../Notification/EnableNotification";

const DetailWallet = ({ route, navigation }) => {
  const { updateSpecificDB, get, getById } = useWalletsActions();
  const listWallets = get();
  const { data, index } = route.params;
  const subStringWalletId = shortWalletName(data.id);
  const walletData = getById(data.id);

  const [isOpenLoginModal, setIsOpenModal] = useState(false);
  const [isOpenNotify, setIsOpenNotify] = useState(false);
  const [nameWallet, setNameWallet] = useState(
    `${
      walletData?.name ? `${walletData?.name}` : `Wallet #${subStringWalletId}`
    }`
  );

  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclose();
  const popupResult = usePopupResult();

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nameWallet: `${
        walletData?.name
          ? `${walletData?.name}`
          : `Wallet #${subStringWalletId}`
      }`,
    },
  });

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

  const onSubmit = async (submittedData) => {
    try {
      await updateSpecificDB(walletData?.id, {
        name: submittedData.nameWallet,
      });

      setNameWallet(submittedData.nameWallet);
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

  const handleCloseEdit = () => {
    setValue("nameWallet", nameWallet);
    onClose();
  };

  const actions = [
    {
      icon: <PencilSquareIcon fill={primaryColor} />,
      name: t("manage_wallets.wallet_dislay_name"),
      value: <></>,
      onPress: onOpen,
    },
    // {
    //   icon: (
    //     <View>
    //       <Text style={tw`text-[${primaryColor}] font-bold text-[10px]`}>
    //         nns
    //       </Text>
    //     </View>
    //   ),
    //   name: t("manage_wallets.manage_domains"),
    //   onPress: () => navigation.navigate("ManageDomains", walletData),
    // },
    {
      icon: <IconBackupCloud fill={primaryColor} width={25} />,
      name: t("manage_wallets.backup_seedphrase"),
      value: (
        <View style={tw`w-4 h-4`}>
          {walletData?.isBackedUp === false && (
            <ExclamationIcon width="100%" height="100%" fill={dangerColor} />
          )}
        </View>
      ),
      onPress: backupWallet,
    },
    {
      icon: walletData?.isEnableNotify ? (
        <BellSlashIcon fill={primaryColor} width={25} />
      ) : (
        <BellAlertIcon fill={primaryColor} width={25} />
      ),
      name: walletData?.isEnableNotify
        ? " Turn off notification"
        : "Turn on notification",
      onPress: () => setIsOpenNotify(true),
    },

    {
      icon: <EyeIcon fill={primaryColor} />,
      name: t("manage_wallets.show_seedphrase"),
      onPress: () =>
        navigation.navigate("PrivacySeedPhrase", walletData?.seedPhrase),
    },
  ];
  return (
    <View style={tw`h-full px-2 flex flex-col  justify-between `}>
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
              behavior={"padding"}
              style={tw`flex flex-col items-center justify-around w-full`}
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
                  <Text style={tw`text-red-500 py-1`}>
                    {t("manage_wallets.wallet_name_is_required")}
                  </Text>
                )}
                {errors.nameWallet?.type === "maxLength" && (
                  <Text style={tw`text-red-500 py-1`}>
                    {t(
                      "manage_wallets.wallet_name_reached_a_limit_of_20_characters"
                    )}
                  </Text>
                )}

                <Button
                  fullWidth
                  variant="primary"
                  onPress={handleSubmit(onSubmit)}
                  //  onPress={handleChangeNameWallet}
                >
                  {t("manage_wallets.rename")}
                </Button>
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
      <EnableNotification
        isOpen={isOpenNotify}
        onClose={() => setIsOpenNotify(false)}
        walletId={walletData?.id}
        hideSuccess={true}
      />
    </View>
  );
};

const RemoveWallet = ({ id, item }: { id: string; item: any }) => {
  const popupResult = usePopupResult();
  const navigation: any = useNavigation();
  const listWallets = useRecoilValue(listWalletsState);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [isDelete, setIsDelete] = useState({ value: "", error: null });
  const onChangeValue = (value) => {
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
      </TouchableOpacity>

      <View style={tw``}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <KeyboardAvoidingView
            // ref={focusRef}
            behavior={"padding"}
            // style={tw`flex flex-col items-center justify-around flex-1 w-full`}
          >
            <Actionsheet.Content
              style={tw`bg-white w-full dark:bg-[#18191A] items-center justify-content-between`}
            >
              <Text
                style={tw` font-bold text-lg  text-center text-red-500 mb-3`}
              >
                {t("manage_wallets.delete_wallet")}
              </Text>
              <Text style={tw`dark:text-white text-black mb-5 text-center`}>
                {t("manage_wallets.description_delete_wallet")}
              </Text>
              <Text style={tw`dark:text-white  mb-5`}>
                {t("manage_wallets.input")}
                <Text
                  onPress={() => Clipboard.setString(validateDeleteWallet)}
                  style={tw`mx-2 font-bold text-black`}
                >
                  {" "}
                  {validateDeleteWallet}{" "}
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
    </View>
  );
};
export default DetailWallet;
