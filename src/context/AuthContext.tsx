import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { loginUser, registerUser, getMyProfile } from '../services/api';
import type { AuthResponse, UserProfile } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { AxiosResponse } from 'axios';

interface AuthContextType {
    token: string | null;
    user: UserInfo | null;
    isAdmin: boolean;
    userProfile: UserProfile | null;
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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const isAdmin = user?.authorities?.includes('ROLE_ADMIN') || false;

    const fetchUserProfile = async () => {
        try {
            const response = await getMyProfile();
            setUserProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            setUserProfile(null);
        }
    };

    useEffect(() => {
        console.log("AuthContext: Uygulama yuklendi, token kontrol ediliyor.");
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            console.log("AuthContext: Token bulundu, kullanici bilgileri isleniyor.");
            try {
                const decodedUser = jwtDecode<UserInfo>(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
                fetchUserProfile();
            } catch (error) {
                console.error("AuthContext: Gecersiz token, temizleniyor.");
                localStorage.removeItem('jwt_token');
                setUser(null); setToken(null); setUserProfile(null);
            }
        } else {
            console.log("AuthContext: Token bulunamadi.");
        }
    }, []);

    const handleAuth = async (
        apiAuthFunction: (credentials: any) => Promise<AxiosResponse<AuthResponse>>,
        credentials: any
    ) => {
        try {
            const response = await apiAuthFunction(credentials);
            const newToken = response.data.token;
            
            console.log("handleAuth: Yeni token alindi, localStorage'a kaydediliyor.");
            localStorage.setItem('jwt_token', newToken);
            
            const decodedUser = jwtDecode<UserInfo>(newToken);
            setToken(newToken);
            setUser(decodedUser);
            await fetchUserProfile();
        } catch (error) {
            console.error("handleAuth: Giris/kayit basarisiz.", error);
            throw error;
        }
    };
    
    const login = (credentials: any) => handleAuth(loginUser, credentials);
    const register = (details: any) => handleAuth(registerUser, details);

    const logout = () => {
        console.log("logout: Cikis yapiliyor, token temizleniyor.");
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        setUserProfile(null);
    };

    const value = { token, user, isAdmin, userProfile, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};