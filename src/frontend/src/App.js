import React from "react";
// Link'i import etmeyi unutmamalıyız, main dalındaki navigasyon bunu kullanıyor
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Diğer bileşenlerin import edildiğinden emin ol
import MenuYonetimi from "./pages/MenuYonetimi";
import RaporEkrani from "./pages/RaporEkrani";
import LoginPage from "./pages/LoginPage"; 
import KullaniciYonetimi from "./pages/KullaniciYonetimi"; 

function App() {
  return (
    <BrowserRouter>
      {/* Üst Menü (Sayfalar arası gezinebilmen için geçici olarak duruyor) */}
      <nav style={{ padding: '15px', background: '#2C3E50', marginBottom: '20px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>🚪 Giriş (Login)</Link>
        <Link to="/kullanici" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>👥 Kullanıcı Yönetimi</Link>
        <Link to="/menu" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>🍔 Menü Yönetimi</Link>
        {/* Rapor ekranına da menüden gidilebilsin diye buraya bir link ekledim */}
        <Link to="/rapor" style={{ color: 'white', textDecoration: 'none' }}>📊 Rapor Ekranı</Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Ana sayfada LoginPage çıkacak */}
          <Route path="/" element={<LoginPage />} />
          
          <Route path="/kullanici" element={<KullaniciYonetimi />} />
          <Route path="/menu" element={<MenuYonetimi />} />
          
          {/* Senin eklediğin Rapor Ekranı rotasını da buraya yerleştirdik */}
          <Route path="/rapor" element={<RaporEkrani />} />
          
          {/* Giriş yap butonuna basınca gideceği Yönetim Paneli için geçici bir rota */}
          <Route path="/yonetim" element={<h2 style={{textAlign: 'center'}}>Giriş Başarılı! Yönetim Paneli Yakında Eklenecek.</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
