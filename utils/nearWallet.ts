import * as nearApiJs from 'near-api-js';
import { MULTISIG_CHANGE_METHODS } from 'near-api-js/lib/account_multisig';
import { PublicKey } from 'near-api-js/lib/utils';
import { parseSeedPhrase } from 'near-seed-phrase';
import  {decorateWithLockup} from './accountWithLockup'

import {NEAR_CONFIG as Config} from '../configs/bcNetworks'
import { WalletError } from './walletError';
import { getAccountIds } from './helper-api';

const {
    ACCESS_KEY_FUNDING_AMOUNT,
    ACCOUNT_HELPER_URL,
    ACCOUNT_ID_SUFFIX,
    IS_MAINNET,
    LINKDROP_GAS,
    MIN_BALANCE_FOR_GAS,
    NETWORK_ID,
    NODE_URL,
    RECAPTCHA_ENTERPRISE_SITE_KEY,
    SHOW_PRERELEASE_WARNING,
} = Config;

export const SHOW_NETWORK_BANNER = !IS_MAINNET || SHOW_PRERELEASE_WARNING;
export const ENABLE_IDENTITY_VERIFIED_ACCOUNT = true;

export const toPK = (pk) => nearApiJs.utils.PublicKey.from(pk);

export class Wallet {
    keyStore: nearApiJs.keyStores.InMemoryKeyStore;
    inMemorySigner: nearApiJs.InMemorySigner;
    signer: { 
        getPublicKey(accountId: any, networkId: any): Promise<nearApiJs.utils.key_pair.PublicKey>; 
        signMessage(message: any, accountId: any, networkId: any): Promise<{ signature: any; publicKey: any; }>; 
    };
    connection: nearApiJs.Connection;
    accountId: string;
    
