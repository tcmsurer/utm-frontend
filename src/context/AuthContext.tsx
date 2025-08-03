import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { loginUser, registerUser } from '../services/api';
import type { AuthResponse } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { AxiosResponse } from 'axios';

interface AuthContextType {
    token: string | null;
    user: UserInfo | null;
    isAdmin: boolean;
    login: (credentials: any) => Promise<void>;
    register: (details: any) => Promise<void>;
    logout: () => void;
}

interface UserInfo {
    sub: string;
    authorities?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode<UserInfo>(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
                const roles = decodedUser.authorities || [];
                setIsAdmin(roles.includes('ROLE_ADMIN'));
            } catch (error) {
                localStorage.removeItem('jwt_token');
                setUser(null);
                setToken(null);
                setIsAdmin(false);
            }
        }
    }, []);

    const handleAuth = async (
        apiAuthFunction: (credentials: any) => Promise<AxiosResponse<AuthResponse>>,
        credentials: any
    ) => {
        try {
            const response = await apiAuthFunction(credentials);
            const newToken = response.data.token;
            
            localStorage.setItem('jwt_token', newToken);
            const decodedUser = jwtDecode<UserInfo>(newToken);
            setToken(newToken);
            setUser(decodedUser);
            const roles = decodedUser.authorities || [];
            setIsAdmin(roles.includes('ROLE_ADMIN'));
        } catch (error) {
            console.error("Authentication failed:", error);
            throw error;
        }
    };
    
    const login = (credentials: any) => handleAuth(loginUser, credentials);
    const register = (details: any) => handleAuth(registerUser, details);

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        setIsAdmin(false);
    };

    const value = { token, user, isAdmin, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};