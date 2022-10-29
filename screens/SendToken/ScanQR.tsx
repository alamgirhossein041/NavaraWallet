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
import {
  ChevronLeftIcon,
  PhotographIcon,
  QrcodeIcon,
  XIcon,
} from 'react-native-heroicons/solid';
import {useTextDarkMode} from '../../hooks/useModeDarkMode';
import {useGridDarkMode} from '../../hooks/useModeDarkMode';
import {useDarkMode} from '../../hooks/useModeDarkMode';
const ScanQR = ({onValueScaned}: any) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();

  const handleBarCodeScanned = (data: string) => {
    setScanned(true);
    onClose();
    onValueScaned(data);
  };
  const onSuccess = (e: any) => {
    handleBarCodeScanned(e.data);
  };

  const handlePicture = () => {
    Alert.alert('Coming soon');
  };

  return (
    <View>
      <View style={tw`flex-1 `}></View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onOpen}
        style={tw`rounded-lg`}>
        <QrcodeIcon color="gray" width={25} height={25} />
      </TouchableOpacity>
      <Modal
        animationPreset={'slide'}
        isOpen={isOpen}
        onClose={onClose}
        style={tw`relative flex-row items-center justify-center w-full h-full backdrop-blur-xl bg-black/90`}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={tw`absolute items-center bg-white dark:bg-[#18191A]  h-10 w-10 justify-center p-1 rounded-lg w-left-5 ios:top-10 android:top-10 `}>
          <ChevronLeftIcon width={40} height={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onClose}
          style={tw`absolute items-center  justify-center p-1 rounded-lg w-left-[39%] ios:top-[20%] android:top-[20%] `}>
          <Text style={tw`dark:text-white  text-white font-bold text-[20px]`}>
            QR Scan
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          activeOpacity={0.6}
          onPress={handlePicture}
          style={tw`absolute items-center bg-white dark:bg-[#18191A]  h-10 w-10 justify-center p-1 rounded-lg w-right-5 ios:top-10 android:top-10 `}>
          <PhotographIcon width={40} height={40} color="blue" />
        </TouchableOpacity> */}
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

export default ScanQR;
