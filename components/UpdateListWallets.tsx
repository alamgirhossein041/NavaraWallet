import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { listWalletsState } from '../data/globalState/listWallets';
import { IWallet } from '../data/types';
import { LIST_WALLETS, localStorage } from '../utils/storage';

const UpdateListWallets = () => {
    const [listWallets, setListWallets] = useRecoilState(listWalletsState)
    useEffect(() => {
        (async () => {
            const wallets: any = await localStorage.get(LIST_WALLETS) || [];
            setListWallets(wallets);
        })()
    }, [])


    useEffect(() => {
        if (listWallets.length > 0) {
            localStorage.set(LIST_WALLETS, listWallets);
        }
    }, [listWallets])


    return <></>
};

export default UpdateListWallets;