import { eventHub } from "../App";
import {
  EVENT_REQUEST_CONFIRM,
  EVENT_REQUEST_CONFIRM_APPROVED,
  EVENT_REQUEST_CONFIRM_REJECTED,
} from "./eventHub";

export interface ConfirmEventParams {
  type: string;
  approvalButtonText?: string;
  payload: any;
}

/**
 * Open action sheet confirm
 * @param params ConfirmEventParams
 * @returns Promise<boolean>
 */
export const confirmEvent = (params: ConfirmEventParams): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Emit event open action sheet confirm
    eventHub.emit(EVENT_REQUEST_CONFIRM, params);

    // Detect event onPress approved - (Button UI)
    eventHub.on(EVENT_REQUEST_CONFIRM_APPROVED, () => {
      resolve(true);
    });

    // Detect event onPress reject - (Button UI)
    eventHub.on(EVENT_REQUEST_CONFIRM_REJECTED, () => {
      resolve(false);
    });
  });
};

/**
 * Example
 * confirmEvent({ approvalButtonText: "Connect", children: <RenderUIConfirm /> })
      .then((result) => {
        if (!!result) {
          // approved
          
        }
      })
      .catch((e) => {
        // rejected
        
      });
 */
