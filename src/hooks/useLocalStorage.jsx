const useLocalStorage = () => {
    const setValue = (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    };
  
    const getValue = (key) => {
      const value = localStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value);
    };
  
    const clearAll = () => {
      localStorage.clear();
    };
  
    const removeValue = (key) => {
      localStorage.removeItem(key);
    };
  
    return {
      setValue,
      getValue,
      clearAll,
      removeValue,
    };
  };
  
  export default useLocalStorage;
  