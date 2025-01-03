import { createContext, useState, useContext } from 'react';

// Create a context
const AuthContext = createContext();

// AuthProvider to provide auth state to the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  // Function to handle login
  const login = (token, userData) => {
    setToken(token);
    setUserData(userData);
  };

  // Function to handle logout
  const logout = () => {
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ token, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
