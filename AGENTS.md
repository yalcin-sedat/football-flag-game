# AGENTS.md — Agent Rolleri ve Çalışma Düzeni

> Bu projede iş, 4 role bölünmüştür. Her rol = ayrı bir Claude Code oturumu,
> ama HEPSİ aynı proje klasöründe ve aynı .md dosyalarını okur.
> Ortak hafıza chat'te değil DOSYALARDA yaşar (PROGRESS.md + Git).

## Temel Kurallar (Tüm Agent'lar İçin)

1. Oturum başında SIRAYLA oku: `PROGRESS.md` → `CLAUDE.md` → bu dosyadaki kendi rolün → ilgili .md bölümleri.
2. Sadece kendi sahip olduğun dosyalara yaz (bkz. PROGRESS.md sahiplik haritası).
3. İş bitince PROGRESS.md günlüğüne giriş ekle + `git commit -m "..."`.
4. AYNI ANDA iki agent'ı aynı dosyada çalıştırma (çakışma/merge conflict olur).
5. Aşama sırasına uy: önce Agent 1+2, sonra 3, en son 4.

## Hangi Agent Ne Zaman Aktif?

| Roadmap Aşaması | Aktif Agent'lar |
|---|---|
| Yeni Aşama 1 | Agent 1 (pin saplama çekirdeği) |
| Yeni Aşama 2 | Agent 2 (hedef/pin görsel sistemi) |
| Yeni Aşama 3-5 | Agent 1 + Agent 2 (level paketi, menü uyumu, juice) |
| Yeni Aşama 6 | Agent 3 (veri + leaderboard) |
| Yeni Aşama 7 | Agent 4 (reklam + yayın) |

> Agent 3 ve 4'ü erken AÇMA. Yeni pin mekaniği oynanabilir hale gelmeden backend ve reklam işine geçme.

---

## 🎮 Agent 1 — Oyun Mantığı

**Sorumluluk:** Oyunun "beyni". Dönen hedef mantığı, pin impact açısı, pin çarpışma toleransı, saplanmış pin listesi, skor/streak, level ilerleme.

**Sahip olduğu dosyalar:** `src/utils/gameLogic.ts`, `src/screens/GameScreen.tsx`, `src/data/levels.ts`, `src/data/countries.ts`

**Okuması gerekenler:** PROGRESS.md, CLAUDE.md, PRD.md (bölüm 2, 5, 6, 7), ARCHITECTURE.md (gameLogic + veri akışı)

**Başlangıç komutu (kopyala-yapıştır):**
```
Sen Agent 1 - Oyun Mantığı'sın. Önce PROGRESS.md, CLAUDE.md ve ARCHITECTURE.md
oku. Görevin: ROADMAP.md Aşama 1'deki yeni pin saplama çekirdeği. Hedef rotation,
impact açısı, pin çarpışması, placedPins, remainingPins, level complete ve hızlı
restart akışını kur. gameLogic.ts'i saf fonksiyonlarla yaz (test edilebilir).
Türkçe yorum ekle. Bitince PROGRESS.md'ye yaz ve commit at. Sadece kendi sahip
olduğun dosyalara dokun.
```

---

## 🎨 Agent 2 — Tasarım / UI

**Sorumluluk:** Görünen her şey. Dönen hedef çizimi, pin/ok görseli, saplanmış pinlerin yerleşimi, animasyonlar (Reanimated), ana menü, renkler, "juice" efektleri (glow, shake, parıltı), geri bildirim mesajları.

