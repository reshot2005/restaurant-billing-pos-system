import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  projectId,
  publicAnonKey,
} from "../../utils/supabase/info";

interface User {
  id: string;
  username: string;
  role: "owner" | "manager" | "cashier";
  display_name: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    display_name: string,
    avatar?: string,
  ) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1b17e9b2/api`;

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Verify token is still valid
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token invalid, clear auth
        logout();
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  
const login = async (username: string, password: string) => {
    // Primary method: attempt to call remote auth endpoint
    const payload = { username, password };
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the API responded with an error status, attempt to parse the message.
        let errorMsg = "Login failed";
        try {
          const errBody = await response.json();
          errorMsg = errBody.error || errBody.message || errorMsg;
        } catch (e) {
          // ignore json parse errors
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      // Expecting { accessToken, user }
      if (!data || !data.accessToken || !data.user) {
        throw new Error("Invalid response from authentication server.");
      }

      setAccessToken(data.accessToken);
      setUser(data.user);

      // Persist to localStorage for page reloads
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true, source: "remote" };
    } catch (error: any) {
      console.warn("Primary login method failed, switching to local fallback. Error:", error?.message || error);
      // Fallback: if remote API is unreachable or returns errors, use a local dev fallback
      // NOTE: Replace these hardcoded credentials with a secure flow or real API in production.
      const FALLBACK_USERS: Record<string, any> = {
        "admin": { id: "local-admin", username: "admin", role: "owner", display_name: "Local Admin" },
        "cashier": { id: "local-cashier", username: "cashier", role: "cashier", display_name: "Local Cashier" }
      };
      // Example hardcoded password check (for dev only)
      const valid = (username === "admin" && password === "password123") || (username === "cashier" && password === "cashier123");
      if (valid) {
        const userObj = FALLBACK_USERS[username];
        const token = "local-dev-token-" + username;
        setAccessToken(token);
        setUser(userObj);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        return { success: true, source: "fallback" };
      }

      // If fallback also fails, rethrow the original error with a friendly message
      const friendly = error?.message ? error.message : "Unable to login. Please check your credentials or network connection.";
      throw new Error(friendly);
    }
  };
;

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  };

  const updateProfile = async (
    display_name: string,
    avatar?: string,
  ) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ display_name, avatar }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
}