# CLAUDE.md

Bu dosya Claude Code / Codex oturumları için proje talimatlarını içerir.

## Proje Özeti

**Flag Striker** — tek dokunuşla oynanan, dönen hedefe bayrak temalı pin/ok saplama üzerine kurulu mobil arcade zamanlama oyunu.

Oyuncu ekrana dokunur; alttaki pin hedefe fırlar. Pin hedefe saplanır ve hedefle birlikte dönmeye devam eder. Yeni pin, daha önce saplanan pinlere çarparsa bölüm başarısız olur. Gerekli pin sayısı tamamlanınca level geçilir.

Eski "bayrak desenli topu doğru ülke haritası dilimine fırlatma" fikri artık ana oyun değildir. Bayrak/dünya teması görsel kimlik, skin ve meta katman olarak korunabilir.

## Çekirdek Mekanik

- **Tek input:** ekrana dokun.
- **Hedef:** ortada dönen disk/rozet.
- **Pin/ok:** alttan hedefe fırlar.
- **Başarılı atış:** pin hedefe saplanır, hedefle birlikte dönmeye devam eder.
- **Fail:** yeni pin mevcut pine çok yakın açıyla saplanmaya çalışırsa çarpışma olur.
- **Level complete:** `requiredPins` kadar güvenli pin saplanır.
- **Ana his:** hızlı, net, tekrar oynatan, "az kaldı" duygusu veren arcade.

## Teknoloji Yığını

- Expo + React Native + TypeScript
- React Native Reanimated 4 + `react-native-worklets`
- React Native SVG
- React Native Gesture Handler
- AsyncStorage
- Skia kullanma; SVG + View + PNG yeterli.

## Dil Kuralı

- Tüm UI metinleri Türkçe.
- Tüm metinler `src/data/strings.ts` içinde tutulmalı.
- İngilizce/Almanca karışık UI metni yazma.

## Telif ve Klon Riski

- Twisty Arrow, Knife Hit, aa gibi oyunlardan sadece tür ve ürün dersi alınır.
- İsim, ikon, mağaza görseli, level düzeni, hedef/pin görseli birebir kopyalanmaz.
- Gerçek futbolcu, kulüp, turnuva, lisanslı logo kullanılmaz.
- Bayrak asset'leri ve diğer görseller ticari kullanıma uygun lisansla doğrulanmalıdır.

## Kod Stili Kuralları

- TypeScript; `any` kullanma.
- Oyun matematiğini saf fonksiyonlarda tut.
- Şu konularda kısa Türkçe yorum bırak:
  - hedef rotation hesabı
  - pin impact açısı
  - pin çarpışma toleransı
  - level tamamlanma
  - restart / fail akışı
- Gereksiz abstraction ekleme; önce oynanabilir çekirdek.

## Mimari Kuralı

- Oyun state'i `GameScreen.tsx` içinde yönetilebilir.
- Matematik ve kararlar `src/utils/gameLogic.ts` içinde saf fonksiyon olmalı.
- Level verisi `src/data/levels.ts`.
- Görsel hedef/pin component'leri `src/components/`.
- Yeni çekirdek eski eşleştirme fonksiyonlarına bağımlı kalmamalı.

## Çalışma Prensipleri

1. Her değişiklikten sonra oyun çalışır kalmalı.
2. `ROADMAP.md` sırasını takip et.
3. Kütüphane eklemeden önce `npx expo install` kullan.
4. Babel değişince cache temizle: `npx expo start -c`.
5. Kod değişikliği sonrası `npx tsc --noEmit` çalıştır.

## Yapma Listesi

- Backend/Supabase'i leaderboard aşamasından önce ekleme.
- Reklam/AdMob'u yayın aşamasından önce ekleme.
- Twisty Arrow adını, ikonunu veya görsel kompozisyonunu kopyalama.
- Eski bayrak-harita eşleştirme modeline yeni özellik ekleme; pivot yeni pin mekaniğine yapılacak.
- Agresif reklam frekansını ürün kararına dönüştürme.

## Önemli Komutlar

```bash
npx expo start -c
npx expo install <paket>
npx tsc --noEmit
```

## Referans Dosyalar

- `PRD.md` — ürün vizyonu
- `ARCHITECTURE.md` — dosya yapısı ve veri akışı
- `ROADMAP.md` — aşamalı görev listesi
- `PROGRESS.md` — canlı durum defteri
- `SETUP.md` — kurulum notları
