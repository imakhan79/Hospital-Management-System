
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean; // Add this function
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // For demonstration, let's auto-login the user
  // In a real app, we would check for a token in localStorage
  // and validate it with the backend
  React.useEffect(() => {
    const mockUser = {
      id: 'user-1',
      email: 'admin@hospital.com',
      name: 'Admin User',
      role: 'admin'
    };
    
    setUser(mockUser);
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    // Here we'd normally make an API call to authenticate
    // For demo purposes, we'll just set a mock user
    const mockUser = {
      id: 'user-1',
      email: email,
      name: 'Admin User',
      role: 'admin'
    };
    
    setUser(mockUser);
  };
  
  const logout = () => {
    setUser(null);
  };

  // Simple permission check based on user role
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // For other roles, we could implement a more sophisticated check
    // For now, we'll just return false
    return false;
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
