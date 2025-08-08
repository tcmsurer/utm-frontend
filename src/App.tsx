import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AdminPage from './components/AdminPage';
import MyRequests from './components/MyRequests';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ProfilePage from './components/ProfilePage';
import EmailVerificationPage from './components/EmailVerificationPage';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profilim" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/taleplerim" element={<MyRequests />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/email-dogrula" element={<EmailVerificationPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;