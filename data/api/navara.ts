import API from ".";

// API for domain
const getDomainOwn = (owner: string) => {
  const endPoint = "domain/own";
  return API.get(endPoint, {
    params: { owner },
  });
};

const getSocialNetworkForDomain = (domain: string) => {
  const endPoint = "social-network";
  return API.get(endPoint, {
    params: { domain },
  }) as any;
};

const updateSocialNetworkForDomain = (data) => {
  const endPoint = "social-network";
  return API.patch(endPoint, { ...data });
};

const getSocialNetworkSupported = () => {
  const endPoint = "social-network/supported";
  return API.get<string[]>(endPoint);
};

export {
  getDomainOwn,
  getSocialNetworkForDomain,
  getSocialNetworkSupported,
  updateSocialNetworkForDomain,
};
