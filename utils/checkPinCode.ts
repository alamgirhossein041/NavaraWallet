import { IAppLockState, IPinCode } from "../data/types";
import { localStorage, STORAGE_APP_LOCK } from "./storage"

const checkPinCode = async (inputPinCode: string): Promise<boolean> => {
     const dataPincode: IAppLockState = await localStorage.get(STORAGE_APP_LOCK) as IAppLockState;
     return dataPincode.pinCode && dataPincode.pinCode === inputPinCode
}

export default checkPinCode