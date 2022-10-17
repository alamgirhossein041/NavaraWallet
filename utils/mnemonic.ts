import {ethers} from 'ethers';
import { entropyToMnemonic } from 'ethers/utils/hdnode';

const { utils } = ethers;

/**
 * Mnemonic generate 
 * 
 * @returns Mnemonic: string
 */
export function generateMnemonics() {
    return entropyToMnemonic(utils.randomBytes(16));
}   

export function normalizeSeedPhrase(seedPhrase) {
    return seedPhrase.trim().split(/\s+/).map(part => part.toLowerCase()).join(' ')
} 