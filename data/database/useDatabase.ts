import { useCallback, useEffect, useState } from "react";
import {
  AlreadyHasActiveConnectionError,
  createConnection,
  getConnection,
} from "typeorm/browser";
import toastr from "../../utils/toastr";
import { ChainWallet } from "./entities/chainWallet";
import { BrowserFavorites } from "./entities/favoritesBrowser";
import { FungibleTokens } from "./entities/fungibleTokens";
import { BrowserHistory } from "./entities/historyBrowser";
import { SearchRecent } from "./entities/searchRecent";
import { Wallet } from "./entities/wallet";

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
        type: "react-native",
        database: "navara",
        location: "default",
        // logging: ['error', 'query', 'schema'],s
        synchronize: true,
        keepConnectionAlive: true,
        entities: [
          Wallet,
          ChainWallet,
          FungibleTokens,
          BrowserHistory,
          BrowserFavorites,
          SearchRecent,
        ],
      });
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

  return {
    connection,
  };
};

export default useDatabase;
