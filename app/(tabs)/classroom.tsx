import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function Classroom() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Sınıf</Text>
      <Text variant="bodyLarge" style={styles.description}>
        Burada dersleriniz ve öğrenme materyalleriniz olacak.
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