import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Sayfaları import ediyoruz (MasaPlani eklendi)
import KullaniciYonetimi from './pages/KullaniciYonetimi';
import MenuYonetimi from './pages/MenuYonetimi';
import MasaPlani from './pages/MasaPlani'; // Yeni eklediğimiz sayfa
import StokTakip from './pages/StokTakip'; // Sayfayı içeri alıyoruz

function App() {
  return (
    <BrowserRouter>
      {/* Üst Menü - Tasarımı biraz daha modern ve plana uygun hale getirdik */}
      <nav style={{ 
        padding: '15px 30px', 
        background: '#1a1a1a', 
        borderBottom: '2px solid #FFD700',
        display: 'flex',
        gap: '30px'
      }}>
        <Link to="/" style={linkStili}>🏠 Ana Sayfa</Link>
        <Link to="/kullanici" style={linkStili}>👥 Kullanıcı Yönetimi</Link>
        <Link to="/menu" style={linkStili}>🍔 Menü Yönetimi</Link>
        <Link to="/masalar" style={linkStili}>🪑 Masa Planı</Link>
      </nav>

      <div style={{ backgroundColor: '#121212', minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          {/* Ana sayfa karşılama ekranı */}
          <Route path="/" element={
            <div style={{ textAlign: "center", padding: '100px', color: 'white' }}>
              <h1 style={{ color: '#FFD700', fontSize: '3.5rem' }}>RYS Restoran Otomasyonu</h1>
              
            </div>
          } />
          
          {/* Sayfa Rotaları */}
          <Route path="/kullanici" element={<KullaniciYonetimi />} />
          <Route path="/menu" element={<MenuYonetimi />} />
          <Route path="/masalar" element={<MasaPlani />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Navlinkler için basit stil objesi
const linkStili = { 
  color: 'white', 
  textDecoration: 'none', 
  fontWeight: 'bold',
  fontSize: '1.1rem'
};

export default App;