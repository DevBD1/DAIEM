import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { styles } from "../../components/styles";
import { createTabIcon } from "../../components/tabIcon";
import mottos from "../../assets/mottos.json";

const tabBarColors = {
  active: "#7289da",
  inactive: "#8C8C8C",
  background: "#1e2124",
};

const commonHeaderStyle = {
  backgroundColor: tabBarColors.background,
  height: 100,
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 0,
  borderWidth: 0,
};

const commonTabBarStyle = {
  backgroundColor: tabBarColors.background,
  height: 65,
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 0,
  borderWidth: 0,
  paddingTop: 0,
  paddingBottom: 0,
};

const HeaderLeft: React.FC<{ motto: string }> = ({ motto }) => (
  <View style={styles.headerContainer}>
    <Image
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require("../../assets/daiem-logo.png")}
      style={styles.logoStyle}
      accessibilityLabel="DAIEM Logo"
      accessible
    />
    <Text style={styles.mottoText} numberOfLines={1}>
      {motto}
    </Text>
  </View>
);

export default function TabsLayout() {
  const randomMotto = useMemo(
    () => mottos[Math.floor(Math.random() * mottos.length)],
    []
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerTitleAlign: "center",
        headerTintColor: tabBarColors.inactive,
        headerTransparent: false,
        headerStyle: commonHeaderStyle,
        tabBarActiveTintColor: tabBarColors.active,
        tabBarInactiveTintColor: tabBarColors.inactive,
        tabBarShowLabel: false,
        tabBarStyle: commonTabBarStyle,
        headerLeft: () => <HeaderLeft motto={randomMotto} />,
        headerRight: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: createTabIcon("home") }}
      />
      <Tabs.Screen
        name="classroom"
        options={{ tabBarIcon: createTabIcon("school") }}
      />
    </Tabs>
  );
}
