// Oyun mantığı — saf fonksiyonlar, test edilebilir, state tutmaz
import { Country } from '../data/countries';

export type GameState = {
  score: number;
  lives: number;
  combo: number;
};

// Çarkın o anki rotation açısından hangi dilime vurulduğunu hesaplar.
// rotation: derece (0–360 arası, saat yönü pozitif).
// Top aşağıdan gelip çarkın ALTINA (180°) çarpar.
// Çark R derece döndüğünde, altta duran orijinal dilim açısı = (180 - R).
export function getHitSegment(rotation: number, segmentCount: number): number {
  const normalized    = ((rotation % 360) + 360) % 360;
  const segmentAngle  = 360 / segmentCount;
  // Top çarkın altına (180°) çarpar; orijinal dilim açısını bul
  const hitAngle = ((180 - normalized) % 360 + 360) % 360;
  return Math.floor(hitAngle / segmentAngle) % segmentCount;
}

// Topun bayrağı (ballCode) çarktaki vurulan dilimin ülkesiyle eşleşiyor mu?
export function isMatch(hitCountryCode: string, ballCountryCode: string): boolean {
  return hitCountryCode === ballCountryCode;
}

// Mevcut hedef dışında rastgele yeni bir hedef ülke seçer
export function nextBallTarget(countries: Country[], currentCode: string): Country {
  const others = countries.filter((c) => c.code !== currentCode);
  return others[Math.floor(Math.random() * others.length)];
}

// Doğru/yanlış sonuca göre skor, combo ve can günceller
export function updateScore(state: GameState, matched: boolean): GameState {
  if (matched) {
    const newCombo = state.combo + 1;
    // 3 kombo: +2 bonus; normal: +1
    const bonus = newCombo >= 3 ? 2 : 1;
    return {
      score: state.score + bonus,
      lives: state.lives,
      combo: newCombo,
    };
  } else {
    // Yanlış: can -1, combo sıfırla
    return {
      score: state.score,
      lives: state.lives - 1,
      combo: 0,
    };
  }
}
