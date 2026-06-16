# CLAUDE.md

Bu dosya Claude Code için proje talimatlarını içerir. Her oturumda otomatik okunur.

## Proje Özeti

**Flag Striker** — Knife Hit tarzından ilham alan, bayrak öğrenme temalı mobil arcade zamanlama oyunu. Oyuncu, dönen bir çarka top fırlatır. Topun üzerinde bir ülkenin BAYRAK deseni vardır; çarkın dilimlerinde ülke HARİTALARI (silüet + sembol renk) bulunur. Oyuncu, topun bayrağını çarktaki doğru ülke haritasına denk getirdiği anda dokunup fırlatır. Doğru eşleşmede ekranda hızlıca ülke adı + glow belirir (oyun durmaz) — böylece kullanıcı bayrak-harita-ülke eşleşmesini akış içinde öğrenir.

## Çekirdek Mekanik (NET)

- **Çark dilimleri:** ülke haritası (PNG silüet, sembol renkle boyalı). Bayrak DEĞİL.
- **Top:** bir ülkenin bayrak deseni (PNG).
- **Eşleştirme:** topun bayrağı = çarktaki o ülkenin haritası.
- **Doğru:** "Mükemmel İsabet! Bu bayrak Meksika'ya ait." → kısa glow/parıltı, hızlıca kaybolur, oyun AKIŞI DURMAZ.
- **Yanlış:** "Yanlış Bayrak!" → kısa uyarı, can -1, yeni hedefle devam.
- Amaç: hızlı/akıcı arcade hissi + doğal bayrak öğrenme.

## Teknoloji Yığını (KESİN)

- Expo (en güncel SDK) + React Native + TypeScript
- React Native Reanimated 4 + **react-native-worklets** (Reanimated 4 worklets paketini ZORUNLU ister)
- React Native SVG (çark dilimleri, glow, arka plan, vektör efektler)
- React Native Gesture Handler (dokunma)
- **Görsel format kuralı:**
  - Ülke HARİTALARI → **PNG** (mapsicon GitHub seti, ISO kodlu, siyah silüet → tintColor ile renklendirilir)
  - Bayraklar → **PNG** (Flagpedia/FamFamFam, ISO kodlu)
  - Çark, glow, arka plan, efektler → **SVG**
- **Skia KULLANMA.** Sadece SVG + PNG.

## Dil Kuralı (ÇOK ÖNEMLİ)

- Tüm UI metinleri **TÜRKÇE**. Almanca/İngilizce karışık KULLANMA.
- Tüm metinler `src/data/strings.ts` içinde tek object'te (ileride çoklu dil için).
- Örnek: `Mükemmel İsabet!`, `Bu bayrak Meksika'ya ait.`, `Yanlış Bayrak!`, `Puan`, `Can`, `Tekrar Oyna`.

## Telif Kuralları (BU TASARIMDA RİSK SIFIR)

Bu tasarımda gerçek kişi/marka içeriği YOKTUR, dolayısıyla telif riski yoktur:
- İsim YOK, futbolcu YOK, oyuncu fotoğrafı YOK, kulüp/turnuva logosu YOK.
- Sadece: ülke bayrakları (kamuya açık) + ülke haritaları (CC0/serbest) + ülke adları (faktüel coğrafya bilgisi).

KURALLAR:
- Görsel asset indirilirken lisansı kontrol edilmeli: "ticari kullanım + atıf gerekmez" olmalı.
- Bayrak seti: Flagpedia veya FamFamFam (atıfsız, serbest).
- Harita seti: mapsicon (GitHub) — LICENSE dosyası doğrulanmalı.
- **UYARI (gelecek için):** İleride gerçek futbolcu ismi/fotoğrafı/oyuncu karakteri eklenirse telif durumu TAMAMEN değişir ve yeniden değerlendirilmelidir. Bu tasarımda bunlar KULLANILMAYACAK.

## Kod Stili Kuralları

- TypeScript; `any`'den kaçın.
- Küçük, tek işe odaklı fonksiyonlar.
- State basit başlasın (useState/useReducer). Zustand sadece gerekince.
- Şu bölümlere MUTLAKA Türkçe açıklayıcı yorum: wheel rotation, target/top bayrağı üretme, tap to launch, collision/angle detection, eşleştirme kontrolü, score update, lives update, level progression.

## Mimari Kuralı

- Aşama 1: tüm mantık `App.tsx` içinde, temiz ve bölünebilir yazılsın.
- Aşama 2+: `ARCHITECTURE.md`'deki klasör yapısına geç.
- Erken bölme yapma; önce çalışan kod.

## Çalışma Prensipleri

1. Her değişiklikten sonra oyun ÇALIŞIR kalmalı. Kırılırsa önce düzelt.
2. `ROADMAP.md` sırasını takip et, aşama atlama.
3. Kütüphane eklemeden önce `npx expo install` (npm install değil).
4. Babel değişince cache temizle: `npx expo start -c`.

## Yapma Listesi (DON'T)

- Backend (Supabase) → Aşama 3'ten önce ekleme.
- Reklam (AdMob) → Aşama 5'ten önce ekleme.
- Gerçek futbolcu ismi/fotoğrafı/oyuncu karakteri EKLEME.
- İngilizce/Almanca UI metni yazma.
- Gereksiz kütüphane ekleme.

## Önemli Komutlar

```bash
npx expo start -c          # cache temizleyerek başlat
npx expo install <paket>   # Expo uyumlu kurulum
npx tsc --noEmit           # tip kontrolü
```

## Referans Dosyalar

- `PRD.md` — tam ürün vizyonu
- `ARCHITECTURE.md` — dosya yapısı, component görevleri, asset yapısı
- `ROADMAP.md` — aşamalı görev listesi
- `SETUP.md` — sıfırdan kurulum + asset indirme
