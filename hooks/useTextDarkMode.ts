import { COLOR_SCHEME } from './../utils/storage';
import { useState, useEffect } from "react";
import { localStorage } from "../utils/storage";
import { useIsFocused } from "@react-navigation/native";
import { useLocalStorage } from "./useLocalStorage";
import { LIST_WALLETS } from "../utils/storage";
import { Appearance } from 'react-native';

export function useTextDarkMode() {

    const [theme, setTheme] = useState(Appearance.getColorScheme());
    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme);
    })
    let colorMode = theme === "dark" ? "text-gray-200" : "text-gray-600"
    
    return colorMode
}
