import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/theme.css';
import Navbar from './components/home/Navbar';
import Footer from './components/home/Footer';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import VerifyEmail from './pages/auth/VerifyEmail';
import Login from './pages/auth/Login';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import NotFoundPage from './components/404';

function MainContent() {
  const location = useLocation();
  const authPaths = [
    '/login',
    '/signup',
    '/forgot-password',
  ];
  const isAuthPage =
    authPaths.includes(location.pathname) ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/verify-email');

  return (
    <div className="min-h-screen flex flex-col bg-rose">
      <Navbar />
      <main className={`flex-1 w-full p-4 sm:p-6 md:p-8${isAuthPage ? ' flex justify-center items-center' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Routes commentées sauf "/" */}
          {/** <Route path="/signup" element={<SignUp />} /> */}
          {/** <Route path="/verify-email" element={<VerifyEmail />} /> */}
          {/** <Route path="/login" element={<Login />} /> */}
          {/** <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
          {/** <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> */}
          {/** <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
