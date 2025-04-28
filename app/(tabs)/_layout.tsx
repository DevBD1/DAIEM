import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, Text, View, StyleSheet, Alert, Pressable } from 'react-native';
import { useAuth } from '../(pages)/AuthContext';
import { router } from 'expo-router';
import type { TabNavigationState, NavigationHelpers } from '@react-navigation/native';
import mottos from '../../assets/mottos.json';
const randomMotto =
  mottos[Math.floor(Math.random() * mottos.length)];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerTitleAlign: 'center',
        headerTintColor: "#8C8C8C",
        headerTransparent: false,
        headerStyle: {
          backgroundColor: '#1e2124',
          height: 110,
        },
        tabBarActiveTintColor: '#7289da',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#1e2124',
          height: 80,
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 8,
          paddingBottom: 8,
        },
        headerLeft: () => (
          <View style={styles.headerContainer}>
            <Image
              source={require('../../assets/daiem-logo.png')}
              style={styles.logoStyle}
              accessibilityLabel="DAIEM Logo" 
              accessible={true}
            />
            <Text style={styles.mottoText} numberOfLines={1}>
              {randomMotto}
            </Text>
          </View>
        ),
        headerRight: () => null
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="home" size={28} color={color} />
            </View>
          ),
        }} 
      />
      <Tabs.Screen
        name="classroom"
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="school" size={28} color={color} />
            </View>
          )
        }}
      />
      {/*<Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }: { color: string }) => ( 
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="settings" size={28} color={color} />
            </View>
          )
        }}
      />*/}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logoStyle: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginLeft: 0,
    marginTop: 0,
    marginRight: 16,
  },
  headerContainerMotto:{
    paddingRight: 16,
    flex: 1,
  },
  mottoText: {
    color: '#FFFFFF',
    fontSize: 16,
    minWidth: 256,
    flexShrink: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
  },
});