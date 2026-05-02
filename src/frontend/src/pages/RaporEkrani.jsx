import React, { useEffect, useState } from "react";
import axios from "axios";

const RaporEkrani = () => {
  const [periyot, setPeriyot] = useState("gunluk");
  const [rapor, setRapor] = useState(null);

  useEffect(() => {
    veriGetir();
  }, [periyot]);

  const veriGetir = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:3001/api/reports?periyot=${periyot}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRapor(res.data);
    } catch (err) {
      console.log("Hata:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rapor Ekranı</h2>

      {/* BUTONLAR */}
      <div>
        <button onClick={() => setPeriyot("gunluk")}>Günlük</button>
        <button onClick={() => setPeriyot("haftalik")}>Haftalık</button>
        <button onClick={() => setPeriyot("aylik")}>Aylık</button>
      </div>

      {/* ÖZET */}
      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Özet</h3>
          <p>Toplam Ciro: {rapor.toplamCiro}</p>
          <p>Sipariş Sayısı: {rapor.siparisSayisi}</p>
          <p>Ortalama Tutar: {rapor.ortalamaTutar}</p>
        </div>
      )}

      {/* EN ÇOK SATANLAR */}
      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>En Çok Satan Ürünler</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Ürün</th>
                <th>Adet</th>
              </tr>
            </thead>
            <tbody>
              {rapor.enCokSatanlar.map((urun, index) => (
                <tr key={index}>
                  <td>{urun.ad}</td>
                  <td>{urun.adet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PERSONEL */}
      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Personel Performansı</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Personel</th>
                <th>Sipariş</th>
              </tr>
            </thead>
            <tbody>
              {rapor.personel.map((p, index) => (
                <tr key={index}>
                  <td>{p.ad}</td>
                  <td>{p.siparis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BUTONLAR */}
      <div style={{ marginTop: "20px" }}>
        <button>PDF İndir</button>
        <button>Excel İndir</button>
      </div>
    </div>
  );
};

export default RaporEkrani;