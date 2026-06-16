# PRD.md — Flag Striker Ürün Gereksinimleri

## 1. Vizyon

Hızlı, akıcı, bağımlılık yapan bir arcade oyun + doğal bayrak/coğrafya öğrenme. Kullanıcı birkaç saniyede anlar, tekrar tekrar oynar ve oynarken bayrakları/ülkeleri öğrenir. Hedef his: "Bir kez daha", "Skorumu geçeceğim", "Bu bayrak hangi ülkeydi?".

## 2. Çekirdek Oynanış

- Ekranın ortasında dönen çark; dilimlerde **ülke haritaları** (silüet + ülke sembol rengi).
- Altta sabit fırlatıcı; **topun üzerinde bir ülkenin bayrak deseni** var (hedef budur).
- Çark döner; oyuncu, topun bayrağı çarktaki **aynı ülkenin haritasına** hizalandığı anda ekrana dokunup topu fırlatır.
- **Doğru eşleşme:** "Mükemmel İsabet! Bu bayrak Meksika'ya ait." mesajı hızlıca belirir, kısa glow/parıltı, sonra kaybolur. **Oyun durmaz.** Puan +1.
- **Yanlış eşleşme:** "Yanlış Bayrak!" kısa uyarı, kırmızı flash + hafif shake, can -1. Oyun yeni hedefle devam.
- Her atıştan sonra topun bayrağı değişir (yeni hedef).

## 3. Öğrenme Mekanizması

Öğrenme oyunun AKIŞI İÇİNDE olur, ayrı ekranda değil:
- Her doğru eşleşmede bayrak → ülke adı eşleşmesi kısa görsel geri bildirimle pekişir.
- Mesaj hızlı geçer, oyunu yavaşlatmaz.
- Tekrar oynadıkça (spaced repetition) bayrak-ülke-harita üçlüsü öğrenilir.
- Opsiyonel: level sonunda o bölümde geçen bayrak-ülke eşleşmeleri özet kartı.

## 4. Ekranlar

### Ana Menü
- Logo "Flag Striker", butonlar: Oyna, Günlük Görev, Sıralama, Karakterler (top/çark temaları), Ayarlar.
- Koyu mavi neon stadyum atmosferi, projektör ışıkları, saha çizgileri (SVG).
- Premium arcade his, neon mavi/yeşil/mor/altın, smooth geçişler.

### Oyun Ekranı
- Sol üst: Puan. Sağ üst: Can (kalpler). Orta üst: Seviye + Grup + progress bar.
- Orta: dönen çark (Seviye 1 = 4 harita dilimi).
- Alt: sabit fırlatıcı + üzerinde bayrak desenli top.
- Doğru/yanlış geri bildirim mesajları (akışı durdurmaz).

### Game Over
- Final skor, doğruluk oranı, combo. Butonlar: Tekrar Oyna, Ana Menü, Skoru Gönder.

### Sıralama
- Top 10, kendi sıran, rozetler, günlük/haftalık/tüm zamanlar.

## 5. Çarpışma + Eşleştirme Mantığı

1. Top belirli Y koordinatına ulaşınca çarpışma sayılır.
2. Çarkın o anki rotation değeri normalize edilir (0–360).
3. Tepe (0°) referans; 360 / dilim sayısı → vurulan dilim index'i.
4. Vurulan dilimin ülkesi, topun bayrağının ülkesiyle karşılaştırılır.
5. Eşit → doğru; değil → yanlış.

## 6. Seviye Sistemi

- **Seviye 1 / Grup A:** 4 dilim, yavaş çark, tanınır büyük ülkeler (örn. Meksika, Brezilya, Fransa, Türkiye).
- **Seviye 2 / Grup B:** biraz hızlı, combo başlar.
- **Seviye 3 / Grup C:** çark yön değiştirir, dar dilimler.
- **Seviye 4 / Challenge:** 5-6 dilim, hızlı, süre limiti.
- Tanınması zor küçük/karmaşık haritalı ülkeler ileri seviyelere.
- Grup tamamlanınca yeni arena açılır.

## 7. Skor / Combo / Ödül

- Başlangıç: Puan 0, Can 3.
- Doğru: +1. 3 combo: +2 bonus. 5 combo: çark glow. 10 combo: "Yanıyorsun!".
- Yanlış: -1 can, combo sıfırlanır.
- Level sonu yıldız: 1 (tamamladı), 2 (≤1 hata), 3 (hatasız).

## 8. Günlük Görev
Her gün tek özel bölüm (örn. "10 doğru", "sadece 3 can", "çark yön değiştirir"). Günlük skor ayrı sıralamaya.

## 9. Karakter / Tema
İsim/oyuncu YOK. Bunun yerine top/çark temaları (skin): farklı top desenleri, çark stilleri, arka plan temaları. Hepsi serbest/kurgusal.

## 10. Kullanıcı / Backend
- İlk prototip: kullanıcı adı + skor local storage.
- Sonra: Supabase leaderboard. İleride Google/Apple login.

## 11. Ses
tap, fırlatma, doğru, yanlış, level complete, game over. Ayarlardan aç/kapa. Telifsiz/CC0.

## 12. Para Kazanma
Ücretsiz + AdMob. Geçişli (Game Over / her 3 oyun), ödüllü ("izle, can kazan" / "devam et"). İleride reklamsız sürüm + premium tema. Gizlilik Politikası zorunlu.

## 13. Yayınlama
EAS Build + Apple (99$/yıl) + Google (25$) + ikon + splash + store görselleri + gizlilik politikası.

## 14. Telif Durumu
Bu tasarımda gerçek kişi/marka YOK → risk sıfır. Sadece bayrak (kamuya açık) + harita (CC0) + ülke adı (faktüel). Asset lisansları indirilirken doğrulanır.

## 15. Başarı Kriteri
Akıcı, tekrar oynatan, görsel olarak premium, dil bağımsız (metin minimum → uluslararası), öğretici bir arcade oyun.
