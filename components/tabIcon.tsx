import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";

type TabIconProps = {
  color: string;
};

export function createTabIcon(
  iconName: keyof typeof MaterialIcons.glyphMap
): React.FC<TabIconProps> {
  const IconComponent: React.FC<TabIconProps> = ({ color }) => (
    <View style={styles.tabBarContainer}>
      <MaterialIcons name={iconName} size={28} color={color} />
    </View>
  );

  IconComponent.displayName = `TabIcon(${iconName})`;
  return IconComponent;
}