    constructor(seedPhrase: string) {
        this.keyStore = new nearApiJs.keyStores.InMemoryKeyStore();
        this.inMemorySigner = new nearApiJs.InMemorySigner(this.keyStore);

        const inMemorySigner = this.inMemorySigner;
        const wallet = this;
        this.signer = {
            async getPublicKey(accountId, networkId) {
                return await inMemorySigner.getPublicKey(accountId, networkId);
            },
            async signMessage(message, accountId, networkId) {
                return inMemorySigner.signMessage(message, accountId, networkId);
            }
        };
        this.connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: this.signer
        });
        this.recoverAccountSeedPhrase(seedPhrase, null);
    }


    async getLocalSecretKey(accountId) {
        const localKeyPair = await this.keyStore.getKey(NETWORK_ID, accountId);
        return localKeyPair.toString();
    }


    async sendMoney(receiverId, amount) {
        return (await this.getAccount(this.accountId)).sendMoney(receiverId, amount);
    }


    async loadAccount() {
        const account = await this.getAccount(this.accountId);
        const state = await account.state();

        return {
            ...state,
            has2fa: !!account.has2fa,
            balance: {
                available: ''
            },
            accountId: this.accountId,
        };
    }


    async checkAccountAvailable(accountId) {
        if (accountId !== this.accountId) {
            return await (await this.getAccount(accountId)).state();
        } else {
            throw new Error('You are logged into account ' + accountId + ' .');
        }
    }

    async checkNewAccount(accountId) {

        if (accountId.match(/.*[.@].*/)) {
            if (!accountId.endsWith(`.${ACCOUNT_ID_SUFFIX}`)) {
                throw new Error('Characters `.` and `@` have special meaning and cannot be used as part of normal account name.');
            }
        }

        if (await this.accountExists(accountId)) {
            throw new Error('Account ' + accountId + ' already exists.');
        }

        return true;
    }

    async checkIsNew(accountId) {
        return !(await this.accountExists(accountId));
    }


    async saveAccountKeyPair({ accountId, recoveryKeyPair }) {
        await this.keyStore.setKey(this.connection.networkId, accountId, recoveryKeyPair);
    }

    async saveAccount(accountId, keyPair) {
        await this.setKey(accountId, keyPair);
    }

    async setKey(accountId, keyPair) {
        if (keyPair) {
            await this.keyStore.setKey(NETWORK_ID, accountId, keyPair);
        }
    }

    async addAccessKey(accountId, contractId, publicKey, fullAccess = false, methodNames = '', recoveryKeyIsFAK) {
        const account = recoveryKeyIsFAK ? new nearApiJs.Account(this.connection, accountId) : await this.getAccount(accountId);
        try {
            if (fullAccess || (accountId === contractId && !methodNames.length)) {
                console.log('adding full access key', publicKey.toString());
                return await account.addKey(publicKey);
            } else {
                return await account.addKey(
                    publicKey.toString(),
                    contractId,
                    (!methodNames.length && accountId === contractId) ? MULTISIG_CHANGE_METHODS : methodNames,
                    ACCESS_KEY_FUNDING_AMOUNT
                );
            }
        } catch (e) {
            if (e.type === 'AddKeyAlreadyExists') {
                return true;
            }
            throw e;
        }
    }

    getAccountBasic(accountId) {
        return new nearApiJs.Account(this.connection, accountId);
    }

    async getAccount(accountId) {
        let account = new nearApiJs.Account(this.connection, accountId);
        return decorateWithLockup(account);
    }

    async getBalance(accountId, limitedAccountData = false) {
        accountId = accountId || this.accountId;
        if (!accountId) {
            return false;
        }

        const account = await this.getAccount(accountId);
        return await account.getAccountBalance(limitedAccountData);
    }

    async accountExists(accountId) {
        try {
            await (await this.getAccount(accountId)).state();
            return true;
        } catch (error) {
            if (error.toString().indexOf('does not exist while viewing') !== -1) {
                return false;
            }
            throw error;
        }
    }

    async recoverAccountSeedPhrase(seedPhrase, accountId, shouldCreateFullAccessKey = true) {
        const { secretKey } = parseSeedPhrase(seedPhrase);
        return await this.recoverAccountSecretKey(secretKey, accountId, shouldCreateFullAccessKey);
    }

    async recoverAccountSecretKey(secretKey, accountId, shouldCreateFullAccessKey) {
        const keyPair = nearApiJs.KeyPair.fromString(secretKey);
        const publicKey = keyPair.getPublicKey().toString();

        const tempKeyStore = new nearApiJs.keyStores.InMemoryKeyStore();
        const implicitAccountId = Buffer.from(PublicKey.fromString(publicKey).data).toString('hex');

        let accountIds = [];
        const accountIdsByPublickKey = await getAccountIds(publicKey);
        if (!accountId) {
            accountIds = accountIdsByPublickKey;
        } else if (accountIdsByPublickKey.includes(accountId)) {
            accountIds = [accountId];
        }

        // remove duplicate and non-existing accounts
        const accountsSet = new Set(accountIds);
        for (const accountId of accountsSet) {
            if (!(await this.accountExists(accountId))) {
                accountsSet.delete(accountId);
            }
        }
        accountIds = [...accountsSet];

        const connection = nearApiJs.Connection.fromConfig({
            networkId: NETWORK_ID,
            provider: { type: 'JsonRpcProvider', args: { url: NODE_URL + '/' } },
            signer: new nearApiJs.InMemorySigner(tempKeyStore)
        });

        const connectionConstructor = this.connection;

        const accountIdsSuccess = [];
        const accountIdsError = [];
        await Promise.all(accountIds.map(async (accountId, i) => {
            if (!accountId || !accountId.length) {
                return;
            }
            // temp account
            this.connection = connection;
            this.accountId = accountId;
            let account = await this.getAccount(accountId);
            let recoveryKeyIsFAK = false;
            // check if recover access key is FAK and if so add key without 2FA

            const keyPair = nearApiJs.KeyPair.fromString(secretKey);
            await tempKeyStore.setKey(NETWORK_ID, accountId, keyPair);
            account.keyStore = tempKeyStore;
            account.inMemorySigner = account.connection.signer = new nearApiJs.InMemorySigner(tempKeyStore);
            const newKeyPair = nearApiJs.KeyPair.fromRandom('ed25519');

            try {
                await this.addAccessKey(accountId, accountId, newKeyPair.getPublicKey(), shouldCreateFullAccessKey, '', recoveryKeyIsFAK);
                accountIdsSuccess.push({
                    accountId,
                    newKeyPair
                });
            } catch (error) {
                console.error(error);
                accountIdsError.push({
                    accountId,
                    error
                });
            }
        }));

        this.connection = connectionConstructor;

        if (!!accountIdsSuccess.length) {
            await Promise.all(accountIdsSuccess.map(async ({ accountId, newKeyPair }) => {
                await this.saveAccount(accountId, newKeyPair);
            }));


            return {
                numberOfAccounts: accountIdsSuccess.length,
                accountList: accountIdsSuccess.flatMap((accountId) => accountId.account_id).join(', '),
            };
        } else {
            const lastAccount = accountIdsError.reverse().find((account) => account.error.type === 'LackBalanceForState');
            if (lastAccount) {
                this.accountId = accountId;
                throw lastAccount.error;
            } else {
                throw accountIdsError[accountIdsError.length - 1].error;
            }
        }
    }

    async signAndSendTransactions(transactions, accountId = this.accountId) {
        const account = await this.getAccount(accountId);

        const transactionHashes = [];
        for (let { receiverId, nonce, blockHash, actions } of transactions) {
            let status, transaction;
            // TODO: Decide whether we always want to be recreating transaction (vs only if it's invalid)
            // See https://github.com/near/near-wallet/issues/1856
            const recreateTransaction = account.deployMultisig || true;
            if (recreateTransaction) {
                try {
                    ({ status, transaction } = await account.signAndSendTransaction({ receiverId, actions }));
                } catch (error) {
                    if (error.message.includes('Exceeded the prepaid gas')) {
                        throw new WalletError(error.message, error.code, { transactionHashes });
                    }

                    throw error;
                }
            } else {
                // TODO: Maybe also only take receiverId and actions as with multisig path?
                const [, signedTransaction] = await nearApiJs.transactions.signTransaction(receiverId, nonce, actions, blockHash, this.connection.signer, accountId, NETWORK_ID);
                ({ status, transaction } = await this.connection.provider.sendTransaction(signedTransaction));
            }

            // TODO: Shouldn't throw more specific errors on failure?
            if (status.Failure !== undefined) {
                throw new Error(`Transaction failure for transaction hash: ${transaction.hash}, receiver_id: ${transaction.receiver_id} .`);
            }
            transactionHashes.push({
                hash: transaction.hash,
                nonceString: nonce.toString()
            });
        }

        return transactionHashes;
    }
}

