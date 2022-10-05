import { atom } from "recoil";
import { IUser } from "../../types";

const userState = atom({
    key: "userState",
    default: {
        wallets: [

        ]
    } as IUser,
});

const walletSelectedState = atom({
    key: "walletSelectedState",
    default: "wallet1",
});
export { userState, walletSelectedState };