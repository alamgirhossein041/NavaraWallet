import Toast from 'react-native-root-toast';

interface IToastr {
    message: string,
    type?: string,
    confing?: object
}

const DURATION = 1000

const toastr = {
    info: (message = "", config = {}): IToastr => {
        return Toast.show(message, {
            duration: DURATION,
            position: 36,
            backgroundColor: "#000",
            textColor: 'white',
            ...config
        })
    },
    success: (message = "", config = {}): IToastr => {
        return Toast.show(message, {
            duration: DURATION,
            position: 36,
            backgroundColor: "#37bf45",
            textColor: 'white',
            ...config
        })
    },
    error: (message = "", config = {}): IToastr => {
        return Toast.show(message, {
            duration: DURATION,
            position: 36,
            backgroundColor: "#e83f3f",
            textColor: 'white',
            ...config
        })
    },
    warning: (message = "", config = {}): IToastr => {
        return Toast.show(message, {
            duration: DURATION,
            position: 36,
            backgroundColor: "e8d743",
            textColor: 'white',
            ...config
        })
    },
}

export default toastr;