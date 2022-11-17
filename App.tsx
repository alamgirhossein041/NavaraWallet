import { NavigationContainer } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import "intl";
import { extendTheme, NativeBaseProvider } from "native-base";
import React from "react";
import { useColorScheme } from "react-native";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { useDeviceContext } from "twrnc";
import GetAppState from "./components/UI/GetAppState";
import { primaryColor } from "./configs/theme";
import { EventHub } from "./core/eventHub";
import AppRoutes from "./navigation";
import { tw } from "./utils/tailwind";

export const eventHub = new EventHub();

function App() {
  //connect to sentry
  Sentry.init({
    dsn: "https://b8791cf0a397459a8c7ec639bd8aa1f0@o462495.ingest.sentry.io/6509089",
    tracesSampleRate: 1.0,
    enableNative: false,
    enabled: !__DEV__,
  });
  const queryClient = new QueryClient();
  useDeviceContext(tw);
  const scheme = useColorScheme();
  const DarkThemeCustom = {
    dark: true,
    colors: {
      primary: primaryColor,
      background: "#18191A",
      card: "#18191A",
      text: "white",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)",
    },
  };
  const LightThemeCustom = {
    dark: false,
    colors: {
      primary: primaryColor,
      background: "white",
      card: "white",
      text: "black",
      border: "rgb(199, 199, 204)",
      notification: "rgb(255, 69, 58)",
    },
  };
  const config = {
    useSystemColorMode: scheme === "dark",
    initialColorMode: "light",
  };
  const customTheme = extendTheme({ config });

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <GestureHandlerRootView style={tw`flex-1`}>
          <NavigationContainer
            theme={scheme === "dark" ? DarkThemeCustom : LightThemeCustom}
          >
            <NativeBaseProvider theme={customTheme}>
              <GetAppState />
              <AppRoutes />
            </NativeBaseProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(App, {});
