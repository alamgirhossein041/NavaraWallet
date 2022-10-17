import { Share } from "react-native";
import toastr from "./toastr";

const generateLinkInvite = () => {
    return "dnet.io"
}


const shareLinkInvite = async () => {
    try {
        const result = await Share.share({
            message:
                generateLinkInvite(),
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                toastr.success("Success")
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        toastr.error("Error");
    }
};

export { shareLinkInvite, generateLinkInvite }