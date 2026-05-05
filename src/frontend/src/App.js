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
import SiparisGirisi from "./pages/SiparisGirisi";

const navigationItems = [
  { to: "/", label: "Giris" },
  { to: "/kullanici", label: "Kullanicilar" },
  { to: "/menu", label: "Menu" },
  { to: "/masalar", label: "Masalar" },
  { to: "/rezervasyon", label: "Rezervasyon" },
  { to: "/siparis", label: "Siparis" },
  { to: "/kds", label: "KDS" },
  { to: "/rapor", label: "Raporlar" },
];

const dashboardCards = [
  { title: "Menu Yonetimi", text: "Urun, kategori ve stok akislarini tek yerden yonetin.", link: "/menu" },
  { title: "Masa Plani", text: "Salon duzenini canli durum bilgileriyle izleyin.", link: "/masalar" },
  { title: "Siparis Girisi", text: "Masaya ozel urun secimi yapip siparisi tek akista olusturun.", link: "/siparis" },
  { title: "Rezervasyon", text: "Musteri taleplerini uygun masa kapasitesiyle esleyin.", link: "/rezervasyon" },
  { title: "Mutfak Ekrani", text: "Aktif siparisleri oncelige gore mutfaga tasiyin.", link: "/kds" },
];

function YonetimPaneli() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Yonetim Paneli</p>
          <h1>Servis, mutfak ve masa operasyonlari ayni akista.</h1>
          <p className="hero-copy">
            RYS arayuzu; salon, mutfak ve yonetim ekiplerinin ayni gorsel dili kullanarak daha hizli karar vermesi icin
            yeniden duzenlendi.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-chip">
            <strong>8</strong>
            <span>Aktif ekran</span>
          </div>
          <div className="stat-chip">
            <strong>Canli</strong>
            <span>Operasyon gorunumu</span>
          </div>
          <div className="stat-chip">
            <strong>Tek tema</strong>
            <span>Uyumlu arayuz</span>
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
              Ekrani ac
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
              <p className="brand-kicker">Restoran Yonetim Sistemi</p>
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
            <Route path="/siparis" element={<SiparisGirisi />} />
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
