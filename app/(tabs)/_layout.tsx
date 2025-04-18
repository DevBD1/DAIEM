import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#B31B1B',
        tabBarInactiveTintColor: '#BFBFBF',
        headerShown: true,
        headerTransparent: false,
        headerTitle: '',
        headerStyle: {
          backgroundColor: '#4A4A4A',
        },
        tabBarStyle: {
          backgroundColor: '#4A4A4A',
          borderTopWidth: 0.5,
          borderTopColor: '#8C8C8C',
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
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