import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import base64 from "react-native-base64";
import { DocumentTextIcon } from "react-native-heroicons/outline";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import { IDriveFile, IFileData } from "../../data/types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import usePopupResult from "../../hooks/usePopupResult";
import { googleDriveGetFiles } from "../../module/googleApi/GoogleDrive";
import { GOOGLE_ACCESS_TOKEN } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
import LoginToCloudModal from "../Backup/LoginToCloudModal";

const SelectFile = ({ navigation }) => {
  const [storedAccessToken] = useLocalStorage(GOOGLE_ACCESS_TOKEN);
  const [isOpenLoginModal, setIsOpenModal] = useState(false);
  const [listFiles, setListFiles] = useState<IFileData[]>([]);

  const popupResult = usePopupResult();

  const decodeFileName = (fileName: string) => {
    try {
      const decoded = base64.decode(fileName);
      return JSON.parse(decoded) as IFileData;
    } catch (e) {
      return { fileName: "", date: "", id: "" } as IFileData;
    }
  };

  const getListFiles = useCallback(async (accessToken: string) => {
    const files = (await googleDriveGetFiles(accessToken)) as IDriveFile[];
    const _listFiles: IFileData[] = files.map((file) => {
      const fileNamedata = decodeFileName(file.name);

      if (fileNamedata?.fileName.length > 0) {
        return {
          fileName: fileNamedata.fileName,
          date: fileNamedata.date,
          id: file.id,
        };
      }
    });
    const filteredListFiles = _listFiles.filter(
      (file) =>
        file?.fileName?.length > 0 &&
        file?.date?.length > 0 &&
        file?.id?.length > 0
    );
    setListFiles(filteredListFiles);
  }, []);

  useEffect(() => {
    (async () => {
      const _accessToken = await storedAccessToken?.accessToken;
      if (_accessToken) {
        await getListFiles(_accessToken);
      }
    })();
  }, [getListFiles, storedAccessToken]);

  useEffect(() => {
    (async () => {
      if (!(await GoogleSignin.isSignedIn())) {
        setIsOpenModal(true);
      }
    })();
  }, []);

  return (
    <View style={tw`h-full px-4 flex flex-col  justify-between `}>
      <ScrollView style={tw`w-full`}>
        <View style={tw`w-full `}>
          {listFiles && listFiles.length > 0 ? (
            listFiles.map((file, index) => (
              <PressableAnimated
                key={index}
                onPress={async () => {
                  await GoogleSignin.signOut();
                  navigation.navigate("RestoreWallet", {
                    fileId: file.id,
                  });
                }}
              >
                <View
                  style={tw`w-full py-2 px-3 flex flex-row items-center justify-start  rounded-full mt-2`}
                >
                  <View style={tw`p-1 mr-2 rounded-full`}>
                    <DocumentTextIcon
                      width={25}
                      height={25}
                      stroke={primaryColor}
                    />
                  </View>
                  <View>
                    <Text style={tw`dark:text-white  text-base font-semibold `}>
                      FileName: {file.fileName}
                    </Text>
                    <Text style={tw`dark:text-white  text-xs `}>
                      Backup date: {new Date(file.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </PressableAnimated>
            ))
          ) : (
            <View>
              <Text style={tw`dark:text-white  text-center `}>
                No backup file found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <LoginToCloudModal
        isOpenModal={isOpenLoginModal}
        onClose={async () => {
          if (await GoogleSignin.isSignedIn()) {
            const _accessToken = await (
              await GoogleSignin.getTokens()
            ).accessToken;
            if (_accessToken) {
              await getListFiles(_accessToken);
            }
          } else {
            navigation.goBack();
            popupResult({
              title: "You need to login to your Cloud service",
              isOpen: true,
              type: "error",
            });
          }
          setIsOpenModal(false);
        }}
      />
    </View>
  );
};

export default SelectFile;
