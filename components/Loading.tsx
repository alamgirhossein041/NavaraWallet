import { Heading, HStack, Spinner } from "native-base";
import React, { FunctionComponent } from "react";

import { View } from "react-native";

/**
 * @param children: JSX.Element
 * @return React.Suspense for Recoil async state
 */

const Loading = ({ children }: { children: JSX.Element }) => {
    return (
        <React.Suspense fallback={<HStack space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading" />
            <Heading color="primary.500" fontSize="md">
                Loading
            </Heading>
        </HStack>
        }>
            {children}
        </React.Suspense>
    )
};

export default Loading;