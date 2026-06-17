# ROADMAP.md — Yeni Oyun Yönü Geliştirme Planı

> Yeni yön: bayrak-harita eşleştirme oyunu yerine, Twisty Arrow / Knife Hit ailesinden ilham alan **dönen hedefe pin saplama** arcade oyunu.
> Her görev sonrası `npx tsc --noEmit` ile tip kontrolü yap. Oyun davranışı değiştiğinde `npx expo start -c` ile oynanabilirliği kontrol et.

## Aşama 0 — Doküman ve Karar Kilidi

- [x] Twisty Arrow araştırma raporu incelendi.
- [x] Yeni yön kararı: tek dokunuşlu dönen hedef + pin/ok saplama.
- [x] PRD, mimari ve roadmap yeni mekaniğe göre güncellendi.

## Aşama 1 — Çekirdek Mekanik Pivotu

- [x] Eski eşleştirme mantığını oyun çekirdeğinden çıkar.
- [x] `src/utils/gameLogic.ts` içine pin açısı ve çarpışma fonksiyonları ekle:
  - `normalizeAngle`
  - `getImpactAngle`
  - `willCollideWithPins`
  - `addPin`
  - `isLevelComplete`
- [x] `src/data/levels.ts` yapısını yeni parametrelere çevir:
  - `requiredPins`
  - `rotationDuration`
  - `direction`
  - `collisionToleranceDeg`
  - `initialPins`
  - `speedPattern`
- [x] `GameScreen.tsx` state'ini yeni oyuna göre değiştir:
  - current level
  - placed pin açıları
  - remaining pins
  - score / streak
  - fail / level complete
- [x] Tap ile pin fırlatma animasyonu.
- [x] Pin hedefe saplanınca hedefle birlikte dönmeye devam etmeli.
- [x] Çarpışma olursa fail/game over.
- [x] Gerekli pin sayısı tamamlanınca level geçişi.
- [ ] Doğrulama: telefonda oynanabilirlik, çarpışma hissi ve restart temposu test edilecek.

## Aşama 2 — Yeni Görsel Sistem

- [ ] `Wheel.tsx` veya yeni `Target.tsx`: ülke dilimleri yerine sade dönen hedef diski.
- [ ] Yeni `Pin.tsx` / `Arrow.tsx`: alttan fırlayan ve saplandıktan sonra hedefle dönen pin.
- [ ] Saplanmış pinlerin hedef çevresinde doğru açıyla render edilmesi.
- [ ] Kalan pin sayısı için sade dikey/alt sayaç.
- [ ] HUD sadeleştirme: level, remaining pins, streak/score.
- [ ] Eski bayrak topu ve harita görsellerini ana oyun ekranından kaldır veya skin/theme katmanına taşı.
- [ ] Başarı efekti: küçük spark/glow.
- [ ] Fail efekti: kırmızı flash + shake.
- [ ] Doğrulama: küçük telefon ekranında pinler ve hedef net okunuyor.

## Aşama 3 — Level Paketi ve Zorluk Eğrisi

- [ ] 30-50 level tanımı oluştur.
- [ ] İlk 5 level: tutorial'sız öğretim, düşük hız, geniş tolerans.
- [ ] 6-15: daha çok pin, daha hızlı dönüş.
- [ ] 16-25: hazır engel pinleri.
- [ ] 26-35: yön değişimi veya dur-kalk ritmi.
- [ ] 36+: dar tolerans ve karışık hız pattern'leri.
- [ ] Level complete banner'ı yeni oyuna göre güncelle.
- [ ] Local progress: en yüksek açılan level, best streak.

## Aşama 4 — Menü ve Meta Uyumlama

- [ ] HomeScreen marka metinlerini yeni oyun kimliğine göre sadeleştir.
- [ ] "Toplar" koleksiyonunu "Pinler" veya "Temalar" olarak değiştir.
- [ ] Coin/gem alanı kalacaksa skin ekonomisine bağlanacak şekilde adlandır.
- [ ] GameOver ekranını level/streak odaklı yap.
- [ ] Ayarlar ekranı: ses/haptic aç-kapa.
- [ ] Günlük görev fikri: "12 pin sapla", "3 level üst üste geç", "tek can challenge".

## Aşama 5 — Ses, Haptic ve Cila

- [ ] Pin fırlatma sesi.
- [ ] Saplanma sesi.
- [ ] Çarpışma/fail sesi.
- [ ] Level complete sesi.
- [ ] Haptic: tap hafif, saplanma medium, fail error.
- [ ] Restart akışını 1 saniyeden kısa hissettirecek animasyon temposu.
- [ ] Arka plan müziği varsa ayardan kapanmalı ve cihaz müziğiyle çakışmamalı.

## Aşama 6 — Leaderboard ve Veri

- [ ] Local storage alanları:
  - highestLevel
  - bestStreak
  - totalPins
  - noAdsPurchased ileride
- [ ] Supabase leaderboard:
  - top level
  - best streak
  - total score
- [ ] Kullanıcı adı veya anonim oyuncu adı.

## Aşama 7 — Para ve Yayın

- [ ] AdMob interstitial: agresif olmayan frekans.
- [ ] Rewarded ad: ikinci şans veya streak koruma.
- [ ] Reklamsız sürüm IAP tasarımı.
- [ ] Yeni app icon: dönen hedef + bayrak pin.
- [ ] Splash ve store ekran görüntüleri yeni mekanikle uyumlu.
- [ ] Gizlilik politikası.
- [ ] EAS test build.

## Notlar

- Yeni oyunda ana risk mekanik değil, his: çarpışma toleransı, animasyon temposu ve restart sürtünmesi.
- Twisty Arrow birebir kopyalanmaz; "tek dokunuş timing arcade" türünden ders alınır.
- Eski bayrak/harita asset'leri tamamen çöpe atılmayabilir; skin, tema, hedef rozeti veya koleksiyon katmanında kullanılabilir.
