import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'FIELD_WORKER';
  status: 'ON_DUTY' | 'OFF_DUTY';
};

type AuthContextType = {
  user: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch users initially to have them available for the "mock login" switcher
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        // Auto-login the admin for convenience during development, or check localStorage
        const savedUserId = localStorage.getItem('squadra_userId');
        if (savedUserId) {
          const found = data.find((u: User) => u.id === savedUserId);
          if (found) setUser(found);
        } else if (data.length > 0) {
          const admin = data.find((u: User) => u.role === 'ADMIN') || data[0];
          setUser(admin);
          localStorage.setItem('squadra_userId', admin.id);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users for auth:", err);
        setIsLoading(false);
      });
  }, []);

  const login = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem('squadra_userId', found.id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('squadra_userId');
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
