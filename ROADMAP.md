# ROADMAP.md — Hızlandırılmış Geliştirme Planı (2-3 Hafta)

> Claude Code: Görevleri SIRAYLA yap. Bir aşama bitmeden sonrakine geçme.
> Her görev sonrası `npx expo start -c` ile oyunun çalıştığını doğrula.
> Tamamlananları [x] ile işaretle.

## HAFTA 1 — Çekirdek Oyun + Görsel İskelet

### Aşama 0: Kurulum + Asset (Gün 1)
- [ ] `SETUP.md`'deki kurulumu uygula (Expo + Reanimated 4 + worklets + SVG + Gesture Handler)
- [ ] Bayrak PNG'lerini indir (Flagpedia/FamFamFam) → `assets/flags/` (ISO kodlu)
- [ ] Harita PNG'lerini indir (mapsicon GitHub) → `assets/maps/` (ISO kodlu)
- [ ] Her iki setin LICENSE'ını doğrula (ticari + atıfsız)

### Aşama 1: Çalışan Çekirdek Mekanik (Gün 2-4)
- [ ] `src/data/strings.ts` — tüm Türkçe metinler
- [ ] `src/data/countries.ts` — Grup A ülkeleri (kod, ad, renk)
- [ ] Asset map'leri (flagImages[code], mapImages[code])
- [ ] Dönen çark: 4 dilim, her dilimde tint'li harita PNG, yavaş döner (SVG + Reanimated)
- [ ] Bayrak desenli top (alt orta, sabit)
- [ ] Tap ile fırlatma animasyonu
- [ ] Çarpışma/açı hesabı + eşleştirme kontrolü (gameLogic.ts)
- [ ] Doğru/yanlış geri bildirim mesajı (akışı durdurmadan, glow/flash)
- [ ] Puan + can güncelleme, yeni hedef bayrak üretme
- [ ] Game Over ekranı (Tekrar Oyna)
- [ ] **Doğrulama:** Telefonda oynanabilir, eşleştirme doğru çalışıyor, akış durmuyor

### Aşama 2a: Görsel Cila + Ana Menü (Gün 5-7)
- [ ] `theme/colors.ts` — neon paleti
- [ ] Ana menü (Oyna, Günlük Görev, Sıralama, Karakterler, Ayarlar)
- [ ] Stadyum arka planı (gradient, saha çizgileri, tribün — SVG)
- [ ] Ekran navigasyonu
- [ ] Component'lere bölme (Wheel, Ball, HUD, FeedbackMessage)
- [ ] **Doğrulama:** Menü → oyun → Game Over → Menü akışı çalışıyor

## HAFTA 2 — Oyun Derinliği + His

### Aşama 2b: His ("Juice") + Ses (Gün 8-10)
- [ ] Doğru glow + parıltı, yanlış kırmızı flash + ekran shake
- [ ] Skor scale, kalp shake animasyonları
- [ ] Ses efektleri (tap, fırlatma, doğru, yanlış, game over) — CC0
- [ ] Ayarlar ekranı (ses aç/kapa)
- [ ] **Doğrulama:** Oyun tatmin edici ve akıcı

### Aşama 2c: Seviye Sistemi + Combo (Gün 11-13)
- [ ] `src/data/levels.ts` — Seviye 1-4 (dilim sayısı, hız, yön, ülke seti)
- [ ] Seviye geçişi + Grup yapısı
- [ ] Combo sistemi (3→+2, 5→glow, 10→"Yanıyorsun!")
- [ ] Level sonu yıldız + bayrak-ülke özet kartı (opsiyonel öğrenme pekiştirme)
- [ ] Yüksek skor local storage
- [ ] **Doğrulama:** Çok seviyeli, artan zorluk, tanınması zor ülkeler ileri seviyelerde

## HAFTA 3 — Sosyal + Para + Yayın

### Aşama 3: Leaderboard + Kullanıcı (Gün 14-16)
- [ ] Kullanıcı adı girme (önce local)
- [ ] Supabase kurulumu + skor tablosu
- [ ] Leaderboard ekranı (Top 10, kendi sıran, rozetler, filtreler)
- [ ] Skoru gönderme
- [ ] **Doğrulama:** Skor kaydediliyor ve sıralamada görünüyor

### Aşama 4: Cila (Gün 17-18) — zaman kalırsa
- [ ] Top/çark temaları (skin)
- [ ] Günlük görev
- [ ] Particle efektleri

### Aşama 5: Para + Yayın (Gün 19-21)
- [ ] AdMob (geçişli + ödüllü)
- [ ] App ikonu (1024×1024) + splash
- [ ] Gizlilik politikası (basit web sayfası)
- [ ] EAS Build test build
- [ ] Store hesapları (Apple 99$, Google 25$)
- [ ] Store görselleri + Türkçe açıklama
- [ ] **Doğrulama:** Mağazaya yüklenebilir build hazır

## Notlar
- 2-3 hafta agresif. Aşama 0-3 gerçekçi; 4-5 (özellikle store onayları) taşabilir — normal.
- Her aşama sonunda Git commit (bkz. SETUP.md).
- Harita tanınmazsa o ülkeyi daha tanınır biriyle değiştir.
- Takılırsan: çalışan son haline dön, küçük adımla ilerle.
