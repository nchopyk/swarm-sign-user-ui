import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  const [tokens, setTokens] = useLocalStorage('user-tokens');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setErrorMesage = (errorMessage, ttl = 3000) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, ttl + 1000);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        error,
        setErrorMesage,
        tokens,
        setTokens,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