**Sahip olduğu dosyalar:** `src/components/*` (Wheel, Ball, HUD, FeedbackMessage), `src/screens/*` (GameScreen HARİÇ — orası Agent 1'in), `src/theme/*`

**Okuması gerekenler:** PROGRESS.md, CLAUDE.md, PRD.md (bölüm 3, 4, 9), ARCHITECTURE.md (components + theme + animasyonlar)

**Başlangıç komutu:**
```
Sen Agent 2 - Tasarım/UI'sın. Önce PROGRESS.md, CLAUDE.md ve ARCHITECTURE.md
oku. Görevin: yeni dönen hedef, pin/ok görseli, saplanmış pin render'ı, sade HUD,
FeedbackMessage ve ana menü uyumu. Reanimated ile animasyonlar. Minimal premium
arcade stil (theme/colors.ts). GameScreen'in MANTIĞINA dokunma (o Agent 1'in) —
sadece görsel component'leri sağla. Bitince PROGRESS.md'ye yaz ve commit at.
```

> Not: Agent 1 ve 2 birlikte çalışır. Agent 1 mantığı kurar, Agent 2 görseli sağlar. Arayüz noktası: component prop'ları (ARCHITECTURE.md'deki veri akışı). İkisi de prop isimlerini PROGRESS.md'de netleştirsin.

---

## 🗄️ Agent 3 — Backend / Veri

**Sorumluluk:** Veri kalıcılığı ve sosyal. Local storage (yüksek skor, ayarlar), Supabase kurulumu, leaderboard, kullanıcı adı sistemi.

**Sahip olduğu dosyalar:** `src/utils/storage.ts`, Supabase ile ilgili dosyalar, skor veri yapısı

**Okuması gerekenler:** PROGRESS.md, CLAUDE.md, PRD.md (bölüm 10), ARCHITECTURE.md (utils/storage)

**NE ZAMAN:** Yeni Aşama 6. Daha önce AÇMA.

**Başlangıç komutu:**
```
Sen Agent 3 - Backend/Veri'sin. Önce PROGRESS.md, CLAUDE.md, PRD.md oku.
Görevin: Yeni Aşama 6 — önce local storage ile highestLevel, bestStreak, totalPins
ve ayar kaydı; sonra Supabase ile leaderboard ve kullanıcı adı. Önce local, sonra
buluta bağla. Oyun mantığına ve UI'a dokunma — sadece veri katmanı. Bitince
PROGRESS.md'ye yaz ve commit at.
```

---

## 🚀 Agent 4 — Yayın / Operasyon

**Sorumluluk:** Mağazaya çıkış. AdMob reklam entegrasyonu, EAS Build, app ikonu/splash, gizlilik politikası, store görselleri.

**Sahip olduğu dosyalar:** `app.json`, EAS yapılandırması, AdMob entegrasyon dosyaları, `assets/` (ikon/splash)

**Okuması gerekenler:** PROGRESS.md, CLAUDE.md, PRD.md (bölüm 12, 13)

**NE ZAMAN:** Yeni Aşama 7 (en son). Oyun tamamen bitmeden AÇMA.

**Başlangıç komutu:**
```
Sen Agent 4 - Yayın/Operasyon'sun. Önce PROGRESS.md, CLAUDE.md, PRD.md oku.
Görevin: Yeni Aşama 7 — AdMob (adil frekanslı geçişli + ödüllü reklam), EAS Build
yapılandırması, yeni hedef+pin ikon/splash, basit gizlilik politikası, store
hazırlığı. Oyun koduna minimum dokun (sadece reklam çağrı noktaları). Bitince
PROGRESS.md'ye yaz ve commit at.
```

---

## 🔗 Agent'lar Arası Koordinasyon

- **Tek gerçek kaynak:** kod + PROGRESS.md. Bir agent "şunu yaptım" diyorsa, kodda ve PROGRESS'te görünür.
- **Çakışma olursa:** Git ile çöz (son commit'e dön). Bu yüzden sık commit at.
- **Ortak dosya (strings.ts, App.tsx):** değiştirmeden önce PROGRESS.md'ye "dokunuyorum" notu.
- **Sen (insan) ne yaparsın:** Agent'lar arası "trafik polisi"sin. Hangi agent ne zaman çalışacak sen karar verirsin, PROGRESS.md'yi gözden geçirirsin.

## Senin (İnsan) İş Akışın

1. Bir görev seç (ROADMAP.md'den).
2. İlgili agent oturumunu aç, başlangıç komutunu yapıştır.
3. Agent çalışsın, sonucu test et (`npx expo start -c`).
4. PROGRESS.md güncellendi mi + commit atıldı mı kontrol et.
5. Sıradaki göreve / agent'a geç.
