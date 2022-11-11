import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import IconMobile from "../../assets/icons/icon-mobile-noti.svg";
import { bgUnreadNotification, primaryColor } from "../../configs/theme";
import { tw } from "../../utils/tailwind";
const Notification = () => {
  const BG_COLOR = "#F8FAFC";
  const arrayNoti = [
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2021",
      unread: true,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2021",
      unread: true,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2021",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
    {
      icon: <IconMobile width="100%" height="100%" fill="white" />,
      line1: "You just received 10dpoints from Dnet",
      line2: "Nội dung thông báo",
      line3: "10:34 13 thg12, 2022",
      unread: false,
    },
  ];

  return (
    <ScrollView style={tw`h-full flex pt-5 flex-col bg-[${BG_COLOR}] `}>
      <View style={tw`mt-4 mb-10 flex-1`}>
        <View style={tw`flex-row justify-between px-4`}>
          <Text style={tw`dark:text-white  text-5xl`}>Notification</Text>
        </View>
        <View style={tw``}>
          {arrayNoti.map((item, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={tw`flex flex-row  py-3  ${
                  item.unread
                    ? `bg-[${bgUnreadNotification}]`
                    : `bg-white dark:bg-[#18191A] `
                } `}
                key={index}
              >
                <View
                  style={tw` w-10 h-10 p-2 rounded-full bg-[${primaryColor}] mx-3`}
                >
                  <IconMobile width="100%" height="100%" fill="white" />
                </View>
                <View>
                  <Text style={tw`dark:text-white  font-bold`}>
                    {item.line1}
                  </Text>
                  <Text> {item.line2}</Text>
                  <Text> {item.line3}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Notification;
