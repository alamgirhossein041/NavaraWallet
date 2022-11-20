import { MD5 } from "crypto-js";

const getAvatar = (value) => {
  return `https://gravatar.com/avatar/${MD5(value.toString())}?s=400&d=retro`;
};

export default getAvatar;
