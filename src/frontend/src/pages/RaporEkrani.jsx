import React, { useEffect, useState } from "react";
import axios from "axios";

const RaporEkrani = () => {
  const [periyot, setPeriyot] = useState("gunluk");
  const [rapor, setRapor] = useState(null);

  useEffect(() => {
    const veriGetir = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3001/api/reports?periyot=${periyot}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRapor(res.data);
      } catch (err) {
        console.log("Hata:", err);
      }
    };

    veriGetir();
  }, [periyot]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Rapor Ekrani</h2>

      <div>
        <button onClick={() => setPeriyot("gunluk")}>Gunluk</button>
        <button onClick={() => setPeriyot("haftalik")}>Haftalik</button>
        <button onClick={() => setPeriyot("aylik")}>Aylik</button>
      </div>

      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Ozet</h3>
          <p>Toplam Ciro: {rapor.toplamCiro}</p>
          <p>Siparis Sayisi: {rapor.siparisSayisi}</p>
          <p>Ortalama Tutar: {rapor.ortalamaTutar}</p>
        </div>
      )}

      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>En Cok Satan Urunler</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Urun</th>
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

      {rapor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Personel Performansi</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Personel</th>
                <th>Siparis</th>
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

      <div style={{ marginTop: "20px" }}>
        <button>PDF Indir</button>
        <button>Excel Indir</button>
      </div>
    </div>
  );
};

export default RaporEkrani;
