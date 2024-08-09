import React, { createContext, useContext, useEffect, useState } from 'react';

interface StoreContextProps {
  gasInfo: boolean;
  setGasInfo: (value: boolean) => void;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [gasInfo, setGasInfo] = useState<boolean>(() => {
    const savedValue = localStorage.getItem('GAS_INFO');
    return savedValue !== null ? false : true;
  });

  useEffect(() => {
    if (!gasInfo) {
      localStorage.setItem('GAS_INFO', JSON.stringify(gasInfo));
    }
  }, [gasInfo]);

  return (
    <StoreContext.Provider value={{
      gasInfo,
      setGasInfo
    }}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export { StoreProvider, useStore };
