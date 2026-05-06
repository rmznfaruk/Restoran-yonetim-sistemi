import React, { useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import KDSEkrani from "./pages/KDSEkrani";
import KullaniciYonetimi from "./pages/KullaniciYonetimi";
import LoginPage from "./pages/LoginPage";
import MasaPlani from "./pages/MasaPlani";
import MenuYonetimi from "./pages/MenuYonetimi";
import RaporEkrani from "./pages/RaporEkrani";
import RezervasyonEkrani from "./pages/RezervasjonEkrani";
import SiparisGirisi from "./pages/SiparisGirisi";
import StokTakip from "./pages/StokTakip";
import YonetimPaneli from "./pages/YonetimPaneli";

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

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("rysUser");

    return {
      token,
      user: rawUser ? JSON.parse(rawUser) : null,
    };
  });

  const isAuthenticated = Boolean(authState.token);

  const topbarSubtitle = useMemo(() => {
    if (!authState.user) {
      return "Oturum acilmadi";
    }

    return `${authState.user.kullaniciAdi} • ${authState.user.rol}`;
  }, [authState.user]);

  const handleLogin = (payload) => {
    localStorage.setItem("token", payload.token);
    localStorage.setItem("rysUser", JSON.stringify(payload.kullanici));
    setAuthState({ token: payload.token, user: payload.kullanici });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rysUser");
    setAuthState({ token: null, user: null });
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark">RYS</div>
            <div>
              <p className="brand-kicker">Restoran Yonetim Sistemi</p>
              <h2 className="brand-title">Operasyon Merkezi</h2>
              <p className="topbar-meta">{topbarSubtitle}</p>
            </div>
          </div>

          <nav className="topnav">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => (
                  <Link key={item.to} className="topnav-link" to={item.to}>
                    {item.label}
                  </Link>
                ))}
                <button className="ghost-button topbar-button" type="button" onClick={handleLogout}>
                  Cikis yap
                </button>
              </>
            ) : (
              <Link className="topnav-link" to="/">
                Giris
              </Link>
            )}
          </nav>
        </header>

        <main className="content-shell">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/yonetim" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />
                )
              }
            />
            <Route
              path="/yonetim"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <YonetimPaneli currentUser={authState.user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kullanici"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <KullaniciYonetimi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/menu"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MenuYonetimi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stok"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <StokTakip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masalar"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <MasaPlani />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siparis"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SiparisGirisi />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rezervasyon"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <RezervasyonEkrani />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kds"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <KDSEkrani />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rapor"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <RaporEkrani />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
