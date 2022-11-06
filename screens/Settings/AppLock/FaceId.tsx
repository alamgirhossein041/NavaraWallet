import { Spinner } from "native-base";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, View } from "react-native";
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics";
import { UserIcon } from "react-native-heroicons/solid";
import { useRecoilState } from "recoil";
import MenuItem from "../../../components/UI/MenuItem";
import { primaryColor, primaryGray } from "../../../configs/theme";
import { appLockState } from "../../../data/globalState/appLock";
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export const checkStateScanFingerNative = async (): Promise<boolean> => {
  const result = await rnBiometrics.simplePrompt({
    promptMessage: "Scan your finger",
  });
  return result.success;
};

const FaceId: FunctionComponent = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [appLock, setAppLock] = useRecoilState(appLockState);
  const [supported, setSupported] = useState<any>({
    available: false,
    biometryType: "",
  });
  const menu = {
    onPress: () => handleChangeSwitch(true),
    icon: <UserIcon width="100%" height="100%" fill={primaryColor} />,
    name: `${t("setting.apps_lock.face_id")}`,
    // label={t("setting.apps_lock.set_password")}
    value: loading ? (
      <Spinner />
    ) : (
      <Switch
        trackColor={{ false: primaryGray, true: primaryColor }}
        thumbColor="white"
        onValueChange={(value) => handleChangeSwitch(value)}
        value={appLock.typeBioMetric === BiometryTypes.FaceID}
      />
    ),

    next: false,
  };

  useEffect(() => {
    (async () => {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();
      setSupported({ available, biometryType });
    })();
  }, []);

  const handleChangeSwitch = async (value: boolean) => {
    setLoading(true);
    if (await checkStateScanFingerNative()) {
      if (appLock.typeBioMetric !== BiometryTypes.FaceID) {
        setAppLock({
          ...appLock,
          typeBioMetric: BiometryTypes.FaceID,
        });
      } else {
        setAppLock({
          ...appLock,
          typeBioMetric: "none",
        });
      }
    }
    setLoading(false);
  };

  return (
    <View>
      {!!supported.available &&
        supported.biometryType === BiometryTypes.FaceID && (
          <MenuItem {...menu} />
        )}
    </View>
  );
};

export default FaceId;
