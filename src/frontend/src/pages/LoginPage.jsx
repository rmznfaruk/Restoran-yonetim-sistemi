import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const quickFacts = [
  "Salon, mutfak ve raporlama ekranları aynı panelden yönetilir.",
  "Masa durumları, rezervasyon akışı ve sipariş görünümü tek yapıda birleşir.",
  "Yönetim ekibi için sakin, okunaklı ve hızlı karar odaklı bir arayüz sunar.",
];

const LoginPage = () => {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hataMesaji, setHataMesaji] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!kullaniciAdi || !sifre) {
      setHataMesaji("Lütfen kullanıcı adı ve şifrenizi girin.");
      return;
    }

    setHataMesaji("");
    navigate("/yonetim");
  };

  const handleKayitOl = () => {
    alert("Kullanıcı oluşturma sayfası yakında eklenecek.");
  };

  return (
    <section className="login-shell">
      <div className="login-visual">
        <div>
          <p className="eyebrow">RYS deneyimi</p>
          <h1>Restoran operasyonunu sakin, güçlü ve tek bakışta anlaşılır hale getirin.</h1>
          <p className="hero-copy">
            Bu yeni arayüz; yoğun servis saatlerinde karar yükünü azaltmak, masa ve sipariş akışını netleştirmek için
            tasarlandı.
          </p>
        </div>

        <div className="surface-card" style={{ background: "rgba(255,255,255,0.08)", color: "white" }}>
          <h3 className="section-title">Neler sizi bekliyor?</h3>
          <ul>
            {quickFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="login-card">
        <div className="login-panel">
          <div className="login-logo">RYS</div>
          <p className="eyebrow" style={{ marginTop: 18 }}>Hoş geldiniz</p>
          <h1>Yönetim paneline giriş yapın</h1>
          <p className="helper-text">Devam etmek için kullanıcı bilgilerinizle oturum açın.</p>

          {hataMesaji && <div className="error-banner">{hataMesaji}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label className="field-label">Kullanıcı Adı</label>
              <input
                className="field-input"
                type="text"
                placeholder="Örn: yonetici_ahmet"
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Şifre</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
              />
            </div>

            <button className="action-button" type="submit">Sisteme Giriş Yap</button>
            <button className="ghost-button" type="button" onClick={handleKayitOl}>Yeni Kullanıcı Oluştur</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
