// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OTP from './pages/OTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChoicePage from './pages/ChoicePage';
import UploadProduct from './pages/UploadProduct';
import MainPage from './pages/MainPage';
import ChatPage from './pages/ChatPage';
import ChatListPage from './pages/ChatListPage';
import ProfilePage from './pages/ProfilePage'; // or wherever it's located
import DeletedProductsPage from './pages/DeletedProductsPage';
import TermsPage from './pages/TermsPage';
import Contact from './pages/Contact';

// Components
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatHeader from './components/ChatHeader';
import ChatBox from './components/ChatBox';
import ChatInput from './components/ChatInput';



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/choice-page" element={<ChoicePage />} />
      <Route path="/upload-product" element={<UploadProduct />} />
      <Route path="/main-page" element={<MainPage />} />
      <Route path="/product-card" element={<ProductCard />} />
      <Route path="/product-modal" element={<ProductModal />} />
      <Route path="/header" element={<Header />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/chat-list" element={<ChatListPage />} />
      <Route path="/chat-header" element={<ChatHeader />} />
      <Route path="/chat-box" element={<ChatBox />} />
      <Route path="/chat-input" element={<ChatInput />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/deleted" element={<DeletedProductsPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<Contact />} />

      
    </Routes>
  );
};

export default App;
