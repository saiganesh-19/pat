import { createContext, useContext, useState } from "react";

const SessionContext = createContext(null);

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return ctx;
};

export function SessionProvider({ children }) {
  const [activeSession, setActiveSession] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);

  console.log("PROVIDER RENDER", { activeSession, sessionHistory });

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        setActiveSession,
        sessionHistory,
        setSessionHistory
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
