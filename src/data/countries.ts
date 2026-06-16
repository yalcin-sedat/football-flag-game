// Grup A ülkeleri: tanınır büyük ülkeler, Seviye 1 için
export type Country = {
  code: string;   // ISO 3166-1 alpha-2 — hem flag hem map dosya adı
  name: string;   // Türkçe ad
  color: string;  // Sembol/tema rengi (harita tint + dilim arka planı)
};

export const GROUP_A_COUNTRIES: Country[] = [
  { code: 'tr', name: 'Türkiye',   color: '#E30A17' },
  { code: 'de', name: 'Almanya',   color: '#FFCE00' },
  { code: 'fr', name: 'Fransa',    color: '#0055A4' },
  { code: 'br', name: 'Brezilya',  color: '#009C3B' },
  { code: 'mx', name: 'Meksika',   color: '#006847' },
  { code: 'us', name: 'ABD',       color: '#3C3B6E' },
  { code: 'jp', name: 'Japonya',   color: '#BC002D' },
  { code: 'it', name: 'İtalya',    color: '#009246' },
];

// Aşama 1'de 4 dilimli çark için ilk 4 ülke
export const LEVEL_1_COUNTRIES = GROUP_A_COUNTRIES.slice(0, 4);
