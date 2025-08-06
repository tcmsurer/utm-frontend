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

export interface Page<T> { content: T[]; totalPages: number; totalElements: number; number: number; size: number; }
export interface UserProfile { id: string; fullName: string; username: string; email: string; phone: string; address: string; }
export interface Usta { id: string; name: string; }
export interface Soru { id: string; usta: Usta; question: string; type: string; options: string[]; order: number; }
export interface Offer { id: string; price: number; details: string; createdDate: string; }
export type RequestStatus = 'OPEN' | 'CLOSED_BY_USER' | 'CLOSED_BY_ADMIN';
export interface ServiceRequest { id: string; title: string; user: UserProfile; category: string; details: { [key: string]: string }; createdDate: string; offers: Offer[]; status: RequestStatus; }
export interface MailLog { id: string; requestTitle: string; email: string; subject: string; body: string; sentDate: string; }
export interface AuthResponse { token: string; }

// --- API Fonksiyonları ---

// Auth
export const loginUser = (credentials: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/login', credentials);
export const registerUser = (details: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/register', details);
export const forgotPassword = (email: string) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token: string, password: string) => api.post('/auth/reset-password', { token, password });

// Halka Açık
export const getUstalar = () => api.get<Usta[]>('/ustalar');
export const getSorularByUsta = (ustaName: string) => api.get<Soru[]>(`/sorular/usta/${ustaName}`);

// Kullanıcıya Özel
export const getMyProfile = () => api.get<UserProfile>('/me');
export const updateUserProfile = (profileData: Partial<UserProfile>) => api.put<UserProfile>('/me', profileData);
export const changePassword = (passwords: any) => api.put('/me/change-password', passwords);
export const getMyRequests = () => api.get<ServiceRequest[]>('/me/requests');
export const createMyRequest = (requestData: any) => api.post('/me/requests', requestData);
export const closeMyRequest = (id: string) => api.put(`/me/requests/${id}/close`);

// Admin'e Özel
export const getAllRequestsForAdmin = (page: number, size: number) => api.get<Page<ServiceRequest>>('/admin/requests', { params: { page, size } });
export const closeRequestByAdmin = (id: string) => api.put(`/admin/requests/${id}/close`);
export const getAllUsersForAdmin = (page: number, size: number) => api.get<Page<UserProfile>>('/admin/users', { params: { page, size } });
export const getUstalarForAdmin = (page: number, size: number) => api.get<Page<Usta>>('/admin/ustalar', { params: { page, size } });
export const createUstaForAdmin = (ustaData: { name: string }) => api.post('/admin/ustalar', ustaData);
export const deleteUstaForAdmin = (id: string) => api.delete(`/admin/ustalar/${id}`);
export const getSorularForAdmin = (page: number, size: number) => api.get<Page<Soru>>('/admin/sorular', { params: { page, size } });
export const createSoruForAdmin = (soruData: any) => api.post('/admin/sorular', soruData);
export const deleteSoruForAdmin = (id: string) => api.delete(`/admin/sorular/${id}`);
export const getMailLogsForAdmin = (page: number, size: number) => api.get<Page<MailLog>>('/admin/maillogs', { params: { page, size } });
export const createOfferForAdmin = (requestId: string, offerData: { price: number; details: string }) => api.post(`/admin/requests/${requestId}/offers`, offerData);