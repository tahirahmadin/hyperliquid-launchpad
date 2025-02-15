import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";
import { config } from "@/config/env";

const BASE_API_URL = config.apiUrl;

interface UserInfo {
  address: string;
  profilePic: string;
  depositBalance: number;
  registertedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  login: () => Promise<void>;
  logout: () => void;
  updateUserInfo: () => Promise<void>;
  updateUserState: (updatedUser: UserInfo) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const login = async () => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      // Get nonce
      const nonceResponse = await axios.get(
        `${BASE_API_URL}/api/auth/nonce/${address}`
      );
      const message = `Nonce: ${nonceResponse.data.nonce}`;

      // Sign message
      const signature = await signMessageAsync({ message });

      // Verify signature and get token
      const authResponse = await axios.post(`${BASE_API_URL}/api/auth/verify`, {
        address,
        signature,
      });

      const { token, user } = authResponse.data;

      // Store token and user data
      localStorage.setItem("token", token);
      setToken(token);
      setUserInfo(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserInfo(null);
  };

  // Function to check if JWT is expired
  const isTokenExpired = (token: string) => {
    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // If we can't verify, assume it's expired
    }
  };

  async function fetchAndUpdateUser() {
    if (!token) return;

    try {
      const res = await axios.get(`${BASE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token is invalid or expired
        // logout();
      }
      return null;
    }
  }

  // // Fetch presale info initially and every minute
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchAndUpdateUser();
  //   }, 5000); // 1 minute

  //   return () => clearInterval(interval);
  // }, []);

  // Effect to verify token and load user on mount or token change
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log("Token is expired, logging out");
          logout();
          setLoading(false);
          return;
        }

        // Token exists and is not expired, set it
        setToken(storedToken);

        // Try to fetch user data
        const userData = await fetchAndUpdateUser();
        if (!userData) {
          // If we couldn't get user data, clear everything
          logout();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Axios interceptor to handle token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Token might be expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const updateUserState = async (updatedUser) => {
    setUserInfo(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(userInfo && token),
        token,
        userInfo,
        login,
        logout,
        updateUserInfo: fetchAndUpdateUser,
        updateUserState,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
