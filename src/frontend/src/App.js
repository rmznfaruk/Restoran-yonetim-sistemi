import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";

import KDSEkrani from "./pages/KDSEkrani";
import KullaniciYonetimi from "./pages/KullaniciYonetimi";
import LoginPage from "./pages/LoginPage";
import MasaPlani from "./pages/MasaPlani";
import MenuYonetimi from "./pages/MenuYonetimi";
import RaporEkrani from "./pages/RaporEkrani";
import RezervasyonEkrani from "./pages/RezervasjonEkrani";

const navigationItems = [
  { to: "/", label: "Giriş" },
  { to: "/kullanici", label: "Kullanıcılar" },
  { to: "/menu", label: "Menü" },
  { to: "/masalar", label: "Masalar" },
  { to: "/rezervasyon", label: "Rezervasyon" },
  { to: "/kds", label: "KDS" },
  { to: "/rapor", label: "Raporlar" },
];

const dashboardCards = [
  { title: "Menü Yönetimi", text: "Ürün, kategori ve stok akışını tek yerden yönetin.", link: "/menu" },
  { title: "Masa Planı", text: "Salon düzenini canlı durum bilgileriyle izleyin.", link: "/masalar" },
  { title: "Rezervasyon", text: "Müşteri taleplerini uygun masa kapasitesiyle eşleyin.", link: "/rezervasyon" },
  { title: "Mutfak Ekranı", text: "Aktif siparişleri önceliğe göre mutfağa taşıyın.", link: "/kds" },
];

function YonetimPaneli() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Yönetim Paneli</p>
          <h1>Servis, mutfak ve masa operasyonları aynı akışta.</h1>
          <p className="hero-copy">
            RYS arayüzü; salon, mutfak ve yönetim ekiplerinin aynı görsel dili kullanarak daha hızlı karar vermesi için
            yeniden düzenlendi.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-chip">
            <strong>7</strong>
            <span>Aktif ekran</span>
          </div>
          <div className="stat-chip">
            <strong>Canlı</strong>
            <span>Operasyon görünümü</span>
          </div>
          <div className="stat-chip">
            <strong>Tek tema</strong>
            <span>Uyumlu arayüz</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        {dashboardCards.map((card) => (
          <article key={card.title} className="surface-card feature-card">
            <p className="eyebrow">{card.title}</p>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <Link className="inline-action" to={card.link}>
              Ekranı aç
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark">RYS</div>
            <div>
              <p className="brand-kicker">Restoran Yönetim Sistemi</p>
              <h2 className="brand-title">Operasyon Merkezi</h2>
            </div>
          </div>

          <nav className="topnav">
            {navigationItems.map((item) => (
              <Link key={item.to} className="topnav-link" to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="content-shell">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/kullanici" element={<KullaniciYonetimi />} />
            <Route path="/menu" element={<MenuYonetimi />} />
            <Route path="/masalar" element={<MasaPlani />} />
            <Route path="/rezervasyon" element={<RezervasyonEkrani />} />
            <Route path="/kds" element={<KDSEkrani />} />
            <Route path="/rapor" element={<RaporEkrani />} />
            <Route path="/yonetim" element={<YonetimPaneli />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
