import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KDSEkrani = () => {
  const [siparisler, setSiparisler] = useState([]);

  useEffect(() => {
    // Siparişleri çeken fonksiyon
    const siparisleriGetir = async () => {
      try {
        const response = await axios.get('/api/orders');
        // Gelen siparişlerden 'kapali' ve 'iptal' olanları filtrele
        const aktifSiparisler = response.data.filter(
          (siparis) => siparis.durum !== 'kapali' && siparis.durum !== 'iptal'
        );
        setSiparisler(aktifSiparisler);
      } catch (error) {
        console.error('Siparişler çekilirken hata oluştu:', error);
      }
    };

    // Sayfa ilk yüklendiğinde hemen çalıştır
    siparisleriGetir();

    // Her 5 saniyede bir çalıştır
    const interval = setInterval(siparisleriGetir, 5000);

    // Bileşen kapandığında interval'i temizle
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mutfak Ekranı (KDS)</h1>
      <p>Aktif Sipariş Sayısı: {siparisler.length}</p>
      
      {/* İlerleyen aşamalarda buraya sipariş kartlarını ekleyeceğiz */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {siparisler.map((siparis) => (
          <div key={siparis.id} style={{ border: '1px solid black', padding: '10px' }}>
            <h3>Masa: {siparis.masa_no} | Sipariş: #{siparis.id}</h3>
            {/* Şimdilik sadece masa ve sipariş numarası gösteriliyor */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KDSEkrani;