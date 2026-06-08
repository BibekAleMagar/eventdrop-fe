import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthContextType } from "../types/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { User } from "../types/User";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          "access_token",
          "auth_user",
        ]);

        const token = storedToken[1];
        const user = storedUser[1];
        if (token && user) {
          setToken(token);
          setUser(JSON.parse(user));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = useCallback(async (token: string, user: User) => {
    try {
      await AsyncStorage.multiSet([
        ["access_token", token],
        ["auth_user", JSON.stringify(user)],
      ]);

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch {}

      await AsyncStorage.multiRemove(["access_token", "auth_user"]);
      queryClient.clear();
    } catch (error) {
      console.error("Failed to clear auth state:", error);
    } finally {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/index");
    }
  }, []);

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
      await AsyncStorage.setItem("auth_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user in storage:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
