import React, {useState, useEffect} from 'react'
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
    sendAndConfirmTransaction
} from '@solana/web3.js';
import {WalletInterface, WalletProps} from '../data/types'
import {SOLANA_CLUSTER_API_URL} from '../configs/bcNetworks'
import { ethers } from 'ethers'
import {Buffer} from 'buffer'
import { base58 } from 'ethers/lib/utils';
import { split } from 'lodash';
import bs58 from 'bs58';

// Create connection
function createConnection() {
    return new Connection(SOLANA_CLUSTER_API_URL);
}

const keypairFromSeed = (seed: string) => {
    // nacl.sign.keyPair.fromSeed()
    const hex = Uint8Array.from(Buffer.from(seed));
    const keyPair = Keypair.fromSeed(hex.slice(0, 32));
    return keyPair;
};

const mnemonicToSeed = (mnemonic: string) => {
    const seed = ethers.utils.mnemonicToSeed(mnemonic);
    return seed;
};

export function getSolanaKeypair(mnemonic: string) {
    const seed = mnemonicToSeed(mnemonic);
    const keypair = keypairFromSeed(seed);
    return keypair;
}

export const getSolanaAddress = (mnemonic: string) => {
    const keypair = getSolanaKeypair(mnemonic);
    return keypair.publicKey.toBase58()
}

export const getSolanaBalance = async (address: string) => {
    const connection = createConnection();
    const pk = new PublicKey(address)
    const balance = await connection.getBalance(pk)
    return {
        address,
        balance: balance / LAMPORTS_PER_SOL,
        network: "SOLANA"
    }
}

const useSolana = ({
    privateKey
}: WalletProps): WalletInterface => {
    const [error, setError] = useState<string>()
    const [address, setAddress] = useState("")
    const [connection, setConnection] = useState<Connection>()
    const [keypair, setKeypair] = useState<Keypair>()

    useEffect(() => {
        if (!privateKey) {
            setError("privateKey is null")
            return
        }
        try {
            // const secretKey = bs58.decode(privateKey)
            // let keypair = !!privateKey ? Keypair.fromSecretKey(secretKey) : getSolanaKeypair(mnemonic);
            let keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)));
            
            const connection = createConnection();
            setKeypair(keypair)
            setAddress(keypair.publicKey.toBase58())
            setConnection(connection)
        } catch(e: any) {
            console.log(e)
            setError(e.message)
        }
    }, [privateKey])

    const getBalanceOf = async (publicKey: string) => {
        let walletPublicKey = new PublicKey(publicKey);
        const balance = await connection?.getBalance(walletPublicKey);
        if (balance) {
            return (balance / LAMPORTS_PER_SOL).toString();
        }
        return "0"
    }

    const transfer = async (receiver: string, amount: string) => {
        if (connection && keypair) {
            let receiverPublicKey = new PublicKey(receiver);
            let transaction = new Transaction();
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: receiverPublicKey,
                    lamports: +amount * LAMPORTS_PER_SOL
                })
            );
            const signature = await sendAndConfirmTransaction(
                connection,
                transaction,
                [keypair]
            );
            return signature
        }
    }

    const getGasPrice = async () => {
        0
    }

    const estimateGas = async ({receiver, amount}: {receiver: string, amount: string}) => {
        if (connection && keypair) {
            let receiverPublicKey = new PublicKey(receiver);
            let transaction = new Transaction();
            let blockhash = (await connection?.getLatestBlockhash("finalized")).blockhash
            transaction.recentBlockhash = blockhash
            transaction.feePayer = keypair.publicKey
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: keypair.publicKey,
                    toPubkey: receiverPublicKey,
                    lamports: +amount * LAMPORTS_PER_SOL
                })
            );
            const response = await connection.getFeeForMessage(
                transaction.compileMessage(),
                'confirmed',
            );
            return (response.value / LAMPORTS_PER_SOL).toString()
        }
    }

    return {
        // connection,
        address,
        error,
        getBalanceOf,
        transfer,
        // getGasPrice,
        estimateGas
    }
}

export default useSolana