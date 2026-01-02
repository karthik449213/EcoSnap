// Demo authentication system - works on iOS, Android, and Web
import { useContext, createContext, useState, useCallback, ReactNode } from 'react';

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  ecoPoints: number;
  streak: number;
  avatar: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-user-1',
    username: 'Alex Green',
    email: 'alex@ecosnap.app',
    ecoPoints: 8500,
    streak: 42,
    avatar: '🟢',
  },
  {
    id: 'demo-user-2',
    username: 'Jordan Earth',
    email: 'jordan@ecosnap.app',
    ecoPoints: 7200,
    streak: 28,
    avatar: '🌍',
  },
  {
    id: 'demo-user-3',
    username: 'Sam Nature',
    email: 'sam@ecosnap.app',
    ecoPoints: 9100,
    streak: 55,
    avatar: '🌿',
  },
  {
    id: 'demo-user-4',
    username: 'Casey Eco',
    email: 'casey@ecosnap.app',
    ecoPoints: 6800,
    streak: 21,
    avatar: '♻️',
  },
  {
    id: 'demo-user-5',
    username: 'River Clean',
    email: 'river@ecosnap.app',
    ecoPoints: 12300,
    streak: 73,
    avatar: '💧',
  },
];

interface AuthContextType {
  currentUser: DemoUser | null;
  isAuthenticated: boolean;
  login: (userIdOrUsername: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  const login = useCallback((userIdOrUsername: string) => {
    // Try to find by ID first, then by username
    let user = DEMO_USERS.find((u) => u.id === userIdOrUsername);
    
    if (!user) {
      user = DEMO_USERS.find(
        (u) => u.username.toLowerCase() === userIdOrUsername.toLowerCase()
      );
    }
    
    if (user) {
      console.log('[DemoAuth] Logged in as:', user.username);
      setCurrentUser(user);
    } else {
      console.warn('[DemoAuth] User not found:', userIdOrUsername);
    }
  }, []);

  const logout = useCallback(() => {
    console.log('[DemoAuth] Logged out');
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useDemoAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider');
  }
  return context;
};
