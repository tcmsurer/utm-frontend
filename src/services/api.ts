import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const originalRequestUrl = error.config.url;
      if (originalRequestUrl !== '/auth/login' && originalRequestUrl !== '/auth/register') {
        localStorage.removeItem('jwt_token');
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- INTERFACE TANIMLARI ---
export interface Page<T> { content: T[]; totalPages: number; totalElements: number; number: number; size: number; }
export interface UserProfile { id: string; fullName: string; username: string; email: string; phone: string; address: string; emailVerified: boolean; }
export interface Hizmet { id?: string; title: string; description: string; videoUrl: string; }
export interface Usta { 
    id: string; 
    name: string;
    profileImageUrl?: string; // Bu alanı ekle/güncelle
}
export interface Soru { id: string; usta: Usta; question: string; type: string; options: string[]; order: number; }
export interface Offer { id: string; price: number; details: string; createdDate: string; }
export type RequestStatus = 'OPEN' | 'CLOSED_BY_USER' | 'CLOSED_BY_ADMIN';
export interface ServiceRequest { id: string; title: string; user: UserProfile; category: string; details: { [key: string]: string }; address: string; createdDate: string; offers: Offer[]; status: RequestStatus; }
export interface MailLog { id:string; requestTitle: string; email: string; subject: string; body: string; sentDate: string; }
export interface AuthResponse { token: string; }
export interface Reply { id: string; senderUsername: string; text: string; date: string; }

export interface RehberIcerik {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    isActive: boolean;
    createdDate: string;
    usta: Usta;
}

export interface RehberIcerikDto {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
}

// --- API FONKSİYONLARI ---

// Auth
export const loginUser = (credentials: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/login', credentials);
export const registerUser = (details: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/register', details);
export const forgotPassword = (email: string) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token: string, password: string) => api.post('/auth/reset-password', { token, password });
export const verifyEmail = (token: string) => api.get(`/auth/verify-email?token=${token}`);

// Public
export const getUstalar = () => api.get<Usta[]>('/ustalar');
export const getSorularByUsta = (ustaName: string) => api.get<Soru[]>(`/sorular/usta/${ustaName}`);
export const getAllHizmetler = () => api.get<Hizmet[]>('/hizmetler');

// User
export const getMyProfile = () => api.get<UserProfile>('/me');
export const updateUserProfile = (profileData: Partial<UserProfile>) => api.put<UserProfile>('/me', profileData);
export const changePassword = (passwords: any) => api.post('/me/change-password', passwords);
export const resendVerificationEmail = () => api.post('/me/resend-verification-email');
export const getMyRequests = () => api.get<ServiceRequest[]>('/me/requests');
export const createMyRequest = (requestData: any) => api.post('/me/requests', requestData);
export const closeMyRequest = (id: string) => api.put(`/me/requests/${id}/close`);
export const getRepliesForRequest = (requestId: string) => api.get<Reply[]>(`/requests/${requestId}/replies`);
export const postUserReply = (requestId: string, text: string) => api.post<Reply>(`/me/requests/${requestId}/replies`, { text });

// Admin
export const getAllRequestsForAdmin = (page: number, size: number) => api.get<Page<ServiceRequest>>('/admin/requests', { params: { page, size } });
export const closeRequestByAdmin = (id: string) => api.put(`/admin/requests/${id}/close`);
export const getAllUsersForAdmin = (page: number, size: number) => api.get<Page<UserProfile>>('/admin/users', { params: { page, size } });
export const getUstalarForAdmin = (page: number, size: number) => api.get<Page<Usta>>('/admin/ustalar', { params: { page, size } });
export const createUsta = (formData: FormData) => {
    return api.post<Usta>('/admin/ustalar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const updateUsta = (id: string, formData: FormData) => {
    return api.put<Usta>(`/admin/ustalar/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const getSorularForAdmin = (page: number, size: number) => api.get<Page<Soru>>('/admin/sorular', { params: { page, size } });
export const createSoruForAdmin = (soruData: any) => api.post('/admin/sorular', soruData);
export const deleteSoruForAdmin = (id: string) => api.delete(`/admin/sorular/${id}`);
export const getMailLogsForAdmin = (page: number, size: number) => api.get<Page<MailLog>>('/admin/maillogs', { params: { page, size } });
export const createOfferForAdmin = (requestId: string, offerData: { price: number; details: string }) => api.post(`/admin/requests/${requestId}/offers`, offerData);
export const updateOfferForAdmin = (offerId: string, price: number) => api.put(`/admin/offers/${offerId}`, { price });
export const postAdminReply = (requestId: string, text: string) => api.post<Reply>(`/admin/requests/${requestId}/replies`, { text });
export const getAdminHizmetler = () => api.get<Hizmet[]>('/admin/hizmetler');
export const createHizmet = (hizmet: Hizmet) => api.post<Hizmet>('/admin/hizmetler', hizmet);
export const getHizmetById = (id: string) => api.get<Hizmet>(`/admin/hizmetler/${id}`);
export const updateHizmet = (id: string, hizmet: Hizmet) => api.put<Hizmet>(`/admin/hizmetler/${id}`, hizmet);
export const deleteHizmet = (id: string) => api.delete(`/admin/hizmetler/${id}`);

// --- USTA REHBERİ / PORTFOLYO ---

// Usta Aktif/Pasif İşlemleri
export const deactivateUsta = (id: string) => api.delete(`/admin/ustalar/${id}`);
export const activateUsta = (id: string) => api.put(`/admin/ustalar/${id}/activate`);

// Public: Bir ustanın portfolyosunu listeler
export const getActivePortfolioByUsta = (ustaId: string) => 
    api.get<RehberIcerikDto[]>(`/ustalar/${ustaId}/portfolio`);

// Admin: Bir ustanın portfolyosunu listeler
export const getPortfolioForAdmin = (ustaId: string) => 
    api.get<RehberIcerik[]>(`/admin/ustalar/${ustaId}/portfolio`);

// Admin: Bir ustaya yeni portfolyo içeriği ekler
export const createPortfolioItem = (ustaId: string, formData: FormData) => {
    return api.post<RehberIcerik>(`/admin/ustalar/${ustaId}/portfolio`, formData);
};

// Admin: Bir portfolyo içeriğini siler
export const deletePortfolioItem = (contentId: string) => 
    api.delete(`/admin/portfolio/${contentId}`);