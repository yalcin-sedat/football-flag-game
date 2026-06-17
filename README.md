# Flag Striker

Tek dokunuşla oynanan, dönen hedefe bayrak temalı pin/ok saplama üzerine kurulu Expo + React Native arcade oyunu.

Oyuncu ekrana dokunur, alttaki pin hedefe fırlar. Pin hedefe saplanır ve hedefle birlikte döner. Yeni pin mevcut pinlere çarparsa bölüm başarısız olur; gereken pin sayısı tamamlanınca level geçilir.

## Proje Kökü

Bu uygulamanın gerçek proje kökü bu klasördür:

```bash
flag-striker/
```

Codex, Claude Code, VS Code ve terminal oturumlarını mümkünse bu klasörden başlat.

## Komutlar

```bash
npx expo start -c
npx tsc --noEmit
```

## Klasör Yapısı

```text
assets/
  flags/        # Bayrak PNG dosyaları (skin/tema için)
  maps/         # Harita PNG dosyaları (opsiyonel tema/rozet için)
  sounds/       # Ses efektleri
src/
  components/   # Görsel UI component'leri
  data/         # Level, tema ve metin verileri
  screens/      # Ekranlar
  theme/        # Renkler ve görsel tema
  utils/        # Saf oyun mantığı, açı/çarpışma hesapları ve yardımcılar
```

## Proje Hafızası

- `AGENTS.md` — agent rolleri ve dosya sahipliği
- `CLAUDE.md` — proje talimatları
- `PROGRESS.md` — canlı ilerleme günlüğü
- `PRD.md` — ürün kapsamı
- `ARCHITECTURE.md` — hedef mimari
- `ROADMAP.md` — aşamalı geliştirme planı
- `SETUP.md` — kurulum ve asset notları
