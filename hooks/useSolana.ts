import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import * as bip32 from "bip32";
import bs58 from "bs58";
import { Buffer } from "buffer";
import { useEffect, useState } from "react";
import { DEVIVERATION_PATH } from "../configs/bcNetworks";
import { WalletInterface } from "../data/types";
import { NETWORKS, NETWORK_ENVIRONMENT_ENUM } from "../enum/bcEnum";
import { getSolanaClusterApiUrl, useBcNetworks } from "./useBcNetworks";

// Create connection
export function createConnection(apiUrl: string) {
  return new Connection(apiUrl);
}

export const createSolanaWallet = (seed: Buffer, accountIndex = 0) => {
  const path = DEVIVERATION_PATH[NETWORKS.SOLANA](accountIndex);
  const derivedSeed = bip32.fromSeed(seed).derivePath(path).privateKey;
  const keypair = Keypair.fromSeed(derivedSeed);
  return {
    address: keypair.publicKey.toBase58(),
    testnetAddress: keypair.publicKey.toBase58(),
    network: NETWORKS.SOLANA,
    publicKey: keypair.publicKey.toBase58(),
    privateKey: bs58.encode(keypair.secretKey),
  };
};

export const getSolanaBalance = async (
  address: string,
  env: NETWORK_ENVIRONMENT_ENUM
) => {
  const SOLANA_CLUSTER_API_URL = getSolanaClusterApiUrl(env);
  const connection = createConnection(SOLANA_CLUSTER_API_URL);
  const pk = new PublicKey(address);
  const balance = await connection.getBalance(pk);
  return {
    address,
    balance: balance / LAMPORTS_PER_SOL,
    network: "SOLANA",
  };
};

const useSolana = (privateKey: string): WalletInterface => {
  const [error, setError] = useState<string>();
  const [address, setAddress] = useState("");
  const [connection, setConnection] = useState<Connection>();
  const [keypair, setKeypair] = useState<Keypair>();
  const { SOLANA_CLUSTER_API_URL } = useBcNetworks();

  useEffect(() => {
    try {
      // const secretKey = bs58.decode(privateKey)
      // let keypair = !!privateKey ? Keypair.fromSecretKey(secretKey) : getSolanaKeypair(mnemonic);
      let _keypair = Keypair.fromSecretKey(
        new Uint8Array(bs58.decode(privateKey))
      );

      const _connection = createConnection(SOLANA_CLUSTER_API_URL);
      setKeypair(_keypair);
      setAddress(_keypair.publicKey.toBase58());
      setConnection(_connection);
    } catch (e: any) {
      setError(e.message);
    }
  }, [privateKey, SOLANA_CLUSTER_API_URL]);

  const getBalanceOf = async (publicKey: string) => {
    let walletPublicKey = new PublicKey(publicKey);
    const balance = await connection?.getBalance(walletPublicKey);
    if (balance) {
      return (balance / LAMPORTS_PER_SOL).toString();
    }
    return "0";
  };

  const transfer = async (receiver: string, amount: string) => {
    if (connection && keypair) {
      let receiverPublicKey = new PublicKey(receiver);
      let transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: receiverPublicKey,
          lamports: +amount * LAMPORTS_PER_SOL,
        })
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );
      return signature;
    }
  };

  const getGasPrice = async () => {
    0;
  };

  const estimateGas = async ({
    receiver,
    amount,
  }: {
    receiver: string;
    amount: string;
  }) => {
    if (connection && keypair) {
      let receiverPublicKey = new PublicKey(receiver);
      let transaction = new Transaction();
      let blockhash = (await connection?.getRecentBlockhash("finalized"))
        .blockhash;
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = keypair.publicKey;
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: receiverPublicKey,
          lamports: +amount * LAMPORTS_PER_SOL,
        })
      );
      const response = await connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
      );
      return (response.value / LAMPORTS_PER_SOL).toString();
    }
  };

  return {
    connection,
    address,
    error,
    getBalanceOf,
    transfer,
    // getGasPrice,
    estimateGas,
  };
};

export default useSolana;
