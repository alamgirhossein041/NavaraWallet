export const searchDefault = {
  google: {
    url: 'https://www.google.com/search?q=',
  },
  duckduckgo: {
    url: 'https://duckduckgo.com/?q=',
  },
  bing: {
    url: 'https://www.bing.com/search?q=',
  },
  brave: {
    url: 'https://search.brave.com/search?q=',
  },
  yandex: {
    url: 'https://yandex.com/search/?text=',
  },
};

export const defaultSettings = {
  searchEngine: Object.entries(searchDefault)[0][0],
};
