import SiparisGirisi from './pages/SiparisGirisi';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MasaPlani from './pages/MasaPlani'; // Az önce oluşturduğumuz dosya

function App() {
  return (
    <Router>
      <div>
        {/* Basit bir navigasyon menüsü */}
        <nav style={{ padding: '10px', backgroundColor: '#f4f4f4', marginBottom: '20px' }}>
          <Link to="/masa-plani" style={{ marginRight: '15px', textDecoration: 'none', color: '#1E7E34', fontWeight: 'bold' }}>
            Masa Planı
          </Link>
          {/* Gelecekteki Sipariş Girişi linkini de buraya ekleyebiliriz */}
        </nav>

        {/* Sayfa Yönlendirmeleri */}
        <Routes>
          <Route path="/siparis" element={<SiparisGirisi />} />
          <Route path="/masa-plani" element={<MasaPlani />} />
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h1>Restoran Yönetim Sistemi</h1>
              <p>Lütfen yukarıdaki menüden bir işlem seçin.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;