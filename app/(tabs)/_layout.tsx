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
        headerShown: true,
        headerTitle: "",
        headerTitleAlign: 'center',
        headerTintColor: "#8C8C8C",
        headerTransparent: false,
        headerStyle: {
          backgroundColor: '#1e2124',
        },
//
        tabBarActiveTintColor: '#7289da',
        tabBarInactiveTintColor: '#8C8C8C',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#1e2124',
          borderTopWidth: 0.5,
          borderTopColor: '#8C8C8C',
          height: 64,
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
              {/*<Text style={[styles.tabLabel, { color }]}>Ana Sayfa</Text>*/}
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
              {/*<Text style={[styles.tabLabel, { color }]}>Sınıflar</Text>*/}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }: { color: string }) => ( 
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="settings" size={28} color={color} />
              {/*<Text style={[styles.tabLabel, { color }]}>Ayarlar</Text>*/}
            </View>
          )
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
    marginLeft: -10,
    marginTop: -2,
    marginRight: 12,
    //tintColor: '#FFFFFF',
  },
  headerContainerMotto:{
    paddingRight: 16,
    flex:1,
  },
  mottoText: {
    color: '#FFFFFF',
    fontSize: 16,
    minWidth: 256,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
  },
});