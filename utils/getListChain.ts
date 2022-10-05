import { EVM_CHAINS, TOKEN_SYMBOLS } from './../configs/bcNetworks';
import { NETWORKS } from './../enum/bcEnum';
import { getSolanaKeypair } from './../hooks/useSolana';
import { getEthereumKeypair } from './../hooks/useEvm';
import { getNearKeypair } from '../hooks/useNEAR';
import { base58 } from 'ethers/lib/utils';
import * as bs58 from 'bs58'

const getListChain = async (seedPhrase) => {
    if (seedPhrase) {
        let seedText = seedPhrase.join(" ")
        let ethKeypair = await getEthereumKeypair(seedText)
        let solanaKeypair = getSolanaKeypair(seedText)
        let nearKeypair = await getNearKeypair(seedText)
        let chains = []
        for (let network in NETWORKS) {
            if (EVM_CHAINS.includes(network)) {
                chains.push({
                    address: ethKeypair.address,
                    privateKey: ethKeypair.privateKey,
                    publicKey: ethKeypair.publicKey,
                    symbol: TOKEN_SYMBOLS[network],
                    network
                })
            } else if (network === NETWORKS.SOLANA) {
                chains.push({
                    address: solanaKeypair.publicKey.toBase58(),
                    publicKey: solanaKeypair.publicKey.toBase58(),
                    privateKey: bs58.encode(solanaKeypair.secretKey),
                    symbol: TOKEN_SYMBOLS[network],
                    network
                })
            } else if (network === NETWORKS.NEAR) {
                chains.push({
                    address: nearKeypair.address,
                    publicKey: nearKeypair.publicKey,
                    privateKey: nearKeypair.privateKey,
                    symbol: TOKEN_SYMBOLS[network],
                    network
                })
            }
        }
        return chains

    }
}

export default getListChain;