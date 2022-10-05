export class WalletError extends Error {
    data: {};
    messageCode: string;
    constructor(message, messageCode, data = {}) {
        super(message);
        this.messageCode = `walletErrorCodes.${messageCode}`;
        this.data = data;
    }
}
