import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, profileApi, getAuthToken, setAuthToken, UserProfile } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: { email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "skillswap_auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        setHasToken(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const userData = JSON.parse(stored);
            setUser(userData);
            // Try to fetch profile
            try {
              const userProfile = await profileApi.getProfile();
              setProfile(userProfile);
            } catch {
              // Profile might not exist yet
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const persistUser = (next: { email: string } | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const refreshProfile = async () => {
    try {
      const userProfile = await profileApi.getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setAuthToken(res.token);
    setHasToken(true);
    persistUser({ email: res.email ?? email });
    // Try to fetch profile
    try {
      await refreshProfile();
    } catch {
      // Profile might not exist yet
    }
  };

  const signUp = async (email: string, password: string) => {
    const res = await authApi.register(email, password);
    setAuthToken(res.token);
    setHasToken(true);
    persistUser({ email: res.email ?? email });
    // Try to fetch profile
    try {
      await refreshProfile();
    } catch {
      // Profile might not exist yet
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    }
    setAuthToken(null);
    setHasToken(false);
    persistUser(null);
    setProfile(null);
  };

  const isAuthenticated = !!user || hasToken;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, profile, loading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
