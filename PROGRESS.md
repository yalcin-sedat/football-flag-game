# PROGRESS.md — Canlı Durum Defteri

> Bu dosya agent'lar arası haberleşme defteridir. Chat geçmişi sıkışsa (compact)
> bile bilgi burada kalır. HER agent çalışmaya başlamadan ÖNCE bu dosyayı OKUR,
> işini bitirince buraya YAZAR.
>
> Kural: Her giriş kısa olsun → [TARİH] [AGENT] ne yaptı, dosya neresi, sıradaki ne.

---

## 🎯 Mevcut Aşama

**Aktif Aşama:** Aşama 2a (Görsel Cila + Ana Menü) — UI componentleri tamamlandı
**Aktif Agent(ler):** —
**Sıradaki iş:** Agent 1 — GameScreen'i Wheel/Ball/HUD/FeedbackMessage componentlerini kullanacak şekilde refactor et (prop arayüzleri aşağıda)

---

## 📌 Agent Sahiplik Haritası (kim hangi dosyaya yazar)

Çakışmayı önlemek için: bir dosyaya kural olarak TEK agent yazar.

| Alan | Sahibi Agent | Dosyalar |
|---|---|---|
| Oyun mantığı | Agent 1 (Oyun) | gameLogic.ts, GameScreen.tsx, data/levels.ts, data/countries.ts |
| Görsel/UI | Agent 2 (Tasarım) | components/*, screens/* (Game hariç), theme/*, animasyonlar |
| Backend/veri | Agent 3 (Backend) | utils/storage.ts, Supabase, data (skor) |
| Yayın/operasyon | Agent 4 (Yayın) | app.json, EAS, AdMob, ikon/splash |
| Ortak | Hepsi okur, dikkatli yazar | data/strings.ts, App.tsx |

> strings.ts ve App.tsx ortak dosyalar — değiştirmeden önce PROGRESS'e not düş.

---

## 🔄 Çalışma Kuralı (Her Agent İçin)

1. Oturum başında: bu dosyayı + CLAUDE.md + kendi rolünü (AGENTS.md) oku.
2. Sadece kendi sahip olduğun dosyalara yaz.
3. Ortak dosyaya yazacaksan, önce buraya "X dosyasına dokunuyorum" yaz.
4. İş bitince: aşağıdaki günlüğe giriş ekle + `git commit` yap.
5. Bir şey bozduysan/yarım kaldıysa: "YARIM" / "BLOKE" diye işaretle.

---

## 📖 İlerleme Günlüğü

> En yeni giriş EN ÜSTE. Format: [TARİH] [AGENT] — ne yapıldı / sıradaki / not

<!-- ÖRNEK (silinebilir):
[2026-01-15] [Agent 1 - Oyun] — gameLogic.ts'de getHitSegment ve isMatch yazıldı, test edildi çalışıyor. Sıradaki: GameScreen'e bağlama. Not: rotation değeri JS'e useEffect+interval ile okunuyor.
-->

[2026-06-16] [Codex] — Proje dosyalama iskeleti standartlaştırıldı.
- Eklendi: `README.md` (doğru proje kökü, komutlar, klasör yapısı).
- Eklendi: `src/components/`, `src/theme/`, `assets/flags/`, `assets/maps/`, `assets/sounds/` için `.gitkeep`.
- Kod davranışına dokunulmadı.
- Kullanıcı onayıyla üst klasördeki kopya dokümanlar `_archive/root-doc-copies/` içine taşındı.

[2026-06-16] [Codex] — Proje hafızası `flag-striker` deposuna bağlandı.
- `AGENTS.md` ve `CLAUDE.md` uygulama deposunda güncellendi; Codex/Claude oturumları artık aynı rol ve proje kurallarını okuyabilir.
- `PROGRESS.md`, `PRD.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `SETUP.md` uygulama deposuna eklendi.
- Mevcut kod ve paket dosyalarına dokunulmadı.
- Sıradaki: Agent 2 — Tasarım/UI.

[2026-06-16] [Agent 2 - Tasarım] — Aşama 2a görsel componentler + ekranlar tamamlandı.
- Oluşturulan: src/theme/colors.ts (neon arcade paleti)
- Oluşturulan: src/components/Wheel.tsx (SVG dilimler + Reanimated, rotation SharedValue parent'tan alır)
- Oluşturulan: src/components/Ball.tsx (bayrak top, glare efekti, ballY SharedValue parent'tan alır)
- Oluşturulan: src/components/HUD.tsx (puan scale animasyonu, kalp göstergesi, kombo)
- Oluşturulan: src/components/FeedbackMessage.tsx (fade-in→bekle→fade-out, oyunu durdurmaz)
- Oluşturulan: src/screens/HomeScreen.tsx (neon arcade menü, SVG stadyum arka planı)
- Oluşturulan: src/screens/GameOverScreen.tsx (sıralı giriş animasyonları, skor kartı)
- Güncellenen: src/data/strings.ts (menü metinleri eklendi — ortak dosya, not bırakıldı)
- Güncellenen: App.tsx (home → game → gameover navigasyonu — ortak dosya, not bırakıldı)
- tsc --noEmit: 0 hata ✅
- Sıradaki: Agent 1 — GameScreen'i aşağıdaki prop arayüzlerine göre refactor etsin

### Agent 1 İçin Prop Arayüzleri (GameScreen refactor):
```
<Wheel countries={wheelCountries} rotation={wheelRotation} radius={WHEEL_RADIUS}
       style={styles.wheelContainer} />
<Ball  country={ballCountry} ballY={ballY} restY={BALL_Y_REST}
       style={styles.ball} />
<HUD   score={gameState.score} lives={gameState.lives} combo={gameState.combo} />
<FeedbackMessage result={feedback} />   // feedback: { type, countryName }
```
- Wheel/Ball SharedValue'larını GameScreen yönetmeye devam eder (rotation, ballY).
- FeedbackMessage her zaman render'lanmalı (mount'lu kalmalı, opacity ile gizlenir).

[2026-06-16] [Agent 1 - Oyun] — Aşama 1 oyun mantığı tamamlandı.
- Oluşturulan: src/data/strings.ts, src/data/countries.ts (Grup A, 8 ülke)
- Oluşturulan: src/utils/gameLogic.ts (getHitSegment, isMatch, nextBallTarget, updateScore — saf fonksiyonlar)
- Oluşturulan: src/screens/GameScreen.tsx (çark dönüşü Reanimated, tap-to-launch, çarpışma/açı hesabı, skor/can state, game over)
- Güncellenen: App.tsx (game → gameover akışı)
- Asset'ler (flags/, maps/) henüz boş; GameScreen şimdilik ISO kodu + ülke rengiyle placeholder çalışıyor.
- Prop arayüzü: GameScreen props = { onGameOver: (score: number) => void }
- Sıradaki: Agent 2 — Wheel/Ball/HUD component'leri, PNG asset entegrasyonu, animasyon juice

---

## ⚠️ Açık Sorunlar / Bloke İşler

(Çözülmemiş hatalar, bekleyen kararlar buraya. Boşsa "yok" yaz.)

- yok

---

## ✅ Tamamlanan Aşamalar

- [x] Aşama 0 — Kurulum + asset (Expo + Reanimated 4 + SVG kurulu; asset'ler boş)
- [x] Aşama 1 — Çekirdek mekanik (oyun mantığı Agent 1 tarafından tamamlandı)
- [x] Aşama 2a — Görsel + menü (UI componentleri Agent 2 tarafından tamamlandı; GameScreen refactor bekliyor)
- [ ] Aşama 2b — Juice + ses
- [ ] Aşama 2c — Level + combo
- [ ] Aşama 3 — Leaderboard + kullanıcı
- [ ] Aşama 4 — Cila
- [ ] Aşama 5 — Para + yayın
