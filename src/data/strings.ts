// All UI strings — single source for future i18n
// [2026-06-17] Agent 2: converted all strings from Turkish to English
export const strings = {
  // In-game
  dogruIsabet:  'Perfect Hit!',
  bayrakBilgisi: (ulkeAdi: string) => `This flag belongs to ${ulkeAdi}.`,
  yanlisBayrak: 'Wrong Flag!',
  pinSaplandi:  'Pin Stuck!',
  carpisma:     'Collision!',
  kalanPin:     'Pins Left',
  puan:         'Score',
  can:          'Lives',
  seviye:       'Level',
  yaniyorsun:   'On Fire! 🔥',
  combo:        (n: number) => `${n} Combo!`,
  tapToThrow:   'Tap to throw!',

  // Navigation / general
  tekrarOyna:   'Play Again',
  oyunBitti:    'GAME OVER',
  anaMenue:     'Main Menu',
  finalSkor:    'Final Score',

  // Level
  levelAtladi:  (n: number) => `LEVEL ${n}`,
  levelLabel:   (n: number) => `LEVEL ${n}`,
  levelLabelPrefix: 'LEVEL',
  carkHizlandi: 'Speed up!',
  yeniRekor:    'NEW RECORD!',
  enYuksek:     (n: number) => `Best: ${n}`,

  // Home menu
  oyna:         'PLAY',
  gunlukGorev:  'Daily Quest',
  siralama:     'Leaderboard',
  karakterler:  'Pins',
  ayarlar:      'Settings',
  yakinda:      'Coming soon.',
  toplar:       'PINS',
  brandKicker:  'WORLD FLAG',
  brandTitle:   'STRIKER',
  worldArena:   'WORLD ARENA',
  rankStriker:  'STRIKER',
};
