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
import PasswordResetPage from './components/ResetPasswordPage'; // Yeni eklendi
import HizmetlerimizPage from './components/HizmetlerimizPage'; // Yeni eklendi
import './App.css';

// Admin rotalarını korumak için özel bir bileşen
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  // Not: AuthContext'in yüklenmesini beklemek için küçük bir kontrol eklenebilir
  // ancak şimdilik bu yapı çalışacaktır.
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
          {/* Herkesin erişebileceği sayfalar */}
          <Route path="/" element={<Home />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/hizmetlerimiz" element={<HizmetlerimizPage />} />
          <Route path="/sifre-sifirla" element={<PasswordResetPage />} />
          <Route path="/email-dogrula" element={<EmailVerificationPage />} />

          {/* Sadece giriş yapmış kullanıcıların erişebileceği sayfalar */}
          <Route path="/profilim" element={<UserRoute><ProfilePage /></UserRoute>} />
          <Route path="/taleplerim" element={<UserRoute><MyRequests /></UserRoute>} />

          {/* Sadece adminlerin erişebileceği sayfalar */}
          <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;