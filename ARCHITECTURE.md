# ARCHITECTURE.md — Dosya Yapısı ve Mimari

## Genel Yaklaşım

- **Aşama 1:** Tüm oyun mantığı `App.tsx` içinde, temiz ve yorumlu.
- **Aşama 2+:** Aşağıdaki klasör yapısına kademeli geç.
- Tek yönlü veri akışı: state ekran component'inde, prop ile iner, olaylar callback ile çıkar.

## Hedef Klasör Yapısı (Aşama 2+)

```
App.tsx                      # Navigasyon / ekran yönlendirme
assets/
  flags/                     # Bayrak PNG'leri — ISO kodlu (tr.png, de.png, mx.png...)
  maps/                      # Harita PNG silüetleri — ISO kodlu (tr.png, de.png...)
  sounds/                    # Ses efektleri (CC0)
src/
  data/
    countries.ts             # Ülke verisi: kod, ad, renk, flag/map referansı
    levels.ts                # Seviye/grup tanımları
    strings.ts               # TÜM Türkçe UI metinleri (object)
  components/
    Wheel.tsx                # Dönen çark (SVG dilimler + harita PNG'leri)
    Ball.tsx                 # Bayrak desenli top + fırlatma animasyonu
    HUD.tsx                  # Puan, can, seviye göstergesi
    FeedbackMessage.tsx      # "Mükemmel İsabet! Bu bayrak X'e ait" / "Yanlış Bayrak!"
  screens/
    HomeScreen.tsx
    GameScreen.tsx           # Çekirdek oyun mantığı
    GameOverScreen.tsx
    LeaderboardScreen.tsx
    SettingsScreen.tsx
  utils/
    gameLogic.ts             # Çarpışma/açı/eşleştirme — saf fonksiyonlar
    storage.ts               # Local storage
  theme/
    colors.ts                # Neon paleti
```

## Veri Modeli (`countries.ts`)

```ts
export type Country = {
  code: string;        // ISO 3166-1 alpha-2 (örn. "tr") — hem flag hem map dosya adı
  name: string;        // Türkçe ad (örn. "Türkiye")
  color: string;       // Sembol/tema rengi (harita tint + dilim arka planı)
};
```

- Bayrak görseli: `assets/flags/${code}.png`
- Harita görseli: `assets/maps/${code}.png` (siyah silüet → `tintColor: color` ile renklendirilir)
- Aynı ISO kodu hem bayrak hem haritayı bulur → tek kaynak, temiz.

## Asset Kuralları

- **Bayraklar:** PNG, Flagpedia/FamFamFam, ISO kodlu, atıfsız/serbest.
- **Haritalar:** PNG, mapsicon (GitHub), ISO kodlu, siyah silüet. Renklendirme kodda `tintColor` ile yapılır — her ülke için ayrı renkli dosya GEREKMEZ.
- React Native'de PNG → `<Image source={require(...)} />`; SVG → `react-native-svg`.
- Dinamik `require` sınırlı olduğu için asset'ler bir map objesinde toplanır (örn. `flagImages[code]`).

## Component Görevleri

### `Wheel.tsx`
- SVG ile N dilimli daire çizer (dilim arka planı = ülke rengi).
- Her dilimin ortasına o ülkenin harita PNG'si (tint'li) yerleştirilir.
- Reanimated `useSharedValue(rotation)` ile döner; hız/yön prop'tan.
- Anlık rotation değerini collision için dışarı verir.

### `Ball.tsx`
- Alt orta sabit konum; üzerinde hedef ülkenin bayrak PNG'si.
- `launch()` → yukarı fırlar, çarpışma Y'sine ulaşınca callback, sonra geri döner.
- Yeni hedefte bayrak görseli değişir.

### `HUD.tsx`
- Puan (sol üst), Can/kalpler (sağ üst), Seviye+Grup+progress (orta üst).
- Puan scale, can azalınca kalp shake.

### `FeedbackMessage.tsx`
- Doğru: "Mükemmel İsabet! Bu bayrak {ülke}'ye ait." + glow.
- Yanlış: "Yanlış Bayrak!" + kırmızı flash.
- Kısa süre görünür, fade-out ile kaybolur. Oyunu DURDURMAZ.

### `gameLogic.ts` (saf fonksiyonlar)
- `getHitSegment(rotation, segmentCount)` → vurulan dilim index'i.
- `isMatch(hitCountryCode, ballCountryCode)` → boolean.
- `nextBallTarget(countries, current)` → yeni hedef ülke.
- `updateScore(state, isMatch)` → yeni skor/combo/can.

## Veri Akışı (Oyun Ekranı)

```
GameScreen (state: score, lives, ballCountry, wheelCountries, level, rotation)
   ├── HUD (score, lives, level)
   ├── Wheel (wheelCountries, speed; out: rotation)
   ├── Ball (ballCountry, onLaunchComplete)
   └── FeedbackMessage (lastResult)

tap → Ball.launch() → onLaunchComplete
   → gameLogic.getHitSegment(rotation) → vurulan ülke
   → isMatch(vurulanÜlke, ballCountry)
   → updateScore → setState → FeedbackMessage göster → nextBallTarget
```

## State Yönetimi
- Aşama 1-2: useState/useReducer.
- Çark rotation: Reanimated useSharedValue (JS'e okunabilir kopya → collision).
- Kalıcı: storage.ts (AsyncStorage).
- Zustand sadece çok ekranlı karmaşıklık olursa (Aşama 3+).

## Animasyon Sorumlulukları (Reanimated)

| Animasyon | Nerede |
|---|---|
| Çark dönüşü | Wheel |
| Top fırlatma + geri dönüş | Ball |
| Doğru glow / yanlış flash | FeedbackMessage / GameScreen |
| Ekran shake (yanlış) | GameScreen |
| Skor scale / kalp shake | HUD |
