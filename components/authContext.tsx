import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/user";
import { validateTCKN } from "../utils/tcknValidation";

const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/DenizAntalya/DAIEM_DB/main/users.json";
const AUTH_STORAGE_KEY = "@auth_user";

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

const fetchAuthorizedTCKNs = async (): Promise<string[]> => {
  const response = await fetch(GITHUB_RAW_URL);
  if (!response.ok) throw new Error("Kullanıcı listesi alınamadı");
  const data: AuthorizedList = await response.json();
  return data.authorized_tckn;
};

const readStoredUser = async (): Promise<User | null> => {
  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const writeStoredUser = async (user: User | null) => {
  if (user) {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
};

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUser = await readStoredUser();
        if (storedUser) {
          const authorizedTcknList = await fetchAuthorizedTCKNs();
          if (authorizedTcknList.includes(storedUser.tckn)) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            await writeStoredUser(null);
          }
        }
      } catch (err) {
        console.error("Auth yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    writeStoredUser(user).catch((e) =>
      console.error("Kullanıcı verisi kaydedilemedi:", e)
    );
  }, [user]);

  const login = async (tckn: string) => {
    if (isAuthenticated) return;

    try {
      setLoading(true);

      if (!validateTCKN(tckn)) throw new Error("Geçersiz TCKN formatı");

      const authorizedTcknList = await fetchAuthorizedTCKNs();

      if (!authorizedTcknList.includes(tckn)) {
        throw new Error("Kullanıcı bulunamadı");
      }

      const userData: User = {
        tckn,
        isGraduated: false,
        isPaid: false,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Giriş hatası:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setUser(null);
      setIsAuthenticated(false);
      await writeStoredUser(null);
    } catch (err) {
      console.error("Çıkış hatası:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      setUser,
      login,
      logout,
    }),
    [user, loading, isAuthenticated, setUser, login, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
