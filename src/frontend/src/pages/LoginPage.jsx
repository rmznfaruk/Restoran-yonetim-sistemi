import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const quickFacts = [
  "Salon, mutfak ve raporlama ekranlari ayni panelden yonetilir.",
  "Masa durumlari, rezervasyon akisi ve siparis gorunumu tek yapida birlesir.",
  "Yonetim ekibi icin sakin, okunakli ve hizli karar odakli bir arayuz sunar.",
];

const roleLandingPaths = {
  yonetici: "/yonetim",
  garson: "/masalar",
  kasiyer: "/rapor",
  mutfak: "/kds",
};

const LoginPage = ({ onLogin, isAuthenticated }) => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const [yardimMesaji, setYardimMesaji] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/yonetim");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!kullaniciAdi || !sifre) {
      setHataMesaji("Lutfen kullanici adi ve sifrenizi girin.");
      return;
    }

    setYukleniyor(true);
    setHataMesaji("");
    setYardimMesaji("");

    try {
      const response = await axios.post("/api/auth/login", {
        kullanici_adi: kullaniciAdi,
        sifre,
      });

      const hedefYol = roleLandingPaths[response.data?.kullanici?.rol] || "/yonetim";
      onLogin?.(response.data);

      if (response.data?.mesaj?.toLowerCase?.().includes("demo")) {
        setYardimMesaji("Veritabani hazir olana kadar demo yonetici hesabi kullaniliyor.");
      }

      navigate(hedefYol);
    } catch (error) {
      setHataMesaji(
        error.response?.data?.mesaj ||
          "Giris yapilamadi. Backend sunucusunun acik oldugunu kontrol edin."
      );
    } finally {
      setYukleniyor(false);
    }
  };

  const handleKayitOl = () => {
    setHataMesaji("");
    setYardimMesaji("");
    navigate("/kayit");
  };

  return (
    <section className="login-shell">
      <div className="login-visual">
        <div>
          <p className="eyebrow">RYS deneyimi</p>
          <h1>Restoran operasyonunu sakin, guclu ve tek bakista anlasilir hale getirin.</h1>
          <p className="hero-copy">
            Bu yeni arayuz; yogun servis saatlerinde karar yukunu azaltmak, masa ve siparis akisini netlestirmek icin
            tasarlandi.
          </p>
        </div>

        <div className="surface-card login-side-panel">
          <h3 className="section-title">Neler sizi bekliyor?</h3>
          <ul>
            {quickFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <div className="pill pill--neutral">Demo giris: admin / RysAdmin123!</div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-panel">
          <div className="login-logo">RYS</div>
          <p className="eyebrow" style={{ marginTop: 18 }}>
            Hos geldiniz
          </p>
          <h1>Yonetim paneline giris yapin</h1>
          <p className="helper-text">Devam etmek icin kullanici bilgilerinizle oturum acin.</p>

          {hataMesaji ? <div className="error-banner">{hataMesaji}</div> : null}
          {yardimMesaji ? <div className="info-banner">{yardimMesaji}</div> : null}

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label className="field-label">Kullanici Adi</label>
              <input
                className="field-input"
                type="text"
                placeholder="Orn: yonetici_ahmet"
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                disabled={yukleniyor}
              />
            </div>

            <div>
              <label className="field-label">Sifre</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                disabled={yukleniyor}
              />
            </div>

            <button className="action-button" type="submit" disabled={yukleniyor}>
              {yukleniyor ? "Giris yapiliyor..." : "Sisteme Giris Yap"}
            </button>
            <button className="ghost-button" type="button" onClick={handleKayitOl} disabled={yukleniyor}>
              Yeni Kullanici Olustur
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
