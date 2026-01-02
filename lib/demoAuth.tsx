// Demo authentication system - works on iOS, Android, and Web
import { useContext, createContext, useState, useCallback, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';
import { initializeDefaultSnaps } from './ecoActions';

export interface DemoUser {
  id: string;
  username: string;
  email: string;
  ecoPoints: number;
  streak: number;
  avatar: ImageSourcePropType;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-user-1',
    username: 'Alexa',
    email: 'alex@ecosnap.app',
    ecoPoints: 8500,
    streak: 42,
    avatar: require('@/assets/images/girluse.jpg'),
  },
  {
    id: 'demo-user-2',
    username: 'Manoj',
    email: 'manoj@ecosnap.app',
    ecoPoints: 7200,
    streak: 28,
    avatar: require('@/assets/images/jaw.jpg'),
  },
  {
    id: 'demo-user-3',
    username: 'Sam Nature',
    email: 'sammm@gmail.com',
    ecoPoints: 9100,
    streak: 55,
    avatar: require('@/assets/images/sam.jpg'),
  },
  {
    id: 'demo-user-4',
    username: 'Karthikeya',
    email: 'karthikpiinasi@gmail.com',
    ecoPoints: 633800,
    streak: 21,
    avatar: require('@/assets/images/rahgu.jpg'),
  },
  {
    id: 'demo-user-5',
    username: 'River Clean',
    email: 'river@ecosnap.app',
    ecoPoints: 12300,
    streak: 73,
    avatar: require('@/assets/images/user3.jpg'),
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
      // Initialize default snaps for this user
      initializeDefaultSnaps(user.id).catch(err => {
        console.error('[DemoAuth] Failed to initialize default snaps:', err);
      });
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
