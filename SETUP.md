# SETUP.md — Sıfırdan Kurulum

> Adımları sırayla uygula. Reanimated 4 kurulumu kritik — atlanırsa
> "Exception in HostFunction" hatası alınır.

## 1. Proje Oluştur

```bash
npx create-expo-app@latest flag-striker -t expo-template-blank-typescript
cd flag-striker
```

## 2. Çekirdek Kütüphaneler

ÖNEMLİ: `npm install` DEĞİL, `npx expo install` (Expo uyumlu sürümleri seçer).

```bash
# Animasyon (Reanimated 4 + ZORUNLU worklets)
npx expo install react-native-reanimated react-native-worklets

# Dokunma
npx expo install react-native-gesture-handler

# Vektör çizim (çark, glow, arka plan)
npx expo install react-native-svg

# Kalıcı veri
npx expo install @react-native-async-storage/async-storage
```

## 3. Babel Yapılandırması (KRİTİK)

`babel.config.js` — Reanimated 4'te plugin **react-native-worklets/plugin**
(eski `react-native-reanimated/plugin` DEĞİL). EN SONDA olmalı.

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-worklets/plugin'],
  };
};
```

## 4. Gesture Handler

`App.tsx`'in EN ÜSTÜNE:
```ts
import 'react-native-gesture-handler';
```
Kök component'i sar:
```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* içerik */}
    </GestureHandlerRootView>
  );
}
```

## 5. Görsel Asset'leri İndir

### Bayraklar (PNG, ISO kodlu)
- **Flagpedia:** https://flagpedia.net/download/icons — tüm ülkeler tek paket.
- veya **FamFamFam Flag Icons** — atıfsız, serbest, ISO kodlu (tr.png, de.png...).
- İndir → `assets/flags/` klasörüne koy.

### Haritalar (PNG silüet, ISO kodlu)
- **mapsicon (GitHub):** https://github.com/djaiss/mapsicon
- Siyah silüet, ISO kodlu, hafif (~12 KB). İstediğin boyutu seç.
- İndir → `assets/maps/` klasörüne koy.
- Not: Siyah silüet kodda `tintColor` ile renklendirilir; ayrı renkli dosya gerekmez.

### LİSANS KONTROLÜ (ZORUNLU)
Her iki setin de lisansını doğrula: "ticari kullanım" + "atıf gerekmez".
- Bayraklar zaten kamuya açık; ikon tasarım lisansına bak.
- mapsicon → repo'daki LICENSE dosyasını oku.

## 6. Çalıştır (cache temizleyerek)

Babel değişikliğinden sonra MUTLAKA `-c`:
```bash
npx expo start -c
```
Telefonda Expo Go ile QR tara, veya `i` / `a`.

## 7. Git (Önemli)

```bash
git init
git add .
git commit -m "İlk kurulum: Expo + Reanimated + SVG + asset"
```
Her aşama bitince:
```bash
git add .
git commit -m "Aşama X tamamlandı: <açıklama>"
```

## Sık Karşılaşılan Hatalar

| Hata | Çözüm |
|---|---|
| `Exception in HostFunction: <unknown>` | Babel plugin `react-native-worklets/plugin` mi? `npx expo start -c` |
| `Cannot find module 'babel-preset-expo'` | `npx expo install babel-preset-expo` |
| `Project is incompatible with this version of Expo Go` | Expo Go'yu güncelle veya iOS Simulator kullan |
| Beyaz ekran / "App entry not found" | Terminaldeki kırmızı hatayı oku (import/syntax) |
| PNG görünmüyor | `require()` yolu doğru mu? Dinamik yol için asset map objesi kullan |
| Paket sürüm uyarısı | `npx expo install --fix` |

## Doğrulama
```bash
npx expo install --fix
npx tsc --noEmit
```
