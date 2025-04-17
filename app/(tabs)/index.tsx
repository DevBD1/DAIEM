import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Hoş Geldiniz</Text>
      <Text variant="bodyLarge" style={styles.description}>
        Ehliyet sınavına hazırlanmak için doğru adrestesiniz.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  description: {
    marginTop: 16,
    textAlign: 'center',
  },
}); 