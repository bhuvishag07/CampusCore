import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultAdminUser = {
  id: 'usr-admin-01',
  name: 'Admin User',
  email: 'admin@collegehub.edu',
  role: 'Administrator',
  avatarInitials: 'AU',
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('collegehub_auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return defaultAdminUser;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('collegehub_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('collegehub_auth_user');
      }
    } catch {
      // storage handling
    }
  }, [user]);

  const login = (email, role = 'Administrator') => {
    const newUser = {
      id: 'usr-' + Date.now(),
      name:
        email
          .split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Administrator',
      email,
      role,
      avatarInitials: 'AD',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
