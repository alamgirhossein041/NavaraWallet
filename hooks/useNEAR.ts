import React, {useState, useEffect, FC} from 'react'
import {WalletInterface, WalletProps} from '../data/types'
import {NEAR_CONFIG} from '../configs/bcNetworks'
import * as nearAPI from 'near-api-js'
const { parseSeedPhrase } = require('near-seed-phrase');
import BN from 'bn.js'
import axios from 'axios';

const { keyStores, KeyPair } = nearAPI;

async function getAccountIds(publicKey: string) {
    try {
        const accountApiUrl = `${NEAR_CONFIG.helperUrl}/publicKey/${publicKey}/accounts`
        const res = await axios.get(accountApiUrl);
        return res.data;
    } catch (e) {
        return []
    }
    
}

function buf2hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

export const getNearKeypair = async (mnemonic: string) => {
    const { secretKey } = parseSeedPhrase(mnemonic);
    const keyPair = KeyPair.fromString(secretKey);
    const implicitBuffer = nearAPI.utils.PublicKey.fromString(keyPair.getPublicKey().toString()).data;
    const implicitAccountId = buf2hex(implicitBuffer)

    const accountIds = await getAccountIds(keyPair.getPublicKey().toString())

    const keyPairResult = {
        address: implicitAccountId,
        publicKey: keyPair.getPublicKey().toString().split(":")[1],
        privateKey: secretKey.split(":")[1]
    }
    if (accountIds.length) {
        keyPairResult.address = accountIds[0]
    }
    return keyPairResult
}

export const getNearBalance =async (address: string) => {
    return "0"
}

const useNEAR = ({
    mnemonic,
    privateKey
}: WalletProps) : WalletInterface => {
    const [error, setError] = useState<string>()
    const [address, setAddress] = useState("")
    const [near, setNear] = useState<nearAPI.Near>()

    useEffect(() => {
        if (!mnemonic && !privateKey) {
            setError("privateKey is null")
            return
        }

        (async () => {
            try {
                const { keyStores, KeyPair, connect } = nearAPI;
                const keyStore = new keyStores.InMemoryKeyStore();
                const keyPair = KeyPair.fromString(privateKey);

                const implicitBuffer = nearAPI.utils.PublicKey.fromString(keyPair.getPublicKey().toString()).data;
                const implicitAccountId = buf2hex(implicitBuffer)

                const accountIds = await getAccountIds(keyPair.getPublicKey().toString())

                console.log(accountIds)

                const accountId = accountIds[0] ? accountIds[0] : implicitAccountId
                setAddress(accountId)

                console.log(accountId, 'hdkadk')

                await keyStore.setKey("testnet", accountIds[0], keyPair);

                const config = {
                    ...NEAR_CONFIG,
                    keyStore,
                    headers: {}
                }
                const near = await connect(config);

                console.log(near, 'near ldahdlhfl')

                setNear(near)
                const account = await near.account(accountIds[0]);
                console.log('account', account)
            } catch (error) {
                console.log(error)
                setError(error.message);
            } 
        })()
            
    }, [mnemonic])

    const getBalanceOf = async (publicKey: string) => {
        try {
            console.log(publicKey, 'publicKey')
            const account = await near?.account(publicKey);
            console.log(publicKey, account, "hello ...")
            const balance = await account?.getAccountBalance()
            console.log(balance)
            return nearAPI.utils.format.formatNearAmount(balance?.available || "0")
        } catch(e) {
            console.log(e)
            return "0"
        }
        
    }

    const transfer = async (receiver: string, amount: string) => {
        try {
            const account = await near?.account(address);
            const tranferBN = nearAPI.utils.format.parseNearAmount(amount.toString())
            const tx = await account?.sendMoney(
                receiver,
                new BN(tranferBN)
            )
        return tx
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    const estimateGas = async ({receiver, amount}: {receiver: string, amount: string}) => {
        return "0.00001"
    }

    return {
        near,
        address,
        error,
        getBalanceOf,
        transfer,
        // getGasPrice,
        estimateGas
    }
}

export default useNEAR