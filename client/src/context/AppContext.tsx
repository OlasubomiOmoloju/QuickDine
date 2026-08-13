/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import api from "../lib/api.js";
import toast from "react-hot-toast";

interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: "user" | "admin" | "owner";
}

interface AppContextType {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    login: (email: string, password: string) => Promise<boolean>;
    register: (
        name: string,
        email: string,
        password: string,
        phone?: string,
        role?: string
    ) => Promise<boolean>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export const AppContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<UserType | null>(null);

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState<boolean>(true);

    const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);

    // LOGIN
    const login = async (
        email: string,
        password: string
    ): Promise<boolean> => {
        try {
            setLoading(true);

            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const { token: userToken, ...userData } = res.data;

            // Save token
            localStorage.setItem("token", userToken);

            // Update React state
            setToken(userToken);
            setUser(userData);

            toast.success(`Welcome back, ${userData.name}`);

            return true;
        } catch (error: any) {
            console.error("LOGIN ERROR:", error);
            console.error("LOGIN RESPONSE:", error?.response?.data);

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Login failed"
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    // REGISTER
    const register = async (
        name: string,
        email: string,
        password: string,
        phone?: string,
        role?: string
    ): Promise<boolean> => {
        try {
            setLoading(true);

            const res = await api.post("/auth/register", {
                name,
                email,
                password,
                phone,
                role,
            });

            const { token: userToken, ...userData } = res.data;

            // Save token
            localStorage.setItem("token", userToken);

            // Update React state
            setToken(userToken);
            setUser(userData);

            toast.success(`Welcome to QuickDine Club!`);

            return true;
        } catch (error: any) {
            console.error("REGISTER ERROR:", error);
            console.error("REGISTER RESPONSE:", error?.response?.data);

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Registration failed"
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        window.location.href = "/";
    };

    // CHECK IF USER IS STILL LOGGED IN
    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api.get("/auth/me");
                setUser(res.data);
            } catch (error: any) {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const value: AppContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext must be used within AppContextProvider"
        );
    }

    return context;
};