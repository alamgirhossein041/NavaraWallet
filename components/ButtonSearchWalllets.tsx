import { View } from 'react-native'
import React from 'react'
import ButtonIcon from './ButtonIcon'
import { SearchIcon, XIcon } from 'react-native-heroicons/solid'
import { Actionsheet, Modal, ScrollView, useDisclose } from 'native-base'
import { tw } from '../utils/tailwind'
import InputText from './InputText'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ButtonSearchWalllets = () => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  return (
    <View>

      <ButtonIcon
        style={"mr-2"}
        icon={<SearchIcon fill={"black"} height={25} width={25} />}
        onPress={onOpen}
      />

      <Modal style={tw`h-full w-full bg-white`} isOpen={isOpen} onClose={onClose}>
        <View style={tw` flex-col h-full pt-10 px-3`}>
          <TouchableOpacity activeOpacity={0.6}
            onPress={() => onClose()}
            style={tw`w-8 h-8 bg-gray-100 rounded-full p-1.5 mb-2`}
          >
            <XIcon width="100%" height="100%" fill="gray" />
          </TouchableOpacity>
          <InputText type="text" placeholder='search' />

        </View>
      </Modal>

    </View>
  )
}

export default ButtonSearchWalllets