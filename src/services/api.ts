import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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

// Tipleri ve DTO'ları tanımlama (Backend ile uyumlu)
export interface Usta {
  id: string;
  name: string;
}

export interface Soru {
  id: string;
  usta: Usta;
  question: string;
  type: string;
  options: string[];
  order: number;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  user: { username: string };
  category: string;
  email: string;
  phone: string;
  address: string;
  details: { [key: string]: string };
  createdDate: string;
  offers: Offer[]; // Gelen teklifleri tutacak dizi
}

export interface MailLog {
    id: string;
    serviceRequest: ServiceRequest;
    email: string;
    subject: string;
    body: string;
    sentDate: string;
}

// Backend'den gelen token objesinin tipi
export interface AuthResponse {
  token: string;
}

export interface Offer {
    id: string;
    price: number;
    details: string;
    createdDate: string;
}

// --- Auth Endpoints ---
// AxiosResponse<AuthResponse> -> Gelen cevabın data alanının AuthResponse tipinde olacağını belirtir
export const loginUser = (credentials: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/login', credentials);
export const registerUser = (details: any): Promise<AxiosResponse<AuthResponse>> => api.post('/auth/register', details);

// --- Halka Açık Endpoints ---
export const getUstalar = () => api.get<Usta[]>('/ustalar');
export const getSorularByUsta = (ustaName: string) => api.get<Soru[]>(`/sorular/usta/${ustaName}`);

// --- Kullanıcıya Özel Endpoints (Token Gerekli) ---
export const getMyProfile = () => api.get('/me');
export const getMyRequests = () => api.get<ServiceRequest[]>('/me/requests');
export const createMyRequest = (requestData: any) => api.post('/me/requests', requestData);

// --- Admin'e Özel Endpoints (Token ve Admin Rolü Gerekli) ---
export const getAllRequestsForAdmin = () => api.get<ServiceRequest[]>('/admin/requests');
export const getAllUsersForAdmin = () => api.get('/admin/users');

// Usta yönetimi
export const createUstaForAdmin = (ustaData: { name: string }) => api.post('/admin/ustalar', ustaData);
export const deleteUstaForAdmin = (id: string) => api.delete(`/admin/ustalar/${id}`);

// Soru yönetimi
export const getSorularForAdmin = () => api.get<Soru[]>('/admin/sorular');
export const createSoruForAdmin = (soruData: any) => api.post('/admin/sorular', soruData);
export const deleteSoruForAdmin = (id: string) => api.delete(`/admin/sorular/${id}`);

// Mail Log yönetimi
export const getMailLogsForAdmin = () => api.get<MailLog[]>('/admin/maillogs');

// Teklif yönetimi
export const createOfferForAdmin = (requestId: string, offerData: { price: number; details: string }) => 
    api.post(`/admin/requests/${requestId}/offers`, offerData);