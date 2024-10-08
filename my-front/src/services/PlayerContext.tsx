// PlayerContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PlayerContextType {
  deviceId: string | null;
  setDeviceId: (id: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  return (
    <PlayerContext.Provider value={{ deviceId, setDeviceId }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
};
