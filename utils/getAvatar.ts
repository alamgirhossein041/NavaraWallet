import {MD5} from 'crypto-js';

const getAvatar = (id: number) => {
  return `https://gravatar.com/avatar/${MD5(id.toString())}?s=400&d=retro`;
};

export default getAvatar;