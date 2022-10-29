import {useColorModeValue} from 'native-base';
import {backgroundColorLightMode, cardColorLightMode} from '../configs/theme';

const useGridDarkMode = () => {
  const toggleMode = useColorModeValue('Light', 'Dark');

  let cardMode =
    toggleMode === 'Dark'
      ? `border border-[#E7E7E9] bg-[${cardColorLightMode}]`
      : `border border-[#E7E7E9] bg-[${cardColorLightMode}]`;
  // let cardMode = toggleMode === "Dark" ? `border border-[#E7E7E9]  bg-[${cardColorLightMode}] my-2` : `border border-[#353F4F] bg-[${cardColorDarkMode}]  my-2`
  return cardMode;
};
const useDarkMode = () => {
  const toggleMode = useColorModeValue('Light', 'Dark');

  // let backgroundMode = toggleMode === "Light" ? `bg-[${backgroundColorDarkMode}]` : `bg-[${backgroundColorLightMode}]`
  let backgroundMode =
    toggleMode === 'Dark'
      ? `bg-white dark:bg-[#18191A] `
      : `bg-white dark:bg-[#18191A] `;
  return backgroundMode;
};

const useTextDarkMode = () => {
  const toggleMode = useColorModeValue('Light', 'Dark');

  let textMode = toggleMode === 'Dark' ? `text-dark` : `text-dark`;
  // let textMode = toggleMode === "Light" ? `text-white` : `text-dark`
  return textMode;
};

export {useGridDarkMode, useDarkMode, useTextDarkMode};
