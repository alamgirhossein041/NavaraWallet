const getHostnameFromUrl = (url: string): string => {
  const hostname = new URL(url).hostname;
  return hostname;
};

export default getHostnameFromUrl;
