import {useState, useEffect, useCallback} from 'react';
import {localStorage} from '../utils/storage';
import {useIsFocused} from '@react-navigation/native';
const useLocalStorage = (key: string, initialValue?: any) => {
  const [storageValue, setStorageValue] = useState(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const res = await localStorage.get(key);
      if (res) {
        setStorageValue(res);
      } else if (initialValue) {
        setStorageValue(initialValue);
        await localStorage.set(key, initialValue);
      }
    })();
  }, [isFocused, key]);

  const setValue = useCallback(
    async (value: any) => {
      try {
        await localStorage.set(key, value);
        setStorageValue(value);
      } catch (error) {}
    },
    [key],
  );

  return [storageValue, setValue];
};

export {useLocalStorage};
