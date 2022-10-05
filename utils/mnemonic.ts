import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {entropyToMnemonic} from '@ethersproject/hdnode';

const { utils, BigNumber,Wallet } = ethers;

/**
 * Mnemonic generate 
 * 
 * @returns Mnemonic: string
 */
export function generateMnemonics() {
    return entropyToMnemonic(utils.randomBytes(16));
}   