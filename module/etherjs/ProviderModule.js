import {ApplicationProperties} from '../../web3/ApplicationProperties';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';


let provider = ethers.getDefaultProvider('https://bsc-dataseed.binance.org/', ApplicationProperties.API_PROVIDERS);
async function setProvider(network) {
    const {providerUrl} = network;
    provider = ethers.getDefaultProvider(providerUrl, ApplicationProperties.API_PROVIDERS);
    return provider;
}
function getProvider() {
    return provider;
}
async function getNetwork(){
    return await provider.getNetwork();
}
async function getGasPrice(){
    return await provider.getGasPrice();
}
async function estimateGas(transaction){
    return await provider.estimateGas(transaction);
}

async function ready(){
    return await provider.ready;
}

export const ProviderModule = {
    setProvider,
    getProvider,
    getNetwork,
    getGasPrice,
    estimateGas,
    ready
};
