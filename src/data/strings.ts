// Tüm Türkçe UI metinleri — ileride çoklu dil için tek kaynak
// [2026-06-16] Agent 2: oyna/gunlukGorev/siralama/ayarlar/anaMenue/finalSkor eklendi
export const strings = {
  // Oyun içi
  dogruIsabet:  'Mükemmel İsabet!',
  bayrakBilgisi: (ulkeAdi: string) => `Bu bayrak ${ulkeAdi}'ya ait.`,
  yanlisBayrak: 'Yanlış Bayrak!',
  puan:         'Puan',
  can:          'Can',
  seviye:       'Seviye',
  yaniyorsun:   'Yanıyorsun! 🔥',
  combo:        (n: number) => `${n} Kombo!`,

  // Navigasyon / genel
  tekrarOyna:   'Tekrar Oyna',
  oyunBitti:    'Oyun Bitti',
  anaMenue:     'Ana Menü',
  finalSkor:    'Final Skor',

  // Ana menü
  oyna:         'OYNA',
  gunlukGorev:  'Günlük Görev',
  siralama:     'Sıralama',
  karakterler:  'Karakterler',
  ayarlar:      'Ayarlar',
};
