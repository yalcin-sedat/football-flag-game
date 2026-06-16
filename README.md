# Flag Striker

Bayrak ve ülke haritası eşleştirmeye dayalı Expo + React Native arcade oyunu.

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
  flags/        # Bayrak PNG dosyaları
  maps/         # Ülke haritası PNG dosyaları
  sounds/       # Ses efektleri
src/
  components/   # Görsel UI component'leri
  data/         # Ülke ve metin verileri
  screens/      # Ekranlar
  theme/        # Renkler ve görsel tema
  utils/        # Saf oyun mantığı ve yardımcılar
```

## Proje Hafızası

- `AGENTS.md` — agent rolleri ve dosya sahipliği
- `CLAUDE.md` — proje talimatları
- `PROGRESS.md` — canlı ilerleme günlüğü
- `PRD.md` — ürün kapsamı
- `ARCHITECTURE.md` — hedef mimari
- `ROADMAP.md` — aşamalı geliştirme planı
- `SETUP.md` — kurulum ve asset notları
