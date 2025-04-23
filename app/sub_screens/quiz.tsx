import React from 'react';
import { View, ScrollView, StyleSheet, Button, Pressable } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const QuizScreen = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <IconButton icon="arrow-left" size={24} onPress={handleGoBack} style={styles.returnButton}/>
            <Text style={styles.title}>Quiz</Text>
        </View>
      <ScrollView>
        <Surface style={styles.surface} >
          <Text style={styles.surfaceText}>
            Welcome to the General First Aid Knowledge Quiz!
          </Text>
          <Text style={styles.description}>
            This quiz will test your knowledge about general first aid procedures.
          </Text>
          <Button title="Start Quiz" onPress={() => {}} />
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1, // Take up the available space
    textAlign: 'center', // Center the text
  },
  returnButton: {
    marginLeft: 0, 
  },
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 8,
    marginBottom: 20,
  },
  surfaceText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default QuizScreen;