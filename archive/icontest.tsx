import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function IconTest() {
  return (
    <View style={{ 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#ffffff' 
    }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Icon Test</Text>
      <View style={{ backgroundColor: '#f0f0f0', padding: 20, borderRadius: 10 }}>
        <MaterialIcons name="home" size={40} color="#000000" style={{ marginBottom: 10 }} />
        <MaterialIcons name="school" size={40} color="#B31B1B" style={{ marginBottom: 10 }} />
        <MaterialIcons name="settings" size={40} color="#4A4A4A" />
      </View>
    </View>
  );
} 