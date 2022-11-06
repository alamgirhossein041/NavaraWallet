import {atom} from 'recoil';

const languageSelected = atom({
  key: 'languageSelected',
  default: 0 ,
});
const nameLanguage = atom({
  key: 'nameLanguage',
  default: "en" ,
});
export {languageSelected,nameLanguage};
