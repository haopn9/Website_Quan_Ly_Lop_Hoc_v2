import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import MainPage from './pages/Main/MainPage';
import LoginPage from './pages/Login/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Tuyến đường trang chủ */}
        <Route path="/" element={<MainPage />} />
        {/* Tuyến đường trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />


      </Routes>
    </Router>
  );
}

export default App;