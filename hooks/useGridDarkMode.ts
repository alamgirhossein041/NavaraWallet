import { useState } from "react";
import { Appearance } from 'react-native';

export function useGridDarkMode() {

    const [theme, setTheme] = useState(Appearance.getColorScheme());
    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme);
    })
    let colorMode = theme === "dark" ? "bg-gray-500 " : "bg-white"

    return colorMode
}
