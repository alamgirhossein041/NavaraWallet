import axios from "axios";
import { apiUrl } from "../../configs/apiUrl";
const API = axios.create({ baseURL: apiUrl });
API.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    return Promise.reject(error);
})

const URL_GET_PRICE = "https://api.coingecko.com/api/v3/simple/price"
export { URL_GET_PRICE }

export default API;