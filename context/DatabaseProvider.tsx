// context/DatabaseProvider.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { initDatabase } from '../data/Database';

export const DatabaseReadyContext = createContext(false);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await initDatabase();
        console.log('✅ Database initialized');
        setIsReady(true);
      } catch (err) {
        console.error('❌ DB init failed:', err);
      }
    };

    prepare();
  }, []);

  if (!isReady) {
    return null; // Or return a splash/loading screen here
  }

  return (
    <DatabaseReadyContext.Provider value={true}>
      {children}
    </DatabaseReadyContext.Provider>
  );
}
