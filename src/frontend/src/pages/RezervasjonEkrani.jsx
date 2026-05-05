import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RezervasjonEkrani = () => {
  const [masalar, setMasalar] = useState([]);
  
  const [seciliMasa, setSeciliMasa] = useState('');
  const [musteriAdi, setMusteriAdi] = useState('');
  const [kisiSayisi, setKisiSayisi] = useState('');
  const [tarihSaat, setTarihSaat] = useState('');

  const [hataMesaji, setHataMesaji] = useState('');
  const [basariMesaji, setBasariMesaji] = useState('');

  useEffect(() => {
    const masalariGetir = async () => {
      try {
        const response = await axios.get('/api/tables');
        const uygunMasalar = response.data.filter(masa => masa.durum === 'bos' || masa.durum === 'rezerveli');
        setMasalar(uygunMasalar);
      } catch (error) {
        console.error('Masalar çekilirken hata:', error);
      }
    };
    masalariGetir();
  }, []);

  const rezervasyonOlustur = async () => {
    setHataMesaji('');
    setBasariMesaji('');

    if (!seciliMasa || !musteriAdi || !kisiSayisi || !tarihSaat) {
      setHataMesaji('Lütfen tüm alanları doldurun!');
      return;
    }

    try {
      await axios.patch(`/api/tables/${seciliMasa}`, { 
        durum: 'rezerveli',
        musteri_adi: musteriAdi,
        kisi_sayisi: kisiSayisi,
        tarih_saat: tarihSaat
      });

      setBasariMesaji('Rezervasyon başarıyla oluşturuldu!');
      setSeciliMasa('');
      setMusteriAdi('');
      setKisiSayisi('');
      setTarihSaat('');

      const response = await axios.get('/api/tables');
      const uygunMasalar = response.data.filter(masa => masa.durum === 'bos' || masa.durum === 'rezerveli');
      setMasalar(uygunMasalar);

    } catch (error) {
      console.error('Rezervasyon hatası:', error);
      setHataMesaji('Rezervasyon oluşturulurken bir hata oldu.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>Rezervasyon Ekranı</h1>
      
      {/* Kırmızı hata ve yeşil başarı mesajı alanları */}
      {hataMesaji && <div style={{ color: 'red', marginBottom: '10px', fontWeight: 'bold' }}>{hataMesaji}</div>}
      {basariMesaji && <div style={{ color: 'green', marginBottom: '10px', fontWeight: 'bold' }}>{basariMesaji}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Masa Seçin:</label>
          <select value={seciliMasa} onChange={(e) => setSeciliMasa(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="">-- Masa Seçin --</option>
            {masalar.map((masa) => (
              <option key={masa.id} value={masa.id}>
                Masa {masa.masa_no} (Kapasite: {masa.kapasite}) - Durum: {masa.durum}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Müşteri Adı:</label>
          <input type="text" value={musteriAdi} onChange={(e) => setMusteriAdi(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Kişi Sayısı:</label>
          <input type="number" value={kisiSayisi} onChange={(e) => setKisiSayisi(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tarih ve Saat:</label>
          <input type="datetime-local" value={tarihSaat} onChange={(e) => setTarihSaat(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* Butona onClick özelliği verdik */}
        <button onClick={rezervasyonOlustur} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          Rezervasyon Oluştur
        </button>
        
      </div>
    </div>
  );
};

export default RezervasjonEkrani;