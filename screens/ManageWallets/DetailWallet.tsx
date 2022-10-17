import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {Actionsheet, KeyboardAvoidingView, useDisclose} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {EyeIcon, TableIcon, PencilAltIcon} from 'react-native-heroicons/solid';
import {useRecoilState} from 'recoil';
import ExclamationIcon from '../../assets/icons/icon-exclamation.svg';
import Button from '../../components/Button';
import MenuItem from '../../components/MenuItem';
import TextField from '../../components/TextField';
import {primaryColor, dangerColor} from '../../configs/theme';
import {listWalletsState} from '../../data/globalState/listWallets';
import {IWallet} from '../../data/types';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import usePopupResult from '../../hooks/usePopupResult';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {tw} from '../../utils/tailwind';
import toastr from '../../utils/toastr';
import LoginToCloudModal from '../Backup/LoginToCloudModal';
import useDatabase from '../../data/database/useDatabase';
import {useWalletSelected} from '../../hooks/useWalletSelected';
import {Wallet} from '../../data/database/entities/wallet';
import {cloneDeep, valuesIn} from 'lodash';
import IconBackupCloud from '../../assets/icons/icon-backup-cloud.svg';
import IconDelete from '../../assets/icons/icon-trash.svg';
import PinCodeInput from '../../components/PinCodeInput';
import SignPinCode from '../../components/SignPinCode';
import {Controller, useForm} from 'react-hook-form';
const DetailWallet = ({route, navigation}) => {
  const [listWallets, setListWallets] = useRecoilState(listWalletsState);
  const {data, index} = route.params;
  const [walletData, setWallet] = useState<Wallet>(data);
  const [showModal, setShowModal] = useState(false);
  const [isOpenLoginModal, setIsOpenModal] = useState(false);

  const [nameWallet, setNameWallet] = useState(
    `${
      walletData?.name !== null ? `${walletData.name}` : `Wallet ${index + 1}`
    }`,
  );
  // const [nameChange, setNameChange] = useState(nameWallet);

  useEffect(() => {
    navigation.setOptions({
      title: nameWallet,
    });
  }, [nameWallet]);
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity>
        {listWallets && listWallets.length > 1 && (
          <RemoveWallet
            item={listWallets[index]}
            index={index + 1}
            id={listWallets[index].id}
          />
        )}
        {/* <WalletAdd width={30} height={30} /> */}
      </TouchableOpacity>
    ),
  });

  const backupWallet = async () => {
    try {
      if (await GoogleSignin.isSignedIn()) {
        navigation.navigate('BackupWallet', {indexSelected: index});
        // await GoogleSignin.signOut();
      } else {
        setIsOpenModal(true);
        if (await GoogleSignin.isSignedIn()) {
          navigation.navigate('BackupWallet', {indexSelected: index});
        }
      }
    } catch (error) {}
  };
  const {isOpen, onOpen, onClose} = useDisclose();
  const actions = [
    {
      icon: <PencilAltIcon fill={primaryColor} />,
      name: 'Wallet display name',
      value: <></>,
      onPress: () => {
        onOpen();
      },
    },
    {
      icon: <IconBackupCloud fill={primaryColor} />,
      name: 'Backup passphrase',
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
      name: 'Show seedphrase',
      value: <></>,
      onPress: () =>
        navigation.navigate('PrivacySeedPhrase', walletData.seedPhrase),
    },
  ];
  // function checkDuplicateNameWallet(array, walletName) {
  //   return array.some(itemArray => walletName === itemArray.value);
  // }
  const walletSelected = useWalletSelected();
  const popupResult = usePopupResult();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      nameWallet: `${
        walletData?.name !== null ? `${walletData.name}` : `Wallet ${index + 1}`
      }`,
    },
  });
  const onSubmit = async data => {
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
        title: 'Changed name',
        isOpen: true,
        type: 'success',
      });

      onClose();
      // navigation.replace('TabsNavigation');
    } catch (error) {
      onClose();
      popupResult({
        title: 'Changed Name Failed',
        isOpen: true,
        type: 'error',
      });
    }
  };

  const {walletController} = useDatabase();

  //
  const modeColor = useDarkMode();
  //text darkmode
  const textColor = useTextDarkMode();
  //grid, shadow darkmode
  const gridColor = useGridDarkMode();

  const handleCloseEdit = () => {
    setValue('nameWallet', nameWallet);
    onClose();
  };
  return (
    <View style={tw`h-full px-4 flex flex-col  justify-between ${modeColor}`}>
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
              behavior={Platform.OS === 'ios' ? 'padding' : null}>
              <Actionsheet.Content style={tw`${gridColor}`}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                    maxLength: 20,
                  }}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextField
                      autoFocus
                      styleText={`${textColor}`}
                      type="text"
                      labelStyle={`${textColor}`}
                      label="Name wallet"
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                    />
                  )}
                  name="nameWallet"
                />
                {errors.nameWallet?.type === 'required' && (
                  <Text style={tw`text-red-500 py-1`}>
                    Wallet name is required
                  </Text>
                )}
                {errors.nameWallet?.type === 'maxLength' && (
                  <Text style={tw`text-red-500 py-1`}>
                    Wallet name reached a limit of 20 characters
                  </Text>
                )}

                <TouchableOpacity>
                  <Button
                    variant="primary"
                    onPress={handleSubmit(onSubmit)}
                    //  onPress={handleChangeNameWallet}
                  >
                    Rename
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
            navigation.navigate('BackupWallet', {indexSelected: index});
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
  const {walletController} = useDatabase();
  const popupResult = usePopupResult();
  const textColor = useTextDarkMode();
  const modeColor = useDarkMode();
  const navigation: any = useNavigation();
  const listWallets = useRecoilState(listWalletsState);
  const {isOpen, onOpen, onClose} = useDisclose();
  const [isDelete, setIsDelete] = useState({value: '', error: null});
  const onChangeValue = value => {
    //
    setIsDelete({error: null, value: value});
  };
  const handleRemoveWallet = async () => {
    try {
      await walletController.removeWallet(id);
      popupResult({
        title: 'Deleted',
        isOpen: true,
        type: 'success',
      });
      onClose();

      navigation.replace('TabsNavigation');
    } catch (error) {
      onClose();
      popupResult({
        title: 'Deleted Failed',
        isOpen: true,
        type: 'error',
      });
    }
  };
  const validateDeleteWallet = `${
    item?.name !== null ? `${item.name}` : `Wallet ${index}`
  }`;

  return (
    <View style={tw``}>
      <TouchableOpacity
        style={tw` h-10 w-10 rounded-full items-center pt-2`}
        onPress={onOpen}>
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

      <KeyboardAvoidingView
        // ref={focusRef}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={tw`flex flex-col items-center justify-around flex-1 w-full`}>
        <View style={tw``}>
          <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
              <Actionsheet.Item
                style={tw`items-center justify-content-between`}
                // onPress={handleRemoveWallet}
              >
                <Text style={tw`text-center py-2`}>Delete wallet?</Text>
                <Text style={tw`py-2 mx-3`}>
                  If you have any tokens left on this wallet, you should
                  memorize the seed phrase or your asset could be lost
                  permanently!
                </Text>
                <Text style={tw`py-2 mx-3`}>
                  Input "{validateDeleteWallet}" to Confirm action
                </Text>
                <TextField
                  type="text"
                  value={isDelete.value}
                  onChangeText={onChangeValue}
                  label="Name wallet"
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
                      : `Wallet ${index}` !== isDelete.value
                  }>
                  Delete
                </Button>
                <Button fullWidth variant="outlined" onPress={onClose}>
                  Cancel
                </Button>
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
export default DetailWallet;
