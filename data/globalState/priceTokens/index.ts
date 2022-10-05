import { IWallet } from './../../types/index';
import { selector } from 'recoil';
import API, { URL_GET_PRICE } from '../../api';
import { listWalletsState } from '../listWallets';
import { NETWORK_COINGEKO_IDS } from '../../../configs/bcNetworks';

const currency = "usd"
const priceTokenState = selector({
    key: 'priceToken',
    get: async ({ get }) => {
        const listWallets: IWallet[] = get(listWalletsState)
        const walletSelected = listWallets.find((wallet: IWallet) => !!wallet.isSelected)
        const { listChains } = walletSelected
        const ids = listChains.map((chain: any) => chain.network).reduce((total, network) => {
            return total += `,${NETWORK_COINGEKO_IDS[network]}`
        })
        console.log(ids)
        const response: any = await API.get(URL_GET_PRICE, {
            params: {
                ids,
                vs_currencies: currency
            }
        })
        return response
    }

})

export { priceTokenState }