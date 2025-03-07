import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { fetchAuthSession } from "../utils/auth";
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.user) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(false);
      }
    };
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    setUserId(null);
    signIn();
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    signOut();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
