import { useState, useCallback } from 'react';
import { User } from '../types';
import { getUsers, saveUsers, getLoggedInUser, saveLoggedInUser } from '../utils/storage';

/**
 * Hook untuk mengelola seluruh logika autentikasi.
 * Mengisolasi state user, login, logout, dan manajemen akun dari komponen induk.
 */
export function useAuth() {
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [currentUser, setCurrentUser] = useState<User | null>(() => getLoggedInUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getLoggedInUser()));

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    saveLoggedInUser(user);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    saveLoggedInUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleSaveUsers = useCallback(
    (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      saveUsers(updatedUsers);

      // Sync current user if their own data was updated
      if (currentUser) {
        const updatedSelf = updatedUsers.find((u) => u.id === currentUser.id);
        if (updatedSelf) {
          setCurrentUser(updatedSelf);
          saveLoggedInUser(updatedSelf);
        }
      }
    },
    [currentUser]
  );

  return {
    users,
    currentUser,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    saveUsers: handleSaveUsers,
  };
}
