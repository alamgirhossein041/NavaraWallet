import { Modal, useDisclose } from 'native-base';
import React from 'react';
import { Text, View } from 'react-native';
import { CheckIcon, XIcon } from 'react-native-heroicons/solid';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { useDarkMode } from '../hooks/useDarkMode';
import { useGridDarkMode } from '../hooks/useGridDarkMode';
import { useTextDarkMode } from '../hooks/useTextDarkMode';
import { tw } from '../utils/tailwind';
import Button from './Button';

export interface IPopupResultProps {
    type: "success" | "error" | "warning" | "info",
    title: string,
    onPressButton?: () => void,
    buttonText?: string,
    isOpen: boolean,
}

const openPopupResultState = atom({
    key: 'openPopupResult',
    default: {
        isOpen: false,
    } as IPopupResultProps,
});
const PopupResult = () => {
    const [popupResult, setPopupResult] = useRecoilState(openPopupResultState);

    const { isOpen, type, title, onPressButton, buttonText } = popupResult;

    const onClose = () => {
        setPopupResult({ ...popupResult, isOpen: false })
    }
    const modeColor = useDarkMode();
    //text darkmode
    const textColor = useTextDarkMode();
    //grid, shadow darkmode
    const gridColor = useGridDarkMode();
    return (
        <Modal isOpen={isOpen}>
            <View style={tw`${gridColor} h-1/4 w-3/4 rounded-xl relative flex items-center  `}>
                {type === "success" && (
                    <View style={tw`h-20 w-20 rounded-full border-2 flex items-center justify-center border-white bg-green-400 -top-10 absolute`}>
                        <CheckIcon fill="white" height={50} width={50} />
                    </View>
                )}
                {type === "error" && (
                    <View style={tw`h-20 w-20 rounded-full border-2 flex items-center justify-center border-white bg-red-400 -top-10 absolute`}>
                        <XIcon fill="white" height={50} width={50} />
                    </View>
                )}
                <View style={tw` w-full h-full px-5 pt-15 flex-row justify-center flex`}>
                    <Text style={tw`text-center text-lg font-bold`}>{title}</Text>
                </View>
                <View style={tw`absolute bottom-3 w-full px-3`}>
                    <Button onPress={onClose}>{buttonText ? buttonText : "Close"}</Button>
                </View>
            </View>
        </Modal>
    );
};
export { openPopupResultState, PopupResult }