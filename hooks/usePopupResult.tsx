import { useRecoilState } from "recoil";
import {
  IPopupResultProps,
  openPopupResultState,
} from "../components/UI/PopupResult";

interface IPopupResullHook {}

const usePopupResult = () => {
  const [, setValue] = useRecoilState(openPopupResultState);
  const setPopupResult = (value: IPopupResultProps) => {
    setValue(value);
  };
  return setPopupResult;
};

export default usePopupResult;
