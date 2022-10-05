const shortenAddress = (address: string) => {
    if(!address){
        return ""
    }
    if (address.length > 20) {
        return (
            address.substring(0, 10) + "..." + address.substring(address.length - 10)
        );
    } else {
        return address;
    }
};

export default shortenAddress;