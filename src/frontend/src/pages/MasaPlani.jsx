import React, { useState, useEffect } from "react"; // useEffect eklendi
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // axios eklendi

const durumRengi = {
  boş: "#2f7d5c",
  dolu: "#b84d4d",
  rezerveli: "#d7b66f",
  temizleniyor: "#6f7b52",
};

const MasaPlani = () => {
  const navigate = useNavigate();
  // Başlangıçta boş dizi, veriler Yusuf'tan gelecek
  const [masalar, setMasalar] = useState([]); 
  const token = localStorage.getItem('token');

  // 2. ADIM: Yusuf'un backend'inden masaları çekme
  useEffect(() => {
    const masalariGetir = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tables', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMasalar(response.data);
      } catch (err) {
        console.error("Masa verileri çekilemedi, statik veriler gösteriliyor.");
        // Hata durumunda sistemin çökmemesi için senin verileri yedek olarak kullanabiliriz
      }
    };
    if (token) masalariGetir();
  }, [token]);

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <p className="eyebrow">Salon görünümü</p>
          <h1>Masa Planı</h1>
          <p>Anlık masa durumlarını görün, sipariş akışına doğrudan geçin.</p>
        </div>
      </section>

      <section className="cards-grid">
        {masalar.map((masa) => (
          <article
            key={masa.id}
            className="table-card"
            // Backend'den gelen durum "available" ise "boş", "occupied" ise "dolu" olarak eşleşmeli
            style={{ borderTop: `8px solid ${durumRengi[masa.durum] || '#ccc'}` }}
            // Tıklandığında o masanın ID'si ile ödeme veya sipariş ekranına gider
            onClick={() => navigate(`/odeme/${masa.id}`)} 
          >
            <p className="eyebrow" style={{ color: "rgba(255,255,255,0.65)" }}>{masa.no}</p>
            <h3>{masa.kapasite} kişilik</h3>
            <p style={{ color: "rgba(255,255,255,0.76)" }}>
              Sipariş ve ödeme işlemleri için dokunun.
            </p>
            <div className="table-card__status">
              <span className="pill" style={{ background: "rgba(255,255,255,0.16)", color: "white" }}>
                {masa.durum}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default MasaPlani;