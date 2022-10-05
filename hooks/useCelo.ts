import React, {useState, useEffect} from "react";
import Web3 from 'web3';
import ContractKit from '@celo/contractkit'
import { WalletInterface, WalletProps } from "../data/types";
import { NETWORK_CONFIG } from "../configs/bcNetworks";
import { GoldTokenWrapper } from "@celo/contractkit/lib/wrappers/GoldTokenWrapper";
import { StableTokenWrapper } from "@celo/contractkit/lib/wrappers/StableTokenWrapper";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const useCelo = ({
    network,
    privateKey,
    address
}: WalletProps) : WalletInterface => {
    const config = NETWORK_CONFIG[network];
    const [error, setError] = useState<string>()
    const [celotoken, setCelotoken] = useState<GoldTokenWrapper>()
    const [cUSDtoken, setCUSDtoken] = useState<StableTokenWrapper>()

    useEffect(() => {
        (async () => {
            if (!privateKey) {
                setError("privateKey is null")
                return
            }
            // 2. Init a new kit, connected to the alfajores testnet
            const web3 = new Web3(config.rpc)
            const kit = ContractKit.newKitFromWeb3(web3)
            kit.connection.addAccount(privateKey)

    
            // 14. Get the token contract wrappers    
            let celotoken = await kit.contracts.getGoldToken()
            let cUSDtoken = await kit.contracts.getStableToken()
            setCUSDtoken(cUSDtoken)
            setCelotoken(celotoken)

        })()
    })

    const getBalanceOf = async (publicKey: string) => {
        if (celotoken) {
            const balance = await celotoken.balanceOf(publicKey);
            let balanceInEth = balance.dividedBy(new BigNumber(10**18))
            return balanceInEth.toString();
        }
        return "0";
    };
    
    const transfer = async (receiver: string, amount: string) => {
        try {
            let celotx = await celotoken.transfer(receiver, amount).send({from: address})
            let celoReceipt = await celotx.waitReceipt()
            console.log('CELO Transaction receipt: %o', celoReceipt)
        } catch (e) {
            console.log(e)
            throw e
        }
    };

    return {
        address,
        error,
        getBalanceOf,
        transfer,
        // getGasPrice,
    };
}

export default useCelo