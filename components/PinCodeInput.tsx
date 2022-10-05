import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { BiometricTypeEnum } from '../enum';
import { localStorage, STORAGE_TYPE_BIOMETRIC } from '../utils/storage';
import { tw } from '../utils/tailwind';


interface IPinCodeInputProps {
    onChange(value: string | number): void,
    err?: string | boolean,
    hide?: boolean

}

const PinCodeInput = ({ onChange, err, hide = false }: IPinCodeInputProps) => {
    const [value, setValue] = useState<string>("");
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value, setValue
    });

    const focusRef = useRef(null);


    useEffect(() => {
        onChange(value);
    }, [value])

    return (
        <SafeAreaView ref={focusRef} style={tw`flex flex-row justify-around items-center`}>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={6}
                rootStyle={tw`-mx-2 mb-5`}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => {
                    let textChild = null;
                    if (symbol) {
                        textChild = hide ? '•' : symbol;
                    } else if (isFocused) {
                        textChild = <Cursor />;
                    }
                    return (
                        <View
                            key={index}
                            onLayout={getCellOnLayoutHandler(index)}
                            style={tw`border rounded-lg justify-center items-center mx-2 w-10 h-10 ${isFocused ? "border-[#11CABE]" : 'border-gray-200'}  ${err ? "border-red-400" : ""}`}
                        >
                            <Text style={tw`font-bold text-xl dark:text-white`}>{textChild || (isFocused ? <Cursor /> : null)}</Text>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    );
};

export default PinCodeInput;