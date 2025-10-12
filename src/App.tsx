import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home';
import AdminPage from './components/AdminPage';
import MyRequests from './components/MyRequests';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ProfilePage from './components/ProfilePage';
import EmailVerificationPage from './components/EmailVerificationPage';
import PasswordResetPage from './components/ResetPasswordPage';
import HizmetlerimizPage from './components/HizmetlerimizPage';
import UstaRehberiListPage from './components/UstaRehberiListPage'; 
import UstaPortfolioDetailPage from './components/UstaPortfolioDetailPage'; // Yeni portfolyo detay sayfası
import UstaPortfolioYonetimi from './components/admin/UstaPortfolioYonetimi';
import './App.css';

// Admin rotalarını korumak için özel bir bileşen
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth.isAdmin ? children : <Navigate to="/" />;
};

// Kullanıcı rotalarını korumak için özel bir bileşen
const UserRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth.token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Herkesin Erişebileceği Sayfalar */}
          <Route path="/" element={<Home />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/hizmetlerimiz" element={<HizmetlerimizPage />} />
          <Route path="/usta-rehberi" element={<UstaRehberiListPage />} />
          
          {/* DİKKAT: Eski rota, yeni portfolyo rotası ile değiştirildi */}
          <Route path="/usta-portfolio/:ustaId" element={<UstaPortfolioDetailPage />} />
          
          <Route path="/sifre-sifirla" element={<PasswordResetPage />} />
          <Route path="/email-dogrula" element={<EmailVerificationPage />} />

          {/* Sadece Giriş Yapmış Kullanıcıların Erişebileceği Sayfalar */}
          <Route path="/profilim" element={<UserRoute><ProfilePage /></UserRoute>} />
          <Route path="/taleplerim" element={<UserRoute><MyRequests /></UserRoute>} />

          {/* Sadece Adminlerin Erişebileceği Sayfalar */}
          <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/admin/usta-portfolio/:ustaId" element={<AdminRoute><UstaPortfolioYonetimi /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;