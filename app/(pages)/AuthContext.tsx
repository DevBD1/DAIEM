import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/DenizAntalya/DAIEM_DB/main/users.json';
const AUTH_STORAGE_KEY = '@auth_user';

interface AuthorizedList {
  authorized_tckn: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (tckn: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load stored auth state
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Verify the stored TCKN is still authorized
          const response = await fetch(GITHUB_RAW_URL);
          if (response.ok) {
            const data: AuthorizedList = await response.json();
            if (data.authorized_tckn.includes(parsedUser.tckn)) {
              setUser(parsedUser);
              setIsAuthenticated(true);
            } else {
              // Remove unauthorized user from storage
              await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Store auth state when it changes
  useEffect(() => {
    const storeAuthState = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error storing auth state:', error);
      }
    };

    storeAuthState();
  }, [user]);

  const login = async (tckn: string) => {
    if (isAuthenticated) {
      console.log('Already authenticated');
      return;
    }

    try {
      setLoading(true);

      // Validate TCKN format
      if (!tckn.match(/^[1-9][0-9]{10}$/)) {
        throw new Error('Geçersiz TCKN formatı');
      }

      // Fetch authorized TCKNs from GitHub
      const response = await fetch(GITHUB_RAW_URL);
      if (!response.ok) {
        throw new Error('Kullanıcı listesi alınamadı');
      }

      const data: AuthorizedList = await response.json();
      console.log('Authorized TCKNs:', data.authorized_tckn);
      console.log('Attempting login with TCKN:', tckn);
      
      // Check if TCKN is authorized
      if (!data.authorized_tckn.includes(tckn)) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Create user object
      const userData: User = {
        tckn,
        isGraduated: false,
        isPaid: false
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider; 