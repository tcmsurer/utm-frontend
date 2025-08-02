import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import AdminPage from './components/AdminPage';
import MyRequests from './components/MyRequests';
import AboutPage from './components/AboutPage'; // Yeni import
import ContactPage from './components/ContactPage'; // Yeni import
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="p-0"> {/* container-fluid'i kaldırdık, tam kontrol bizde */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/taleplerim" element={<MyRequests />} />
            <Route path="/hakkimizda" element={<AboutPage />} /> {/* Yeni Rota */}
            <Route path="/iletisim" element={<ContactPage />} /> {/* Yeni Rota */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;