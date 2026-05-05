import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KDSEkrani = () => {
  const [siparisler, setSiparisler] = useState([]);
  const [suankiZaman, setSuankiZaman] = useState(Date.now());

  // API'den verileri çeken fonksiyon
  const siparisleriGetir = async () => {
    try {
      const response = await axios.get('/api/orders');
      const aktifSiparisler = response.data.filter(
        (siparis) => siparis.durum !== 'kapali' && siparis.durum !== 'iptal'
      );
      setSiparisler(aktifSiparisler);
    } catch (error) {
      console.error('Siparişler çekilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    siparisleriGetir(); // İlk yüklemede çalıştır
    
    // Her 5 saniyede bir siparişleri ve mevcut zamanı güncelle
    const interval = setInterval(() => {
      siparisleriGetir();
      setSuankiZaman(Date.now());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Siparişi hazır olarak işaretleyen fonksiyon
  const hazirIsaretle = async (id) => {
    try {
      await axios.patch(`/api/orders/${id}`, { durum: 'hazir' });
      siparisleriGetir(); // Butona basılınca anında listeyi yenile
    } catch (error) {
      console.error('Sipariş güncellenirken hata:', error);
    }
  };

  // Bekleme süresini hesaplayan fonksiyon
  const sureHesapla = (siparisZamani) => {
    const fark = suankiZaman - new Date(siparisZamani).getTime();
    return Math.floor(fark / 60000); // Milisaniyeyi dakikaya çevir
  };

  // Bekleme süresine göre kenarlık rengi belirleyen fonksiyon
  const renkBelirle = (dakika, durum) => {
    if (durum === 'hazir') return 'green';
    if (dakika > 10) return 'red';
    if (dakika >= 5) return 'orange';
    return 'black';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mutfak Ekranı (KDS)</h1>
      <p>Aktif Sipariş Sayısı: {siparisler.length}</p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {siparisler.map((siparis) => {
          const beklemeDakikasi = sureHesapla(siparis.olusturma_zamani || Date.now());
          const kenarlikRengi = renkBelirle(beklemeDakikasi, siparis.durum);

          return (
            <div key={siparis.id} style={{ border: `3px solid ${kenarlikRengi}`, padding: '15px', borderRadius: '8px', minWidth: '250px' }}>
              <h3>Masa: {siparis.masa_no} | Sipariş: #{siparis.id}</h3>
              <p>Geçen Süre: {beklemeDakikasi} dk</p>
              
              <ul>
                {siparis.kalemler && siparis.kalemler.map((kalem, index) => (
                  <li key={index}>{kalem.urun_adi} - {kalem.miktar} adet</li>
                ))}
              </ul>

              {/* Sipariş hazırsa yeşil yazı göster, değilse butonu göster */}
              {siparis.durum === 'hazir' ? (
                <h2 style={{ color: 'green', textAlign: 'center' }}>✓ HAZIR</h2>
              ) : (
                <button 
                  onClick={() => hazirIsaretle(siparis.id)} 
                  style={{ width: '100%', padding: '10px', backgroundColor: '#e0e0e0', cursor: 'pointer', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
                >
                  Hazır
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KDSEkrani;