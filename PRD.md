# PRD.md — Flag Striker Ürün Gereksinimleri

## 1. Vizyon

**Flag Striker**, Twisty Arrow / Knife Hit ailesinden ilham alan, tek dokunuşla oynanan bir mobil arcade zamanlama oyunudur. Oyuncu, dönen bir hedefe bayrak temalı pin/ok saplar; amaç, mevcut pinlere çarpmadan bölümün istediği sayıda isabet yapmaktır.

Hedef his: **"Bir kez daha"**, **"Bu sefer geçeceğim"**, **"Çok yakındı"**. Oyun öğretici bir bayrak-harita quiz'i olmaktan çıkar; bayrak ve dünya teması artık ayırt edici görsel kimlik ve koleksiyon katmanıdır.

## 1.1 Ürün Yönü

- Referans alınan ana ürün dersi: tek input, kısa seans, anında fail, sıfıra yakın restart süresi.
- Birebir klon yapılmaz; isim, görsel kimlik, hedef şekli, pin tasarımı, level kurgusu ve meta katman bize özgü olur.
- Marka yönü: **Flag Striker**. Dünya, bayrak, arena ve pin/ok estetiği birleşir.
- Eski "bayrak topu + ülke haritası eşleştirme" mekanizması ana oyun olmaktan çıkar.
- Öğrenme hedefi ikincil hale gelir; öncelik akıcı arcade hissi, okunabilirlik ve tekrar oynanabilirliktir.

## 2. Çekirdek Oynanış

- Ekranın ortasında dönen bir hedef bulunur.
- Oyuncu ekrana dokununca alttan bir pin/ok hedefe doğru fırlar.
- Pin hedefe saplanır ve hedefle birlikte dönmeye devam eder.
- Yeni pin, daha önce saplanmış pinlerden birine çarparsa bölüm başarısız olur.
- Bölüm, gereken pin sayısı başarıyla saplanınca tamamlanır.
- Her bölüm birkaç saniye ile bir dakika arasında bitebilir.
- Restart süresi çok kısa olmalıdır; başarısızlık oyuncuyu oyundan koparmamalıdır.

## 3. Temel Kurallar

1. Oyuncu yalnızca dokunur; yön, güç veya sürükleme yoktur.
2. Hedef sürekli döner; hız ve yön level'a göre değişir.
3. Saplanmış pinlerin açıları tutulur.
4. Yeni atışın saplanacağı açı, mevcut pin açılarına çok yakınsa çarpışma sayılır.
5. Çarpışma olursa fail veya can kaybı olur. MVP için önerilen kural: tek çarpışma = bölüm başarısız.
6. Gerekli pin sayısına ulaşılırsa level geçilir.

## 4. Görsel Tasarım Yönü

- Minimal, yüksek kontrastlı, premium arcade.
- Hedef: merkezde güçlü, net okunan bir dünya/rozet/arena diski.
- Pinler: bayrak renkli, ince ama okunaklı; uç kısmı hedefe saplanmış hissi vermeli.
- Arka plan: sade koyu zemin; gerekiyorsa çok hafif arena/stadyum atmosferi.
- Vurgu renkleri: cyan, kırmızı/turuncu fail, altın level complete, kontrollü bayrak renkleri.
- UI kalabalık olmamalı; oyuncunun gözü hedef, pinler ve kalan pin sayısında kalmalı.
- Raster görseller atmosfer için kullanılabilir; oyun objeleri ve UI mümkün olduğunca kod/SVG ile çizilir.

## 5. Ekranlar

### Ana Menü

- Logo: **Flag Striker**.
- Ana aksiyon: Oyna.
- İkincil aksiyonlar: Günlük Görev, Sıralama, Pinler/Temalar, Ayarlar.
- Üst alan: oyuncu seviyesi, coin/gem veya ilerleme bilgisi.
- Menü, pazarlama sayfası değil; oyuncuyu hızlıca oyuna sokan sade bir merkez ekran olmalı.

### Oyun Ekranı

- Üst: level, kalan pin sayısı, streak/score.
- Orta: dönen hedef + saplanmış pinler.
- Alt: sıradaki pin/ok ve tek dokunma alanı.
- Fail ve başarı efektleri kısa, net, akışı bozmayan şekilde gösterilir.

### Level Complete

- Kısa kutlama animasyonu.
- Sonraki levele otomatik veya tek dokunuşla geçiş.
- Yıldız sistemi opsiyonel: hatasız, hızlı bitirme, streak.

