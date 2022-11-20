import logoBing from "../assets/logo/logo-bing.svg";
import logoBrave from "../assets/logo/logo-brave.svg";
import logoDuckDuckGo from "../assets/logo/logo-duckduckgo.svg";
import logoGoogle from "../assets/logo/logo-google.svg";
import logoYandex from "../assets/logo/logo-yandex.svg";
export const searchDefault = {
  google: {
    logo: logoGoogle,
    url: "https://www.google.com/search?q=",
  },
  duckduckgo: {
    logo: logoDuckDuckGo,
    url: "https://duckduckgo.com/?q=",
  },
  bing: {
    logo: logoBing,
    url: "https://www.bing.com/search?q=",
  },
  brave: {
    logo: logoBrave,
    url: "https://search.brave.com/search?q=",
  },
  yandex: {
    logo: logoYandex,
    url: "https://yandex.com/search/?text=",
  },
};

export const defaultSettings = {
  searchEngine: Object.entries(searchDefault)[0][0],
};
