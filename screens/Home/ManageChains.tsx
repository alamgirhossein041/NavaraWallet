import { cloneDeep } from "lodash";
import { useDisclose } from "native-base";
import React from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import { useRecoilState } from "recoil";
import MenuItem from "../../components/MenuItem";
import { CHAIN_ICONS, TOKEN_SYMBOLS } from "../../configs/bcNetworks";
import { primaryGray, primaryColor } from "../../configs/theme";
import { listWalletsState } from "../../data/globalState/listWallets";
import { tw } from "../../utils/tailwind";

const ManageChains = () => {

    const [listWallets, setListWallets] = useRecoilState(listWalletsState)
    const indexSelected = !!listWallets
        ? listWallets.findIndex(item => item.isSelected)
        : -1;

    const listChains = indexSelected >= 0
        ? listWallets[indexSelected].listChains
        : [];

    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclose();
    const handleEnableChain = (index: number) => {
        const _listWallets = cloneDeep(listWallets)
        console.log(_listWallets);
        const _listChains = cloneDeep(listChains)
        _listChains[index].isEnable = !_listChains[index].isEnable;
        _listWallets[indexSelected].listChains = _listChains;
        setListWallets([
            ..._listWallets,
        ])
    }
    return (
        <ScrollView style={tw`w-full flex flex-col bg-white p-3`}>
            {listChains && listChains?.map((token, index) => {
                const Icon = CHAIN_ICONS[token.network];
                const symbol = TOKEN_SYMBOLS[token.network]
                return (
                    <MenuItem
                        key={index}
                        icon={Icon ? <Icon width={30} height={30} /> : <></>}
                        iconPadding={''}
                        name={
                            <View style={tw`flex flex-col text-left`}>
                                <Text style={tw`text-xs text-gray-500`}>
                                    {token.network.split('_')[0]} ({token.symbol})
                                </Text>
                            </View>
                        }
                        onPress={() => handleEnableChain(index)}
                        value={<Switch
                            trackColor={{ false: primaryGray, true: primaryColor }}
                            thumbColor="white"
                            onValueChange={(value) => handleEnableChain(index)}
                            value={token.isEnable}
                        />}
                        next={false}
                    />
                );
            })}
        </ScrollView>
    );
};

export default ManageChains;
