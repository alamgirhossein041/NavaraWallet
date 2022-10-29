const getDomainFromUrl = (url: string) => {
  const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  return domain;
};

export default getDomainFromUrl;
