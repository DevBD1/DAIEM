import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image, Text, View, StyleSheet } from 'react-native';
import mottos from '../../assets/mottos.json';

const randomMotto =
  mottos[Math.floor(Math.random() * mottos.length)];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#B31B1B',
        tabBarInactiveTintColor: '#BFBFBF',
        headerShown: true,
        headerTintColor: "#FFFFFF",
        headerTransparent: false,
        headerTitle: "",
        headerStyle: {
          backgroundColor: '#4A4A4A',
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
        headerRight: () => null,
      
        tabBarStyle: {
          backgroundColor: '#4A4A4A',
          borderTopWidth: 0.5,
          borderTopColor: '#8C8C8C',
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarShowLabel: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="classroom"
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="school" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }: { color: string }) => (
            <MaterialIcons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    tintColor: '#FFFFFF',
  },
  logoStyle: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    marginLeft: -8,
    marginTop: 0,
    marginRight: 16,
    //tintColor: '#FFFFFF',
  },
  headerContainerMotto:{
    paddingRight: 16,
    flex:1,
  },
  mottoText: {
    color: '#FFFFFF',
    fontSize: 12,
    minWidth:180,
  },
});