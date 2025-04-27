import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { router, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from './AuthContext';
import { validateTCKN } from '../utils/validation';

const inputTheme = {
  colors: { 
    background: '#424549',
    onSurfaceVariant: '#FFFFFF'
  }
};

export default function Login() {
  const [tckn, setTckn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      if (!tckn) {
        throw new Error('Lütfen TCKN giriniz');
      }

      if (!validateTCKN(tckn)) {
        throw new Error('Geçersiz TCKN');
      }

      await login(tckn);
      router.replace('/(tabs)');
    } catch (err) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      if (err instanceof Error) {
        if (err.message.includes('Kullanıcı bulunamadı')) {
          errorMessage = 'Kullanıcı bulunamadı';
        } else if (err.message === 'Geçersiz TCKN') {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen 
        options={{
          title: 'Giriş',
          headerStyle: {
            backgroundColor: '#1e2124',
          },
          headerTintColor: '#fff',
        }}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Image
                source={require('../../assets/daiem-logo.png')}
                style={styles.logo}
                accessibilityLabel="DAIEM Logo"
                accessible={true}
              />
              
              <Text variant="headlineSmall" style={styles.title}>Deniz Antalya İlk Yardım Eğitim Merkezi</Text>
              
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <TextInput
                label="TCKN"
                value={tckn}
                onChangeText={setTckn}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                maxLength={11}
                autoCapitalize="none"
                disabled={loading}
                outlineColor="#8C8C8C"
                activeOutlineColor="#7289da"
                textColor="#FFFFFF"
                theme={inputTheme}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                disabled={loading}
              >
                Giriş Yap
              </Button>

              <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                labelStyle={[styles.buttonLabel, { color: '#7289da' }]}
                disabled={loading}
              >
                Geri Dön
              </Button>

              <Text style={styles.infoText}>
                Kayıtlar yalnızca Manavgat şubemizden yapılır.
              </Text>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282b30',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 4,
  },
  card: {
    backgroundColor: '#424549',
    borderWidth: 1,
    borderColor: '#8C8C8C',
  },
  cardContent: {
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    width: '60%',
    marginBottom: 16,
    backgroundColor: '#424549',
  },
  button: {
    width: '100%',
    marginTop: 8,
    backgroundColor: '#7289da',
    borderRadius: 12,
  },
  secondaryButton: {
    width: '100%',
    marginTop: 12,
    borderColor: '#7289da',
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    color: '#8C8C8C',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    paddingHorizontal: 16,
  },
}); 