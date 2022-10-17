import {atom} from 'recoil';

const approvedHosts = atom({
    key: 'approvedHosts',
    default: {},
});

const privacyMode = atom({
    key: 'privacyMode',
    default: true,
});

const thirdPartyApiMode = atom({
    key: 'thirdPartyApiMode',
    default: true,
});

export {approvedHosts, privacyMode, thirdPartyApiMode}