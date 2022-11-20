export const defaultToken = {
  address: "0x",
  chainId: 1,
  decimals: 18,
  img: "",
  name: "",
  symbol: "",
};

export const Regex = {
  password: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W|_])[\w\d\W]{8,}/,
  specialCharacter: /[^A-Za-z0-9]/g,
  number: /\d/g,
  upperCase: /[A-Z]/g,
  lowerCase: /[a-z]/g,
};
