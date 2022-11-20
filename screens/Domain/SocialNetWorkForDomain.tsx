import { Actionsheet, Input, Select, useDisclose } from "native-base";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PlusIcon } from "react-native-heroicons/solid";
import { useQuery } from "react-query";
import PressableAnimated from "../../components/UI/PressableAnimated";
import { primaryColor } from "../../configs/theme";
import {
  getSocialNetworkForDomain,
  getSocialNetworkSupported,
  updateSocialNetworkForDomain,
} from "../../data/api/navara";
import { IDomain } from "../../data/types";
import { tw } from "../../utils/tailwind";
import toastr from "../../utils/toastr";
interface ISocialNetWorkForDomainprops {
  data: IDomain;
}
export default function SocialNetWorkForDomain(
  props: ISocialNetWorkForDomainprops
) {
  const dataDomain = props.data;
  const { data: dataSocialNetwork, refetch } = useQuery(
    [`getSocialNetworkForDomain_${dataDomain.domain}`],
    async () => await getSocialNetworkForDomain(dataDomain.domain)
  );

  const { data: socialNetworkSupported } = useQuery(
    ["socialNetworkSupported"],
    async () => getSocialNetworkSupported()
  );
  const { t } = useTranslation();
  const inputRef = useRef();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [socialNetwork, setSocialNetwork] = React.useState("");
  const [url, setUrl] = useState("");

  const handleUpdateSocialNetwork = (dataUpdate) => {
    updateSocialNetworkForDomain({
      domain: dataSocialNetwork.domain,
      ...dataSocialNetwork.socialNetwork,
      ...dataUpdate,
    })
      .then(() => {
        setIsOpenForm(false);
        refetch();
        toastr.info("Saved");
        setUrl("");
      })
      .catch(() => {
        toastr.error(
          t("domain.error_an_error_occurred_please_try_again_later")
        );
      });
  };

  const renderSelectItem = () => {
    return (
      socialNetworkSupported &&
      [...(socialNetworkSupported as any)]
        .filter(
          (social) =>
            !dataSocialNetwork.socialNetwork ||
            !dataSocialNetwork.socialNetwork[social]
        )
        .map((social: string) => (
          <Select.Item
            rounded={10}
            label={social[0].toUpperCase() + social.substring(1)}
            value={social}
          />
        ))
    );
  };

  if (dataSocialNetwork) {
    delete dataSocialNetwork?.socialNetwork?.domainId;
    delete dataSocialNetwork?.socialNetwork?.id;
  }
  return (
    dataSocialNetwork && (
      <View style={tw`mb-10`}>
        <View style={tw``}>
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`text-lg font-bold text-gray-500`}>
              Social network
            </Text>
            <Pressable onPress={() => setIsOpenForm(!isOpenForm)}>
              <PlusIcon color={primaryColor} width={30} height={30} />
            </Pressable>
          </View>
          {isOpenForm && (
            <View style={tw`mb-3`}>
              <View style={tw`mb-3`}>
                <Input
                  value={url}
                  onChangeText={(text) => setUrl(text)}
                  ref={inputRef}
                  bgColor="white"
                  placeholder="URL"
                />
                <Select
                  error
                  selectedValue={socialNetwork}
                  minWidth="200"
                  accessibilityLabel="Choose social"
                  placeholder="Choose social"
                  _selectedItem={{
                    bg: "gray.200",
                    rounded: 10,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setSocialNetwork(itemValue)}
                >
                  {renderSelectItem()}
                </Select>
              </View>
              <View style={tw`flex-row justify-end`}>
                <TouchableOpacity
                  onPress={() => setIsOpenForm(false)}
                  style={tw`w-20 p-3 mx-2 bg-red-500 rounded-lg`}
                >
                  <Text style={tw`text-center text-white`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleUpdateSocialNetwork({ [socialNetwork]: url })
                  }
                  style={tw`bg-[${primaryColor}] w-20 p-3 rounded-lg`}
                >
                  <Text style={tw`text-center text-white`}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {dataSocialNetwork.socialNetwork && (
            <ListNetWork
              {...dataSocialNetwork}
              onUpdate={handleUpdateSocialNetwork}
            />
          )}
        </View>
      </View>
    )
  );
}

const ListNetWork = (props) => {
  const { socialNetwork } = props;
  return (
    <View>
      {Object.keys(socialNetwork)
        .filter((social) => !!socialNetwork[social])
        .map((social: string) => (
          <ItemSocialNetwork
            key={social}
            social={social}
            url={socialNetwork[social]}
            {...props}
          />
        ))}
    </View>
  );
};

const ItemSocialNetwork = (props) => {
  const { social, url: initUrl, onUpdate } = props;
  const [url, setUrl] = useState(initUrl);
  const disclose = useDisclose();

  const handleUpdate = () => {
    onUpdate({ [social]: url.toLowerCase() });
    disclose.onClose();
  };

  const handleDelete = () => {
    onUpdate({ [social]: "" });
    disclose.onClose();
  };

  return (
    <View>
      <PressableAnimated
        onPress={() => disclose.onOpen()}
        style={tw`p-3 mb-2 bg-gray-100 rounded-lg`}
      >
        <View>
          <Text style={tw`font-bold text-black capitalize`}>{social}</Text>
          <Text style={tw`text-gray-500`}>{initUrl}</Text>
        </View>
      </PressableAnimated>
      <Actionsheet {...disclose}>
        <KeyboardAvoidingView
          // ref={focusRef}
          behavior={"padding"}
          style={tw`w-full`}
        >
          <Actionsheet.Content style={tw`w-full`}>
            <Text style={tw`capitalize font-bold text-lg mb-3`}>{social}</Text>
            <Input
              value={url}
              onChangeText={(text) => setUrl(text)}
              style={tw`w-full`}
              bgColor="white"
              placeholder="URL"
            />
            <View style={tw`flex-row justify-end mt-5 w-full`}>
              <TouchableOpacity
                onPress={handleDelete}
                style={tw`w-20 p-3 mx-2 bg-red-500 rounded-lg`}
              >
                <Text style={tw`text-center text-white`}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdate}
                style={tw`bg-[${primaryColor}] w-20 p-3 rounded-lg`}
              >
                <Text style={tw`text-center text-white`}>Save</Text>
              </TouchableOpacity>
            </View>
          </Actionsheet.Content>
        </KeyboardAvoidingView>
      </Actionsheet>
    </View>
  );
};
