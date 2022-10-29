import React from 'react'
import useEvm from './useEvm'
import useSolana from './useSolana'
import {WalletInterface} from '../data/types'
import {EVM_CHAINS} from '../configs/bcNetworks'
import { NETWORKS } from '../enum/bcEnum'
import useNEAR from './useNEAR'

export const useWallet = ({
    network,
    privateKey
}) : WalletInterface | null  => {
    if (EVM_CHAINS.includes(network)) {
        return useEvm(network, privateKey)
    } else if (network === NETWORKS.SOLANA) {
        return useSolana(privateKey)
    } else if (network === NETWORKS.NEAR) {
        return useNEAR(privateKey)
    }
    return null
}
