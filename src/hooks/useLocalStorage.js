import { useState } from 'react';

const useLocalStorage = (key, defaultValue = null) => {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      } else {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  });

  // this method update our localStorage and our state
  const setLocalStorageStateValue = (valueOrFn) => {
    let newValue;
    if (typeof valueOrFn === 'function') {
      const fn = valueOrFn;
      newValue = fn(localStorageValue);
    } else {
      newValue = valueOrFn;
    }
    localStorage.setItem(key, JSON.stringify(newValue));
    setLocalStorageValue(newValue);
  };
  return [localStorageValue, setLocalStorageStateValue];
};

export default useLocalStorage;
