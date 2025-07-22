import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.log('Restore user error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (data) => {
    setUser(data);
    await AsyncStorage.setItem('user', JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
