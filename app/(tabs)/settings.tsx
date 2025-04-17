import { View, StyleSheet } from 'react-native';
import { Text, Switch, List } from 'react-native-paper';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Uygulama Ayarları</List.Subheader>
        <List.Item
          title="Bildirimler"
          right={() => (
            <Switch value={notifications} onValueChange={setNotifications} />
          )}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 