import React, { useState, useEffect } from 'react';
import IconScanInput from "../../assets/icons/icon-scan-input.svg";
import { RNCamera } from 'react-native-camera';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { tw } from '../../utils/tailwind';
import { Modal, useDisclose } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { primaryColor } from '../../configs/theme';
import { XIcon } from 'react-native-heroicons/solid';
const ScanAddressQR = ({ onValueScaned }: any) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();

    const handleBarCodeScanned = (data: string) => {
        setScanned(true);
        onClose()
        onValueScaned(data)
    };
    const onSuccess = (e: any) => {
        handleBarCodeScanned(e.data)
    };

    return (
        <View>
            <View style={tw`flex-1`}>
            </View>
            <TouchableOpacity activeOpacity={0.6} onPress={onOpen}>
                <IconScanInput width={25} height={25} />
            </TouchableOpacity>
            <Modal isOpen={isOpen} onClose={onClose} style={tw`h-full w-full bg-white flex-row items-center justify-center relative`}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => onClose()} style={tw`w-8 h-8 absolute items-center justify-center w-left-5 top-3 p-1 bg-gray-200 rounded-full`}>
                    <XIcon size={25} color="black" />
                </TouchableOpacity>
                <View style={styles.barcodebox}>
                    <QRCodeScanner
                        onRead={onSuccess}
                        cameraContainerStyle={{ height: 400, width: 400 }}

                        topContent={
                            <View>

                            </View>
                        }
                        bottomContent={
                            <View>
                                {/* UI Bottom QR Scan here */}
                            </View>
                        }

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
        backgroundColor: 'white'
    }
});

export default ScanAddressQR;