### Game Over

- Level, skor/streak, "Tekrar Oyna", "Ana Menü".
- Ödüllü reklam ile ikinci şans ileride eklenebilir; MVP'de şart değil.

### Sıralama

- Top level, streak, toplam isabet gibi sade filtreler.
- Global leaderboard Aşama 3+.

### Market / Koleksiyon

- Pin/ok skinleri.
- Hedef temaları.
- Arka plan/arena temaları.
- Bayrak paketleri veya renk setleri.

## 6. Level Sistemi

Level zorluğu şu parametrelerle artar:

- `requiredPins`: saplanması gereken pin sayısı.
- `rotationDuration`: tam turun süresi; küçüldükçe hız artar.
- `direction`: saat yönü, ters yön veya level içinde yön değişimi.
- `collisionToleranceDeg`: pinler arası minimum güvenli açı.
- `initialPins`: level başında hedefte hazır bulunan engel pinleri.
- `speedPattern`: sabit, hızlanan, yavaşlayan, dur-kalk, yön değiştiren.

MVP hedefi:

- 30-50 kısa level.
- İlk 5 level öğretici ama tutorial'sız.
- 10. level civarı ilk hazır engel pinleri.
- 20. level civarı yön değişimi.
- 30+ level'da dar tolerans ve hız varyasyonu.

## 7. Skor / Streak / İlerleme

- Her başarılı pin: +1 skor veya level içi progress.
- Level tamamlanınca bonus: kalan süre, hatasızlık veya streak.
- Streak, fail olunca sıfırlanır.
- Oyuncunun en yüksek level'ı ve en iyi streak'i local storage'da saklanır.
- Progress kaybı kritik risk olarak görülür; kayıt sistemi basit ama sağlam olmalıdır.

## 8. Geri Bildirim ve His

- Atışta hafif haptic + kısa fırlatma sesi.
- Başarılı saplanmada küçük hit spark, hedefte mikro titreşim, tatmin edici SFX.
- Çarpışmada kırmızı flash, ekran shake, kısa fail sesi.
- Level tamamlanınca altın/cyan kutlama.
- Restart bir saniyeden kısa hissettirmeli.

## 9. Ses

- Fırlatma, saplanma, çarpışma, level complete, game over.
- Kısa, keskin, arcade odaklı sesler.
- Arka plan müziği varsa telefonun kendi müziğiyle çakışmamalı; ayarlardan kapatılabilir olmalı.

## 10. Kullanıcı / Backend

- MVP: local progress, high score, best streak, sound setting.
- Sonra: Supabase leaderboard.
- Daha sonra: Apple/Google login veya anonim kullanıcı adı.

## 11. Para Kazanma

- Ücretsiz + AdMob.
- Reklam frekansı oyunun ritmini bozmamalı.
- İlk seanslarda agresif interstitial yok.
- Interstitial için öneri: birkaç fail veya birkaç level sonrası.
- Rewarded ad: ikinci şans, streak koruma, ekstra coin gibi açık değer sunmalı.
- Tek ve anlaşılır IAP: reklamsız sürüm.

## 12. Yayınlama

- EAS Build.
- App icon + splash yeni mekanik ile uyumlu olmalı: dönen hedef + bayrak pin.
- Store görselleri oyunun gerçek oynanışını göstermeli.
- Gizlilik politikası zorunlu.
- Store metni "tek dokunuş timing arcade" değerini öne çıkarmalı.

## 13. Telif ve Klon Riski

- Twisty Arrow, Knife Hit, aa gibi oyunların birebir kopyası yapılmaz.
- Mekanik türünden ilham alınır; marka, ekran kompozisyonu, level tasarımı, ikon, hedef/pin görselleri özgün tutulur.
- "Twisty Arrow" adı, ikon biçimi, mağaza açıklaması veya görsel düzeni taklit edilmez.
- Gerçek futbolcu, kulüp, turnuva, lisanslı logo kullanılmaz.
- Bayrak kullanımı ve asset lisansları ayrıca doğrulanır.

## 14. Başarı Kriteri

- Oyuncu 3 saniyede ne yapacağını anlar.
- Fail sonrası tekrar deneme çok hızlıdır.
- İlk 10 level akıcı ve adil hissettirir.
- Oyuncu "yakındı" hissiyle tekrar dener.
- Progress güvenilir saklanır.
- Reklam şikayeti tasarımın merkez problemi haline gelmez.
