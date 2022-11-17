import { useRecoilState } from "recoil";
import { nearInstanceState } from ".";
import { NEAR_MAINNET_CONFIG } from "../../../configs/bcMainnets";
import { NEAR_TESTNET_CONFIG } from "../../../configs/bcTestnets";
import { createNearInstance } from "../../../hooks/useNEAR";
import { INearInstanceByNetwork } from "../../types";

interface INearInstanceActions {
  get: () => INearInstanceByNetwork;
  setInstance: (wallet: any) => Promise<void>;
}

const useNearInstanceAction = (): INearInstanceActions => {
  const [nearInstance, setNearInstance] = useRecoilState(nearInstanceState);
  const actions = {
    get: () => nearInstance,
    setInstance: async (wallet) => {
      const mainnetInstance = await createNearInstance(
        wallet.privateKey,
        NEAR_MAINNET_CONFIG
      );
      const testnetInstance = await createNearInstance(
        wallet.privateKey,
        NEAR_TESTNET_CONFIG
      );
      setNearInstance({
        mainnet: mainnetInstance,
        testnet: testnetInstance,
      });
    },
  };
  return actions;
};

export default useNearInstanceAction;
