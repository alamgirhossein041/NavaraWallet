import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {BROWSER_HISTORY, localStorage} from '../../utils/storage';
import {useRecoilState} from 'recoil';
import {browserHistory} from '../../data/globalState/browser';

/**
 * Auto update data History browser to localStorage
 * @returns null
 */
export default function UpdateHistory() {
  const [history, setHistory] = useRecoilState(browserHistory);

  useEffect(() => {
    (async () => {
      const wallets: any = (await localStorage.get(BROWSER_HISTORY)) || [];
      setHistory(wallets);
    })();
  }, []);

  useEffect(() => {
    localStorage.set(BROWSER_HISTORY, history);
  }, [history]);

  return <></>;
}
