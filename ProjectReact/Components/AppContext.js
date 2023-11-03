import { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [jeton, setJeton] = useState('');
  const [utilisateur, setUtilisateur] = useState(null);

  return (
    <AppContext.Provider value={{ jeton, setJeton, utilisateur, setUtilisateur }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

