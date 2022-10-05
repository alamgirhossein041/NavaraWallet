import { useState, useEffect } from "react";
import { localStorage } from "../utils/storage";
import { useIsFocused } from '@react-navigation/native';
const useLocalStorage = (key: string, initialValue?: any) => {
  const [storageValue, setStorageValue] = useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      localStorage.get(key).then((res) => {
        setStorageValue(res ? res : initialValue);
      });
    })();
  }, [isFocused]);

  const setValue = async (value: any) => {
    try {
      await localStorage.set(key, value);
      setStorageValue(value);
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  return [storageValue, setValue];
};

export { useLocalStorage };
