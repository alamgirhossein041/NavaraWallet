import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlreadyHasActiveConnectionError,
  createConnection,
  getConnection,
  getRepository,
} from 'typeorm/browser';
import toastr from '../../utils/toastr';
import { ChainWallet } from './entities/chainWallet';
import { BrowserFavorites } from './entities/favoritesBrowser';
import { BrowserHistory } from './entities/historyBrowser';
import { Wallet } from './entities/wallet';
import CryptoJS from 'crypto-js';
import { getFromKeychain } from '../../utils/keychain';
import { SearchRecent } from './entities/searchRecent';

const useDatabase = () => {
  const [connection, setconnection] = useState(null);
  const findConnection = async () => {
    try {
      const _connection = await getConnection();
      setconnection(_connection);
    } catch (error) {
      toastr.error("Can't connect to database");
    }
  };

  const setupConnection = useCallback(async () => {
    try {
      const _connection = await createConnection({
        type: 'react-native',
        database: 'navara',
        location: 'default',
        // logging: ['error', 'query', 'schema'],s
        synchronize: true,
        keepConnectionAlive: true,
        entities: [
          Wallet,
          ChainWallet,
          BrowserHistory,
          BrowserFavorites,
          SearchRecent,
        ],
      });
      //
      setconnection(_connection);
    } catch (error) {
      if (error.constructor === AlreadyHasActiveConnectionError) {
        return findConnection();
      }
    }
  }, []);

  useEffect(() => {
    if (!connection) {
      setupConnection();
    }
  }, []);

  const walletController = {
    createWallet: async (seedPhrase: string): Promise<Wallet> => {
      const walletRepository = getRepository(Wallet);
      const newWallet = new Wallet();
      const password = await getFromKeychain();
      const encryptedSeedPhrase = CryptoJS.AES.encrypt(
        seedPhrase,
        password,
      ).toString();

      newWallet.seedPhrase = password ? encryptedSeedPhrase : seedPhrase;
      return walletRepository.save(newWallet);
    },

    updateWallet: (wallet: Wallet): Promise<any> => {
      const walletRepository = getRepository(Wallet);
      return walletRepository.save(wallet);
    },
    updateWalletSpecific: async (
      walletId: string,
      newValue: {},
    ): Promise<any> => {
      const walletRepository = getRepository(Wallet);
      const wallet = await walletRepository.findOne({ id: walletId });
      return walletRepository.save({ ...wallet, ...newValue });
    },

    removeWallet: async (id: string): Promise<any> => {
      const walletRepository = getRepository(Wallet);
      const chainWalletRepository = getRepository(ChainWallet);
      await chainWalletRepository.delete({ walletId: id });
      return walletRepository.delete(id);
    },

    getWallets: async (): Promise<Wallet[]> => {
      const walletRepository = getRepository(Wallet);

      const listWallets = await walletRepository
        .createQueryBuilder('wallet')
        .leftJoinAndSelect('wallet.chains', 'chainWallet')
        .getMany();

      return listWallets;
    },
  };

  const chainWalletController = {
    createChainWallet: (chainWallet): Promise<ChainWallet> => {
      const chainWalletRepository = getRepository(ChainWallet);
      return chainWalletRepository.save(chainWallet);
    },
  };

  const [latestHistory, setLatestHistory] = useState(null);
  const historyBrowserController = {
    createHistoryBrowser: async (
      url: string,
      title: string,
    ): Promise<BrowserHistory> => {
      if (latestHistory === url) { return; }
      const newBrowserHistory = new BrowserHistory();
      newBrowserHistory.url = url;
      newBrowserHistory.title = title;
      const historyBrowserRepository = getRepository(BrowserHistory);
      setLatestHistory(url);
      return historyBrowserRepository.save(newBrowserHistory);
    },

    getHistoryBrowser: async (): Promise<BrowserHistory[]> => {
      const historyBrowserRepository = getRepository(BrowserHistory);
      return historyBrowserRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    },

    deleteHistoryById: async (id: string): Promise<any> => {
      const historyBrowserRepository = getRepository(BrowserHistory);
      return historyBrowserRepository.delete(id);
    },

    deleteAllHistoryBrowser: async (): Promise<any> => {
      const historyBrowserRepository = getRepository(BrowserHistory);
      return historyBrowserRepository.delete({});
    },

    suggestHistoryBrowser: async (query): Promise<BrowserHistory> => {
      const historyBrowserRepository = getRepository(BrowserHistory);
      return historyBrowserRepository
        .createQueryBuilder('history')
        .where('history.url like :query', { query: `%${query}%` })
        .getRawOne();
    },

    createSearchRecent: async (keyword: string): Promise<any> => {
      const searchRecentRepository = getRepository(SearchRecent);
      return searchRecentRepository.save({ keyword });
    },

    getSearchRecent: async (): Promise<SearchRecent[]> => {
      const searchRecentRepository = getRepository(SearchRecent);
      return searchRecentRepository
        .createQueryBuilder('searchRecent')
        .orderBy('searchRecent.createdAt', 'DESC')
        .take(10)
        .getMany();
    },
    deleteAllSearchRecent: async (): Promise<any> => {
      const searchRecentRepository = getRepository(SearchRecent);
      return searchRecentRepository.delete({});
    },
  };

  const favoritesBrowserController = {
    createFavoritesBrowser: async (
      url: string,
      title: string,
    ): Promise<BrowserFavorites> => {
      const newBrowserFavorites = new BrowserFavorites();
      newBrowserFavorites.url = url;
      newBrowserFavorites.title = title;
      const favoritesBrowserRepository = getRepository(BrowserFavorites);

      const browserFavorites = await favoritesBrowserRepository.save(
        newBrowserFavorites,
      );
      if (browserFavorites) {
        return browserFavorites;
      }
    },

    getFavoritesBrowser: async (): Promise<BrowserFavorites[]> => {
      const favoritesBrowserRepository = getRepository(BrowserFavorites);
      return favoritesBrowserRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    },

    deleteFavoritesByUrl: async (url: string): Promise<any> => {
      const favoritesBrowserRepository = getRepository(BrowserFavorites);
      return favoritesBrowserRepository.delete({ url });
    },

    findFavoritesByUrl: async (url: string): Promise<BrowserFavorites> => {
      const favoritesBrowserRepository = getRepository(BrowserFavorites);
      return favoritesBrowserRepository.findOne({ url });
    },
  };
  return {
    connection,
    setupConnection,
    walletController,
    chainWalletController,
    historyBrowserController,
    favoritesBrowserController,
  };
};

export default useDatabase;
