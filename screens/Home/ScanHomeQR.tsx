import React, {useState, useEffect} from 'react';
import IconScanInput from '../../assets/icons/icon-scanner.svg';
import {RNCamera} from 'react-native-camera';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {tw} from '../../utils/tailwind';
import {Modal, useDisclose} from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {primaryColor} from '../../configs/theme';
import {XIcon} from 'react-native-heroicons/solid';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useDarkMode} from '../../hooks/useModeDarkMode';
import {useNavigation} from '@react-navigation/native';
const ScanHomeQR = ({onValueScaned}: any) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();
  const navigation = useNavigation();

  const handleSend = () => {
    onOpen();
    // navigation.navigate("SendingToken")
  };

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    onClose();

    // onValueScaned(data);
  };
  const onSuccess = (e: any) => {
    // Alert.alert("123")
    // navigation.navigate("SendingToken",e.data)
    handleBarCodeScanned(e.data);
  };
  //text darkmode

  //grid, shadow darkmode

  return (
    <View>
      <View style={tw`flex-1 `}></View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleSend}
        style={tw` rounded-lg`}>
        <IconScanInput width={25} height={25} />
      </TouchableOpacity>
      <Modal
        animationPreset={'slide'}
        isOpen={isOpen}
        onClose={onClose}
        style={tw`h-full w-full backdrop-blur-xl bg-black/50 flex-row items-center justify-center relative`}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={tw`absolute items-center justify-center w-8 h-8 p-1 bg-gray-200 rounded-full w-left-5 ios:top-10 android:top-1 `}>
          <XIcon size={25} color="black" />
        </TouchableOpacity>
        <View style={styles.barcodebox}>
          <QRCodeScanner
            onRead={onSuccess}
            cameraContainerStyle={{height: 400, width: 400}}
            topContent={<View></View>}
            bottomContent={<View></View>}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default ScanHomeQR;
