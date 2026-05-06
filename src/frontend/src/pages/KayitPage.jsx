import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const bosForm = {
  ad_soyad: "",
  kullanici_adi: "",
  sifre: "",
  rol: "garson",
};

const KayitPage = () => {
  const [form, setForm] = useState(bosForm);
  const [hataMesaji, setHataMesaji] = useState("");
  const [basariMesaji, setBasariMesaji] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const navigate = useNavigate();

  const handleChange = (alan) => (event) => {
    setForm((onceki) => ({ ...onceki, [alan]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setYukleniyor(true);
    setHataMesaji("");
    setBasariMesaji("");

    try {
      const response = await axios.post("/api/users/register", form);
      setBasariMesaji(response.data?.mesaj || "Kullanici hesabi olusturuldu.");
      setForm(bosForm);
      window.setTimeout(() => navigate("/", { replace: true }), 900);
    } catch (error) {
      setHataMesaji(
        error.response?.data?.mesaj || "Kayit olusturulamadi. Lutfen daha sonra tekrar deneyin."
      );
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <section className="login-shell">
      <div className="login-visual">
        <div>
          <p className="eyebrow">Yeni kullanici</p>
          <h1>RYS ekibine hizli bir kayit akisi ile katilin.</h1>
          <p className="hero-copy">
            Garson, kasiyer veya mutfak ekibi icin temel hesap olusturup hemen giris ekranina donebilirsiniz.
          </p>
        </div>

        <div className="surface-card login-side-panel">
          <h3 className="section-title">Kayit kurallari</h3>
          <ul>
            <li>Yonetici rolu bu ekrandan acilmaz, yonetici panelinden tanimlanir.</li>
            <li>Kullanici adi benzersiz olmalidir.</li>
            <li>Kayit tamamlaninca giris ekranina geri yonlendirilirsiniz.</li>
          </ul>
        </div>
      </div>

      <div className="login-card">
        <div className="login-panel">
          <div className="login-logo">RYS</div>
          <p className="eyebrow" style={{ marginTop: 18 }}>
            Kayit
          </p>
          <h1>Yeni kullanici olustur</h1>
          <p className="helper-text">Temel personel hesabinizi olusturun ve ardindan giris yapin.</p>

          {hataMesaji ? <div className="error-banner">{hataMesaji}</div> : null}
          {basariMesaji ? <div className="info-banner">{basariMesaji}</div> : null}

          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Ad Soyad</label>
              <input
                className="field-input"
                value={form.ad_soyad}
                onChange={handleChange("ad_soyad")}
                disabled={yukleniyor}
                required
              />
            </div>

            <div>
              <label className="field-label">Kullanici Adi</label>
              <input
                className="field-input"
                value={form.kullanici_adi}
                onChange={handleChange("kullanici_adi")}
                disabled={yukleniyor}
                required
              />
            </div>

            <div>
              <label className="field-label">Sifre</label>
              <input
                className="field-input"
                type="password"
                value={form.sifre}
                onChange={handleChange("sifre")}
                disabled={yukleniyor}
                required
              />
            </div>

            <div>
              <label className="field-label">Rol</label>
              <select
                className="field-select"
                value={form.rol}
                onChange={handleChange("rol")}
                disabled={yukleniyor}
              >
                <option value="garson">Garson</option>
                <option value="kasiyer">Kasiyer</option>
                <option value="mutfak">Mutfak</option>
              </select>
            </div>

            <button className="action-button" type="submit" disabled={yukleniyor}>
              {yukleniyor ? "Kayit olusturuluyor..." : "Hesap Olustur"}
            </button>
            <Link className="ghost-button" to="/">
              Giris ekranina don
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
};

export default KayitPage;
