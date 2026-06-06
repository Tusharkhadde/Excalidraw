"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextValue {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    signin: (token: string) => void;
    signout: () => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("token");
        if (stored) {
            setToken(stored);
            api.setToken(stored);
        }
        setIsLoading(false);
    }, []);

    const refresh = useCallback(async () => {
        const stored = localStorage.getItem("token");
        if (!stored) {
            setUser(null);
            setToken(null);
            return;
        }
        try {
            const res = await fetch(`${api.baseUrl}/me`, {
                headers: { Authorization: stored },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setToken(stored);
                api.setToken(stored);
            } else {
                localStorage.removeItem("token");
                api.setToken(null);
                setToken(null);
                setUser(null);
            }
        } catch {
            // network error — keep existing state
        }
    }, []);

    useEffect(() => {
        if (token) {
            refresh();
        }
    }, [token, refresh]);

    const signin = useCallback((newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        api.setToken(newToken);
        refresh();
    }, [refresh]);

    const signout = useCallback(() => {
        localStorage.removeItem("token");
        api.setToken(null);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, isLoading, signin, signout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
