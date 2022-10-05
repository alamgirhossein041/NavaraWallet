export const ApplicationProperties = {
  ETHERSCAN_API_KEY: "GFKP5GD8TPFHC1VD6G77KY1P7ZK5KQGIZ2",
  ETHERSCAN_API_URL: "https://api.bscscan.com/",
  ACTIVE_NETWORK: {
    name: "bsc",
    chainId: "56",
    ensAddress: "",
    apiUrl: "https://api.bscscan.com/",
    txUrl: "https://bscscan.com/tx/",
    displayName: "Binance Smart Chain",
    readonly: true,
    symbol: "BNB",
    providerUrl: "https://bsc-dataseed.binance.org/",
  },
  NETWORKS: [
    {
      name: "bsc",
      chainId: "56",
      ensAddress: "",
      apiUrl: "https://api.bscscan.com/",
      txUrl: "https://bscscan.com/tx/",
      displayName: "Binance Smart Chain",
      readonly: true,
      symbol: "BNB",
      providerUrl: "https://bsc-dataseed.binance.org/",
    },
  ],
  API_PROVIDERS: {
    etherscan: this.ETHERSCAN_API_KEY,
  },
  DEFAULT_CURRENCY: { key: "USD", value: 0 },
  DEFAULT_LANGUAGE: {
    code: "en",
    icon: "GB",
    name: "English",
  },
  LANGUAGE_LIST: [
    {
      code: "vi",
      icon: "VN",
      name: "Tiếng Việt",
    },
    {
      code: "en",
      icon: "GB",
      name: "English",
    },
  ],
  TIME_FORMAT: "h:mm:ss a, MMMM Do YYYY",
  TOKEN_URLS: {
    pancake: "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
  },
  COMMON_TOKENS: [
    {
      name: "BNB",
      chainId: 56,
      symbol: "BNB",
      decimals: 9,
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      logoURI: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=014",
      isBNB: true,
    },
  ],
};
