import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import KorunanRota from "./components/KorunanRota";
import KDSEkrani from "./pages/KDSEkrani";
import KayitPage from "./pages/KayitPage";
import KullaniciYonetimi from "./pages/KullaniciYonetimi";
import LoginPage from "./pages/LoginPage";
import MasaPlani from "./pages/MasaPlani";
import MenuYonetimi from "./pages/MenuYonetimi";
import RaporEkrani from "./pages/RaporEkrani";
import RezervasyonEkrani from "./pages/RezervasjonEkrani";
import SiparisGirisi from "./pages/SiparisGirisi";
import StokTakip from "./pages/StokTakip";
import YonetimPaneli from "./pages/YonetimPaneli";
import OdemeEkrani from './pages/OdemeEkrani';

const navigationItems = [
  { to: "/yonetim", label: "Panel" },
  { to: "/kullanici", label: "Kullanicilar" },
  { to: "/menu", label: "Menu" },
  { to: "/stok", label: "Stok" },
  { to: "/masalar", label: "Masalar" },
  { to: "/rezervasyon", label: "Rezervasyon" },
  { to: "/siparis", label: "Siparis" },
  { to: "/kds", label: "KDS" },
  { to: "/rapor", label: "Raporlar" },
];

const YetkisizEkran = () => (
  <div className="page-stack">
    <section className="page-header">
      <div>
        <p className="eyebrow">Erisim</p>
        <h1>Bu alana erisim yetkiniz bulunmuyor.</h1>
        <p>Farkli bir rol ile giris yapabilir veya yonetici ile iletisime gecebilirsiniz.</p>
      </div>
    </section>
  </div>
);

const UygulamaKabugu = ({ children, onLogout }) => (
  <div className="app-shell">
    <Navbar navigationItems={navigationItems} onLogout={onLogout} />
    <main className="content-shell">{children}</main>
  </div>
);

function AppRoutes() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("rysUser");

    return {
      token,
      user: rawUser ? JSON.parse(rawUser) : null,
    };
  });

  const isAuthenticated = Boolean(authState.token);

  const handleLogin = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("rysUser", JSON.stringify(payload.kullanici));
    setAuthState({ token: payload.token, user: payload.kullanici });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rysUser");
    setAuthState({ token: null, user: null });
    navigate("/", { replace: true });
  };

  return (
    <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/yonetim" replace />
            ) : (
              <div className="app-shell">
                <main className="content-shell">
                  <LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />
                </main>
              </div>
            )
          }
        />
        <Route
          path="/kayit"
          element={
            isAuthenticated ? (
              <Navigate to="/yonetim" replace />
            ) : (
              <div className="app-shell">
                <main className="content-shell">
                  <KayitPage />
                </main>
              </div>
            )
          }
        />

        <Route
          path="/yonetim"
          element={
            <KorunanRota izinliRoller={["yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <YonetimPaneli />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/kullanici"
          element={
            <KorunanRota izinliRoller={["yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <KullaniciYonetimi />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/menu"
          element={
            <KorunanRota izinliRoller={["yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <MenuYonetimi />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/stok"
          element={
            <KorunanRota izinliRoller={["yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <StokTakip />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/masalar"
          element={
            <KorunanRota izinliRoller={["garson", "yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <MasaPlani />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/siparis"
          element={
            <KorunanRota izinliRoller={["garson", "yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <SiparisGirisi />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/rezervasyon"
          element={
            <KorunanRota izinliRoller={["garson", "yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <RezervasyonEkrani />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/kds"
          element={
            <KorunanRota izinliRoller={["mutfak", "yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <KDSEkrani />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/rapor"
          element={
            <KorunanRota izinliRoller={["yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <RaporEkrani />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/odeme/:id"
          element={
            <KorunanRota izinliRoller={["kasiyer", "yonetici"]}>
              <UygulamaKabugu onLogout={handleLogout}>
                <OdemeEkrani />
              </UygulamaKabugu>
            </KorunanRota>
          }
        />
        <Route
          path="/yetkisiz"
          element={
            <UygulamaKabugu onLogout={handleLogout}>
              <YetkisizEkran />
            </UygulamaKabugu>
          }
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/yonetim" : "/"} replace />} />
      </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
