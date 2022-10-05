import { selector, selectorFamily } from 'recoil';
import axios from 'axios';
import { IHistory } from '../../types';
import toastr from '../../../utils/toastr';

interface IParamsRequest {
    page: number, offset: number, sort: number, address: string
}

const module = "account"
const action = "tokentx"
const urls = [
    'https://api.ftmscan.com/api',
    'https://api.polygonscan.com/api',
    'https://api.bscscan.com/api',
    'https://api.snowtrace.io/api',
    'https://blockscout.com/poa/xdai/api',
    'https://api.arbiscan.io/api',
    'https://mainnet-etherscan.wallet.coinbase.com/api'
]
const generateRequestHistory = ({ page, offset, sort, address }: IParamsRequest): Promise<void>[] => {
    const params = {
        module, action, page, offset, sort, address
    };
    return urls.map(url => axios.get(url, { params }));
}

const historyStateQuery = selectorFamily({
    key: 'historyState',
    get: (params: IParamsRequest | any) => async (): Promise<IHistory[]> => {
        const response: any = await axios.all(generateRequestHistory(params))

        const data: IHistory[] = Array.prototype.concat.apply([], response.map(res => res.data.result))
        if (response.error) {
             toastr.error(response.error)
        }
        return data;
    },
});
export { historyStateQuery }