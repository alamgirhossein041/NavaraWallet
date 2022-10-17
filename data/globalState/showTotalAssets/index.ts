import {atom} from 'recoil';

const showTotalAssets = atom({
  default: false,
  key: 'showTotalAssets',
});

export default showTotalAssets;
