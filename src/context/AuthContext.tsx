import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, AuthState } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<User>;
  demoLogin: () => Promise<User>;
  register: (name: string, email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getInitialState());

  useEffect(() => {
    // Keep authState synced
    authService.saveState(authState);
  }, [authState]);

  const login = async (email: string, password?: string): Promise<User> => {
    const user = await authService.login(email, password);
    setAuthState({
      user,
      isAuthenticated: true,
      token: 'jwt-session-' + Date.now(),
    });
    return user;
  };

  const demoLogin = async (): Promise<User> => {
    return login('elena@lumina.journal', 'password123');
  };

  const register = async (name: string, email: string, password?: string): Promise<User> => {
    const user = await authService.register(name, email, password);
    setAuthState({
      user,
      isAuthenticated: true,
      token: 'jwt-session-' + Date.now(),
    });
    return user;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
  };

  const updateProfile = async (updates: Partial<User>): Promise<User> => {
    const updated = await authService.updateProfile(updates);
    setAuthState((prev) => ({
      ...prev,
      user: updated,
    }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
