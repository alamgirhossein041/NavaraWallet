import { selector, selectorFamily } from 'recoil';
import axios from 'axios';

interface IParamsRequest {
    page: string, offset: string, sort: string, address: string
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
const fetchHistory = ({ page, offset, sort, address }: IParamsRequest): Promise<void>[] => {
    const params = {
        module, action, page, offset, sort, address
    };
    return urls.map(url => axios.get(url, { params }));
}

export { fetchHistory }