// Neon arcade renk paleti — tüm renk sabitleri buradan alınır
export const colors = {
  // Arkaplan
  background:    '#0d0d1a',
  surface:       '#1a1a2e',
  surfaceLight:  '#16213e',

  // Neon aksanlar
  neonBlue:      '#00d4ff',
  neonGreen:     '#00ff88',
  neonPurple:    '#bf5fff',
  neonGold:      '#FFD700',
  neonRed:       '#ff3355',
  neonOrange:    '#ff8c00',

  // Metin
  white:         '#ffffff',
  textMuted:     'rgba(255,255,255,0.4)',
  textDim:       'rgba(255,255,255,0.7)',

  // Çark
  wheelStroke:   '#0d0d1a',
  wheelCenter:   '#1a1a2e',

  // Geri bildirim
  correct:       'rgba(0,200,100,0.92)',
  correctBorder: 'rgba(0,255,136,0.5)',
  wrong:         'rgba(220,50,50,0.92)',
  wrongBorder:   'rgba(255,51,85,0.5)',

  // Kalpler
  heartFull:     '#ff3355',
  heartEmpty:    'rgba(255,255,255,0.2)',
} as const;
