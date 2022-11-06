import { useRecoilValue } from "recoil";
import { listWalletsState } from "../data/globalState/listWallets";
import { decryptAES, getFromKeychain } from "../utils/keychain";

const useSeedPhraseService = () => {
  const listWallets = useRecoilValue(listWalletsState);

  const isDuplicate = async (seedPhrase: string) => {
    const password = await getFromKeychain();

    const checkSeedPhraseDuplicate = listWallets.some((element) => {
      const encryptedSeedPhrase = decryptAES(element.seedPhrase, password);
      return encryptedSeedPhrase === seedPhrase;
    });

    return checkSeedPhraseDuplicate;
  };

  return {
    isDuplicate,
  };
};

export default useSeedPhraseService;
