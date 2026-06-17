# ARCHITECTURE.md — Dosya Yapısı ve Mimari

## Genel Yaklaşım

Flag Striker artık tek dokunuşlu **dönen hedefe pin saplama** arcade oyunudur. Mimari, hedef rotasyonu, pin açıları, çarpışma toleransı ve level ilerlemesi etrafında kurulmalıdır.

- Tek yönlü veri akışı: state ekran component'inde, prop ile iner, olaylar callback ile çıkar.
- Oyun mantığı saf fonksiyonlarda tutulur; animasyon ve render component'lerde kalır.
- Eski bayrak-harita eşleştirme kodu aşamalı olarak pin/çarpışma mantığıyla değiştirilecek.

## Hedef Klasör Yapısı

```text
App.tsx                      # Navigasyon / ekran yönlendirme
assets/
  flags/                     # Skin/tema için bayrak PNG'leri
  maps/                      # Opsiyonel hedef rozeti/tema için harita PNG'leri
  sounds/                    # Ses efektleri (CC0)
  backgrounds/               # Opsiyonel atmosfer görselleri
src/
  data/
    countries.ts             # Tema/skin verisi için ülke renkleri ve kodları
    levels.ts                # Pin saplama level tanımları
    strings.ts               # Tüm Türkçe UI metinleri
  components/
    icons/                   # react-native-svg ikonları
    Target.tsx               # Yeni dönen hedef diski (ileride Wheel yerine geçebilir)
    Wheel.tsx                # Mevcut dönen çark; pivot sırasında Target rolüne evrilecek
    Pin.tsx                  # Tek pin/ok render'ı
    Ball.tsx                 # Eski top component'i; pivot sonrası kaldırılabilir veya skin'e dönüşebilir
    HUD.tsx                  # Level, kalan pin, skor/streak
    FeedbackMessage.tsx      # Fail / başarı mesajları
    ScreenFlash.tsx          # Kısa ekran flaşları
    LevelUpBanner.tsx        # Level complete geçişi
  screens/
    HomeScreen.tsx
    GameScreen.tsx           # Çekirdek oyun state'i ve animasyon orkestrasyonu
    GameOverScreen.tsx
    LeaderboardScreen.tsx
    SettingsScreen.tsx
  utils/
    gameLogic.ts             # Açı, pin çarpışması, level tamamlanma — saf fonksiyonlar
    storage.ts               # Local progress/high score
  theme/
    colors.ts
```

## Yeni Level Veri Modeli (`levels.ts`)

```ts
export type RotationDirection = 'clockwise' | 'counterClockwise';
export type SpeedPattern = 'constant' | 'accelerating' | 'stopAndGo' | 'switchDirection';

export type LevelConfig = {
  id: number;
  requiredPins: number;
  rotationDuration: number;
  direction: RotationDirection;
  collisionToleranceDeg: number;
  initialPins: number[];
  speedPattern: SpeedPattern;
};
```

- `requiredPins`: level bitirmek için saplanacak pin sayısı.
- `rotationDuration`: tam dönüş süresi; küçük değer daha hızlı oyun demektir.
- `collisionToleranceDeg`: yeni pinin mevcut pine ne kadar yaklaşınca çarpışacağı.
- `initialPins`: level başında hedefte hazır duran engel pin açıları.
- `speedPattern`: ileride hız/yön davranışını belirler.

## Oyun State Modeli

```ts
type GameState = {
  score: number;
  streak: number;
  currentLevelId: number;
  placedPins: number[];
  remainingPins: number;
  status: 'playing' | 'launching' | 'levelComplete' | 'failed';
};
```

- `placedPins`, hedefin lokal açılarında tutulur.
- Hedef döndükçe pinler görsel olarak hedefle birlikte döner.
- Yeni pinin hedefe saplandığı lokal açı, anlık rotation'dan hesaplanır.

## `gameLogic.ts` Saf Fonksiyonları

Yeni çekirdek için hedef fonksiyonlar:

```ts
normalizeAngle(angle: number): number
getImpactAngle(rotation: number): number
angleDistance(a: number, b: number): number
willCollideWithPins(impactAngle: number, placedPins: number[], toleranceDeg: number): boolean
addPin(placedPins: number[], impactAngle: number): number[]
isLevelComplete(placedPins: number[], requiredPins: number): boolean
```

Geçiş döneminde eski fonksiyonlar durabilir, fakat yeni oyun kodu bunlara taşınmalıdır:

- Eski: `getHitSegment`, `isMatch`, `nextBallTarget`, `updateScore`
- Yeni: pin açısı, çarpışma, level completion

## Component Görevleri

### `Target.tsx` / `Wheel.tsx`

- Merkezde dönen hedefi çizer.
- Reanimated `rotation` shared value ile döner.
- Üzerinde saplanmış pinleri, hedef lokal açılarına göre render eder.
- Hedef okunabilir, sade ve yüksek kontrastlı olmalıdır.

### `Pin.tsx`

- Tek pin/ok görselini çizer.
- İki kullanım modu:
  - fırlatılacak aktif pin
  - hedefe saplanmış pin
- Bayrak renkleri veya küçük bayrak şeridi skin olarak kullanılabilir.

### `HUD.tsx`

- Level.
- Kalan pin sayısı.
- Skor veya streak.
- Gereksiz kalp/can kalabalığı MVP'de kullanılmayabilir.

### `FeedbackMessage.tsx`

- Başarı: kısa "Level Tamamlandı" / "Harika!" mesajı.
- Fail: "Çarpışma!" / "Tekrar dene" mesajı.
- Mesaj oyunu yavaşlatmamalı.

### `ScreenFlash.tsx`

- Fail için kırmızı flash.
- Level complete için altın/cyan flash.

## Veri Akışı

```text
GameScreen
  state: level, placedPins, remainingPins, score, streak, status
  shared: targetRotation, activePinY, shakeX

tap
  → active pin launch animation
  → impact moment reads targetRotation
  → gameLogic.getImpactAngle(rotation)
  → gameLogic.willCollideWithPins(...)
    → collide: status = failed, flash/shake/sound
    → safe: addPin, remainingPins--, hit feedback
       → if complete: levelComplete
       → else: next pin ready
```

## Animasyon Sorumlulukları

| Animasyon | Nerede |
|---|---|
| Hedef dönüşü | GameScreen shared value + Target/Wheel render |
| Aktif pin fırlatma | GameScreen veya Pin |
| Saplanmış pinlerin hedefle dönmesi | Target/Wheel |
| Çarpışma shake | GameScreen |
| Fail / success flash | ScreenFlash |
| Level complete banner | LevelUpBanner |

## Asset Kuralları

- UI ikonları kod + `react-native-svg` ile çizilir.
- Bayrak PNG'leri ana mekanik için zorunlu değildir; pin skinleri ve tema paketleri için kullanılabilir.
- Harita PNG'leri ana mekanik için zorunlu değildir; hedef rozeti/tema olarak kullanılabilir.
- Ses efektleri CC0 veya ticari kullanıma uygun olmalıdır.
- Referans oyunlardan ikon, hedef şekli, isim veya mağaza görseli kopyalanmaz.

## State ve Kalıcılık

- Aşama 1-3: `useState`, `useRef`, Reanimated shared value.
- Local storage:
  - highestLevel
  - bestStreak
  - totalPins
  - soundEnabled
  - hapticsEnabled
- Supabase sadece leaderboard aşamasında eklenir.
