import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';

const OdemeEkrani = () => {
    const { id } = useParams(); // URL'deki ID'yi yakalıyoruz (Örn: /odeme/3)
    const [siparis, setSiparis] = useState({ toplam_tutar: 0, urunler: [] });
    const [kisiSayisi, setKisiSayisi] = useState(1);
    const [yukleniyor, setYukleniyor] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const siparisDetayGetir = async () => {
            try {
                // Dinamik ID kullanımı:
                const response = await axios.get(`http://localhost:3001/api/orders/masa/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSiparis(response.data);
            } catch (err) {
                console.error("Sipariş verileri alınamadı.");
            }
        };
        if (token && id) siparisDetayGetir();
    }, [token, id]);

    const odemeYap = async (yontem) => {
        if (yukleniyor) return;
        setYukleniyor(true);
        try {
            // Ödeme kaydında dinamik ID:
            await axios.post('http://localhost:3001/api/payments', {
                masa_id: id, 
                odeme_yontemi: yontem,
                tutar: siparis.toplam_tutar
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Masa kapatmada dinamik ID:
            await axios.patch(`http://localhost:3001/api/tables/${id}`, 
                { durum: 'empty' }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Ödeme başarılı, masa kapatıldı.");
            window.location.href = "/masalar";
        } catch (err) {
            alert("Hata oluştu!");
        } finally {
            setYukleniyor(false);
        }
    };

    return (
    <div className="page-stack">
      <article className="surface-card">
        {/* Üst Kısım: Tutar Göstergesi */}
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>Ödenecek Toplam</p>
          <h2 style={{ fontSize: '2.8rem', color: '#ffd700', fontWeight: '800' }}>
            {siparis.toplam_tutar} ₺
          </h2>
        </div>

        {/* Ayırıcı Çizgi */}
        <hr style={{ 
          border: '0', 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          marginBottom: '25px' 
        }} />

        {/* Orta Kısım: Ödeme Yöntemleri */}
        <h3 className="section-title" style={{ marginBottom: '15px' }}>Ödeme Yöntemi Seçin</h3>
        <div className="split-actions" style={{ flexDirection: 'column', gap: '12px' }}>
          
          {/* Kredi Kartı Butonu */}
          <button 
            className="action-button w-full" 
            onClick={() => odemeYap('Kredi Kartı')}
            disabled={yukleniyor}
          >
            {yukleniyor ? "Lütfen Bekleyin..." : "💳 Kredi Kartı"}
          </button>

          {/* Nakit Butonu */}
          <button 
            className="action-button w-full" 
            onClick={() => odemeYap('Nakit')}
            disabled={yukleniyor}
          >
            {yukleniyor ? "İşlem Yapılıyor..." : "💵 Nakit Ödeme"}
          </button>

          {/* Mobil Ödeme Butonu */}
          <button 
            className="ghost-button w-full" 
            onClick={() => odemeYap('Mobil')}
            disabled={yukleniyor}
          >
            {yukleniyor ? "Bağlanıyor..." : "📱 Mobil Ödeme"}
          </button>

        </div>

        {/* Alt Bilgi: Masa Bilgisi */}
        <div style={{ marginTop: '20px', textAlign: 'center', opacity: '0.6' }}>
           <p className="eyebrow">Masa ID: {id}</p>
        </div>
      </article>
    </div>
  );
};

export default OdemeEkrani;