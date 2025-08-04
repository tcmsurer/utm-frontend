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
      localStorage.removeItem('jwt_token');
      if (window.location.pathname !== '/') {
          window.location.href = '/';
      }
      alert("Oturum süreniz doldu veya yetkiniz yok. Lütfen tekrar giriş yapın.");
    }
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

export interface Offer {
    id: string;
    price: number;
    details: string;
    createdDate: string;
}

// DİKKAT: Bu tip, backend'deki DTO ile tam uyumlu olacak şekilde güncellendi.
export interface ServiceRequest {
  id: string;
  title: string;
  username: string; // user objesi yerine artık sadece username
  category: string;
  details: { [key: string]: string }; // description yerine tüm detaylar burada
  createdDate: string;
  offers: Offer[];
}

export interface MailLog {
    id: string;
    serviceRequest: ServiceRequest;
    email: string;
    subject: string;
    body: string;
    sentDate: string;
}

export interface AuthResponse {
  token: string;
}

// --- Auth Endpoints ---
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