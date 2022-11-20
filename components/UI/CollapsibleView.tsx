import React, { ComponentType, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";
import Collapsible from "react-native-collapsible";

interface ICollapsibleViewProps extends ViewProps {
  isCollapsed: boolean;
  /**
   * @default false
   * disable collapse action when press on header
   */
  disabled?: boolean;
  /**
   * callback when end collapse animation
   */
  onCollapsed?: () => void;
  /**
   * callback when end expand animation
   */
  onExpanded?: () => void;
  /**
   * Header View always visible
   */
  header?: JSX.Element;
  /**
   * Header View style
   */
  headerStyle?: ViewProps["style"];
  children: JSX.Element | JSX.Element[];
  /**
   * @default TouchableOpacity
   * In case you want to use another component for header
   */
  headerComponent?: ComponentType<any>;
}

/**
 * @description: Can change direction by style={tw`flex-col-reverse`}, but it's not recommended
 * @example
 * <CollapsibleView
      isCollapsed={true}
      disabled={!isEnable}
      header={renderHeader}
    >
    // View can be collapsed
    </CollapsibleView>
 */
const CollapsibleView = (props: ICollapsibleViewProps) => {
  const {
    isCollapsed,
    disabled = false,
    onCollapsed,
    onExpanded,
    header,
    headerStyle,
    children,
    headerComponent = TouchableOpacity,
    ...rest
  } = props;

  const [collapsed, setCollapsed] = useState(isCollapsed);

  const onAnimationEnd = useCallback(() => {
    if (collapsed) {
      onCollapsed?.();
    } else {
      onExpanded?.();
    }
  }, [collapsed, onCollapsed, onExpanded]);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      setCollapsed((prev) => !prev);
    }
  }, [disabled]);

  const HeaderComponent = headerComponent;

  return (
    <View {...rest}>
      {header && (
        <HeaderComponent style={headerStyle} onPress={handlePress}>
          {header}
        </HeaderComponent>
      )}
      <Collapsible collapsed={collapsed} onAnimationEnd={onAnimationEnd}>
        {children}
      </Collapsible>
    </View>
  );
};

export default CollapsibleView;
