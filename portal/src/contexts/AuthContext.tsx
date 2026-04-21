import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

export interface User {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
  passwordSalt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
}

const USERS_STORAGE_KEY = "novapulse_users_v2";
const SESSION_STORAGE_KEY = "novapulse_session_v2";
const SIGNUP_WEBHOOK_URL = "https://your-n8n-endpoint.example/webhook/signup";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function sanitizeUser(user: StoredUser): User {
  const { passwordHash, passwordSalt, ...safeUser } = user;
  return safeUser;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string, salt: string) {
  const payload = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readStorage<User | null>(SESSION_STORAGE_KEY, null);
    setUser(session);
    setIsLoading(false);
  }, []);

  const persistSession = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      writeStorage(SESSION_STORAGE_KEY, nextUser);
    } else {
      removeStorage(SESSION_STORAGE_KEY);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const users = readStorage<Record<string, StoredUser>>(USERS_STORAGE_KEY, {});
    const email = normalizeEmail(data.email);

    if (users[email]) {
      throw new Error("An account with this email already exists.");
    }

    const passwordSalt = crypto.randomUUID();
    const passwordHash = await hashPassword(data.password, passwordSalt);

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName: data.fullName.trim(),
      email,
      companyName: data.companyName.trim(),
      phone: data.phone.trim(),
      onboardingStep: 0,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      passwordHash,
      passwordSalt,
    };

    writeStorage(USERS_STORAGE_KEY, {
      ...users,
      [email]: newUser,
    });

    const safeUser = sanitizeUser(newUser);
    persistSession(safeUser);

    try {
      const response = await fetch(SIGNUP_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: safeUser.fullName,
          email: safeUser.email,
          phone: safeUser.phone,
          companyName: safeUser.companyName,
          signupDate: safeUser.createdAt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Signup webhook failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Signup webhook failed", error);
    }
  }, [persistSession]);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);
    const users = readStorage<Record<string, StoredUser>>(USERS_STORAGE_KEY, {});
    const account = users[normalizedEmail];

    if (!account) {
      throw new Error("Invalid email or password.");
    }

    const providedHash = await hashPassword(password, account.passwordSalt);
    if (providedHash !== account.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    persistSession(sanitizeUser(account));
  }, [persistSession]);

  const logout = useCallback(() => {
    persistSession(null);
  }, [persistSession]);

  const updateUser = useCallback((data: Partial<User>) => {
    if (!user) return;

    const users = readStorage<Record<string, StoredUser>>(USERS_STORAGE_KEY, {});
    const currentRecord = users[user.email];
    if (!currentRecord) return;

    const updatedRecord: StoredUser = {
      ...currentRecord,
      ...data,
    };

    writeStorage(USERS_STORAGE_KEY, {
      ...users,
      [user.email]: updatedRecord,
    });

    persistSession(sanitizeUser(updatedRecord));
  }, [persistSession, user]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function triggerWebhook(event: string, data: Record<string, unknown>) {
  const url = `https://your-webhook-url.com/webhook/${event}`;
  console.log(`[Webhook] ${event}:`, data, `→ ${url}`);
  // In production, uncomment:
  // fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).catch(console.error);
}
