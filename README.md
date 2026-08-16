# 📖 Bilgin Ustası

10 yaşındaki bir öğrenci için oyunlaştırılmış test/ödev uygulaması. Ebeveyn her hafta
test yükler, çocuk testleri çözer; XP, coin, seri (streak), rozet ve kişiselleştirilebilir
avatar sistemiyle motive olur. Veriler GitHub reposunda (Vercel Serverless Functions
üzerinden, gizli token ile) saklanır — ekstra bir veritabanı servisine (Supabase vb.) gerek yoktur.

## 🖱️ Gerçek Sürükle-Bırak Oda Tasarımı (Toca Life House tarzı)

Sabit slot sistemi ("bir masa, bir lambader...") yerini **serbest konumlandırmaya** bıraktı:

- ✅ **Sürükle-bırak kanvas:** Her odada bir tasarım alanı var, sahip olunan eşyalar alttaki paletten dokunarak eklenir, sonra parmakla/imleçle istenen yere sürüklenir. Pointer Events API kullanıldığı için hem dokunmatik (telefon/tablet) hem fare ile sorunsuz çalışır.
- ✅ **Aynı eşyadan birden fazla oda:** Bir eşya (örn. "Ahşap Çalışma Masası") farklı odalarda bağımsız olarak kullanılabilir — her odanın kendi düzeni var.
- ✅ **Kaldırma:** Yerleştirilen her eşyanın üstünde küçük bir ✕ butonu var, dokununca eşya odadan kalkar (envanterden düşmez, tekrar palette görünür).
- ✅ **Performans:** Sürükleme sırasında her piksel hareketinde buluta yazma YAPILMIYOR — sadece parmak/imleç bırakıldığında (sürükleme bitince) GitHub'a senkronize ediliyor. Böylece hem akıcı sürükleme hem gereksiz API çağrısı yok.
- ✅ **Eski veriler otomatik göç ediyor:** Önceki slot-bazlı oda verisi olan kullanıcılar için eşyalar eski konumlarına yakın yerlere otomatik yerleştirilir, hiçbir şey kaybolmaz.
- ✅ **Oda tamamlama tanımı güncellendi:** Bir oda artık "duvar kağıdı seçili + en az 6 eşya yerleştirilmiş" olunca tamamlanmış sayılıyor (sabit 6 slot yerine, esnek eşya sayısı).

## 🏠 Ev İnşa Etme: Tek Oda Değil, Bir Ev!

Tek bir oda yerine artık **6 farklı oda** var, her biri Sihirli Yol Haritası'ndaki dünyalarla
birlikte açılıyor — "oda sayısı ile bölüm atlama" hissi böyle kuruldu:

- ✅ **6 Oda:** Yatak Odası (başlangıç) → Oyun Odası → Çalışma Odası → Oturma Odası → Bahçe → Kütüphane. Her biri farklı bir Dünya seviyesinde açılıyor.
- ✅ **Her odayı ayrı ayrı tasarlar:** Duvar kağıdı, halı, masa, lambader, saksı bitki, poster — aynı geniş katalogdan, ama her odaya bağımsız olarak.
- ✅ **Oda tamamlama ödülü:** Bir odanın tüm slotları dolunca (🎉 "Bu oda tamamen döşendi!") bir kereye mahsus +40 XP / +60 coin bonusu veriliyor — deterministik, rastgele değil.
- ✅ **"Karakterim" → "Ev" sekmesinde** oda seçici şeritle hangi odayı düzenlediğini görebilir, her odanın doluluk yüzdesini (%) takip edebilir.
- ✅ Ana Sayfa'da "🏠 Oda: X/6" istatistiği ile genel ilerleme özetleniyor.

Bu sayede avatar + pet + 6 oda = çok daha büyük bir "biriktirilecek/tasarlanacak" alan oluştu,
üstelik hepsi seviye atlamaya (yani soru çözmeye) bağlı kilitli.

## 🗺️ Sihirli Yol Haritası: Gerçek "Bölüm Geçme" Sistemi

Kozmetik koleksiyon tek başına birkaç haftada tükenir — bu yüzden gerçek bir **ilerleme/bölüm**
katmanı ekledik. Artık uygulama kozmetik bir giydirme oyunundan çok, "seviye atlayarak yeni
dünyalar açan" bir macera oyununa benziyor:

- ✅ **12 Dünya:** Başlangıç Köyü → Büyülü Orman → Bilim Laboratuvarı → ... → Sonsuzluk Kapısı. Her dünya bir sonraki **seviyeye** ulaşınca (yani yeterince soru çözüp XP kazanınca) otomatik açılır.
- ✅ **Sonu gelmeyen seviye sistemi:** İlk 12 seviye sabit tanımlı, sonrası **prosedürel olarak sonsuz** üretilir ("Efsanevi Bilgin ✦2, ✦3, ...") — aylarca oynansa bile her zaman bir sonraki hedef var.
- ✅ **Her dünyanın kendine özel ödülleri var:** Kıyafet/pet/oda eşyaları artık "dünya" etiketiyle gruplanıyor. Mağazada henüz açılmamış dünyaların eşyaları 🔒 kilitli görünüyor ("Bilim Laboratuvarı açılınca — Seviye 3 gerekli") — bu, çocuğa "bir sonraki hedefim ne" hissini sürekli canlı tutuyor.
- ✅ **Harita ekranı:** Ana Sayfa'dan "🗺️ Harita" ile açılıyor, hangi dünyada olduğunu, kilitli/açık dünyaları ve her dünyanın ödül önizlemesini gösteriyor.
- ✅ **Yeni dünya açılınca kutlama:** Seviye atlayıp yeni bir dünyanın eşiğini geçince ekranda bildirim çıkıyor ("🗺️ Yeni Dünya Açıldı: 🐉 Ejderha Vadisi!").
- ✅ **Hareketli avatar:** Ana ekranda avatar ve evcil hayvan artık hafif "bob" animasyonuyla canlı duruyor.

**Önemli:** Bütün bu sistem hâlâ tamamen soru çözmeye dayalı — dünya açmanın tek yolu XP kazanmak,
XP kazanmanın tek yolu da (pratik testi dahil) soru çözmek. Yani "oyun" hissi güçlense de,
motoru hep ders çalışmak.

**Yeni dünya eklemek istersen:** `src/data/worlds.js` dosyasına bir satır eklemen yeterli — harita
otomatik büyür. İlgili ürünlere `world: "w13"` gibi bir etiket eklersen o dünyaya özel ödül olur.

## Sınırsız Oyun Döngüsü: Pratik Testi Üretici & Genişletilmiş Katalog 🎮

Kızın istediği kadar test çözüp avatar geliştirmek isteyecek — buna göre tasarladık:

- ✅ **Günlük limit yok:** Test çözme, XP/coin kazanma hiçbir zaman sınırlanmadı. Aynı test istenildiği kadar tekrar çözülebilir.
- ✅ **Pratik Testi Üretici (`🔄 Sınırsız!`):** Ana Sayfa'da her ders için bir buton — ebeveynin yüklediği tüm sorular o dersin havuzunda birleşip her seferinde **karıştırılarak yeni bir test** oluşturur. Böylece ebeveynin her gün 10 ayrı test yazmasına gerek kalmadan, çocuk aynı haftanın konularından istediği kadar pratik yapabilir, her seferinde biraz farklı bir soru sırası/kombinasyonuyla karşılaşır.
- ✅ **3 kat daha büyük avatar kataloğu:** Kıyafet/şapka/gözlük çeşidi ~15'ten ~35+'a çıktı (her sette birden fazla renk seçeneği). Kod tarafında "shape" (şekil) bazlı render sistemine geçildi — yani yeni renk varyantı eklemek artık sadece veri eklemek, çizim kodu yazmak gerekmiyor.
- ✅ **Evcil hayvan ve oda kataloğu genişledi:** 4 türden 7 türe (renk varyantlarıyla), oda dekorasyonuna 2 yeni kategori eklendi (Saksı Bitki, Poster).

Bu sayede çocuk "oyun oynar gibi" istediği kadar test çözüp avatarını geliştirebilir, tükenmeyen bir içerik havuzu var.

## Juicy UI: Ses Efektleri, Konfeti & Sesli Okuma 🔊

- ✅ **Ses efektleri:** Web Audio API ile anlık üretilir (harici ses dosyası yok, internet gerekmez) — buton "pop"u, doğru/yanlış cevap tonu, coin şıngırtısı, büyük kutlama fanfarı. Header'daki 🔊/🔇 düğmesiyle kapatılabilir (tercih localStorage'da saklanır).
- ✅ **Konfeti animasyonu:** `canvas-confetti` ile tam puan alınca test sonucu ekranında, hafıza oyununu kazanınca da mini oyun ekranında patlıyor.
- ✅ **Sesli Okuma (TTS):** Tarayıcının yerleşik `window.speechSynthesis` API'si ile çalışır, ekstra kütüphane/ücret gerektirmez. Test sorularının, bonus sorunun ve Ana Sayfa karşılama mesajının yanında 🔊 ikonu ile okutulabilir. Türkçe (`tr-TR`) sesle okur.

## Yeni Eklenenler: Sticker Albümü, Ruh Hali & Mola Oyunu 🎨

- ✅ **Sticker Albümü:** Her tamamlanan test, albümde sırada bekleyen bir sonraki sticker'ı **garanti** açar (rastgele değil). "Karakterim" sekmesinde 4. sekme olarak, 4 kategori × 8 sticker = 32 sticker.
- ✅ **Günlük Ruh Hali Seçici:** Ana Sayfa'da günde bir kez, 5 emoji arasından seçim yapılabilir. Ebeveyn Paneli'nde son 14 günün özeti görünür — sohbet başlatmak için nazik bir araç, tanı/etiketleme amaçlı değildir.
- ✅ **Mola Zamanı Hafıza Oyunu:** 3 temalı (Meyveler, Hayvanlar, Okul Eşyaları) kart eşleştirme oyunu. Günde ilk kazanışta +15 coin bonus (istismarı önlemek için günde bir kez), sonrasında sınırsız oynanabilir ama ekstra ödül vermez.

## Görsel Stil: Toca Boca Esintili 🎨

Uygulama artık koyu "büyücü günlüğü" temasından, Toca Boca oyunlarındaki gibi açık, canlı,
kalın kontur çizgili ve büyük gözlü sevimli bir görsel dile geçti:

- Açık gökyüzü mavisi zemin üzerinde pastel/canlı renk lekeleri (mercan, sarı, nane yeşili, mor)
- Tüm kartlar beyaz "sticker" görünümünde: kalın koyu erik rengi kontur + düz (bulanıksız) ofset gölge
- Avatar ve evcil hayvanlar büyük yuvarlak baş, iri gözler, kalın kontur çizgileriyle yeniden çizildi
- Oda dekorasyonu artık gündüz temalı: güneş, bulutlar, benekli zemin
- Başlık fontu Baloo 2 (yuvarlak, oyuncu), gövde fontu Quicksand ile değiştirildi
- Butonlar "sticker-btn" sınıfıyla basılınca zıplayan kalın konturlu tasarıma kavuştu

## Neler var (Faz 1 + 2 + 3 — tam işlevsel)

- ✅ Test çözme: çoktan seçmeli, ipucu jokeri, süreli mod (hız bonusu), sürpriz bonus soru
- ✅ XP / Coin / Seviye sistemi (Çaylak Öğrenci → ... → Bilgin)
- ✅ Haftalık Seri (streak) + aylık 1 "dondurma hakkı"
- ✅ Hata Kutusu + Rövanş Testi (aralıklı tekrar)
- ✅ Rozetler (Matematik Canavarı, Kitap Kurdu, Haftanın Şampiyonu, vb.)
- ✅ Katmanlı SVG Avatar: ten tonu, saç, 4 tematik kıyafet seti (Okul, Büyülü, Bilim, Mevsimlik)
- ✅ Coin ile Mağaza (avatar parçaları + gerçek dünya ödülleri) — rastgele değil, **garanti** kazanım
- ✅ %100 tam puanla açılan "efsanevi" avatar parçaları (deterministik, gacha değil)
- ✅ Ebeveyn Paneli: şifre korumalı, test yükleme formu, ders bazlı analiz grafiği, ödül yönetimi
- ✅ GitHub'a otomatik senkron (Vercel Serverless Function, token gizli) + çevrimdışı yerel yedek

## Faz 3 (tamamlandı ✅)

- ✅ Evcil hayvan sistemi: 4 tür (kedi, köpek, baykuş, ejderha — ejderha efsanevi, Fen Bilimleri'nden %100 ile açılıyor), 3 aksesuar (tasma, fiyonk, atkı)
- ✅ Oda dekorasyonu: duvar kağıdı, halı, çalışma masası, lambader — hepsi coin ile mağazadan alınır
- ✅ "Günün Kombini" karşılama ekranı: Ana Sayfa'nın en üstünde, dekore edilmiş odada avatar + evcil hayvan birlikte görünür, karakter konuşma balonuyla selam verir
- ✅ "Karakterim" sekmesi artık üç alt sekmeye ayrıldı: Kıyafet / Evcil Hayvan / Oda
- ✅ Mağaza'ya Evcil Hayvan ve Oda sekmeleri eklendi

---

## 🚀 Erken Başlangıç Bonusu (İlk 8 Hafta)

Hesap oluşturulduğu andan itibaren **56 gün boyunca** (8 hafta) tüm XP ve coin kazanımlarına
**x1.5 çarpan** uygulanır — test sonuçları, oda tamamlama bonusu, mola oyunu ödülü, hepsi dahil.

- ✅ Bu, test.week etiketinden BAĞIMSIZ, tamamen **hesap yaşına** göre çalışır (hangi içeriği çözdüğü değil, ne zamandır oynadığı önemli)
- ✅ Ana Sayfa'da bonus aktifken altın renkli bir banner görünür: "🚀 Erken Başlangıç Bonusu Aktif! XP & Coin x1.5 — X gün kaldı"
- ✅ Test sonuç ekranında da bonusun uygulandığı küçük bir notla belirtilir
- ✅ 56 gün dolunca otomatik olarak normale döner, hiçbir şey yapmana gerek yok

Bu, "yumuşak başlangıç" (4. Sınıf içerik) planıyla birlikte çalışıyor: ilk 2 ay hem daha kolay
sorular hem daha hızlı ödül kazanma — çifte pekiştirme ile bağlanma güçleniyor.

**Çarpanı veya süreyi değiştirmek istersen:** `src/lib/gamification.js` dosyasındaki
`EARLY_BOOST_MULTIPLIER` (varsayılan 1.5) ve `EARLY_BOOST_DAYS` (varsayılan 56) değerlerini
güncellemen yeterli.

## Yumuşak Başlangıç Planı (İlk 8 Hafta) 🌱

Sıkılmayı önlemek için önerilen tempo:

- **Hafta 1-8:** Her ders için "4. Sınıf (Kolay Başlangıç)" seviyesinde sorular yükle. Test yükleme formunda hafta numarasına göre otomatik bir hatırlatma çıkar.
- **Hafta 9+:** Kademeli olarak "Orta 1 (Standart)" seviyesine geç.
- İngilizce sabit olarak "Orta 2 (İleri)" tutuluyor (kızının seviyesine göre).
- Her testin sınıf seviyesi Ana Sayfa'daki test listesinde ve test başlama ekranında küçük bir rozet olarak görünür — hem sen hem çocuğun hangi seviyede olduğunu görebilir.

Bu etiket sadece senin takibin için — oyun mekaniğini (XP/coin/zorluk) etkilemiyor, sadece hangi
içeriği ne zaman yüklediğini hatırlamana yardımcı oluyor.

## Kurulum Adımları

### 1) Bu klasörü kendi GitHub reposuna yükle

```bash
cd bilgin-ustasi
git init
git add .
git commit -m "İlk kurulum"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/bilgin-ustasi.git
git push -u origin main
```

### 2) GitHub Personal Access Token oluştur

GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token
- Repository access: sadece bu repo (`bilgin-ustasi`)
- Permissions: **Contents: Read and write**
- Süresiz veya uzun süreli seçebilirsin

Token'ı bir yere not al, bir daha gösterilmeyecek.

### 3) Vercel'e bağla

1. [vercel.com](https://vercel.com) → New Project → GitHub reponu seç
2. Framework otomatik "Vite" olarak algılanır
3. **Environment Variables** kısmına şunları ekle (`.env.example` dosyasına bak):
   - `GITHUB_TOKEN` = oluşturduğun token
   - `GITHUB_OWNER` = GitHub kullanıcı adın
   - `GITHUB_REPO` = `bilgin-ustasi`
   - `GITHUB_BRANCH` = `main`
   - `PARENT_ACCESS_KEY` = kendi belirleyeceğin bir şifre (ebeveyn paneli için)
4. Deploy'a bas

### 4) İlk kullanım

- Uygulama açıldığında otomatik olarak `data/profile.json` dosyasını GitHub'da oluşturur
- Ebeveyn sekmesine gir, belirlediğin `PARENT_ACCESS_KEY` ile giriş yap
- İlk testini yükle (veya repo'daki örnek `data/tests/matematik-hafta1.json` dosyasını kullan)

### 5) Kızının cihazına ekleme

Vercel'in verdiği linki (`https://bilgin-ustasi.vercel.app` gibi) kızının telefonunda/tabletinde
tarayıcıda açıp "Ana Ekrana Ekle" yaparsan uygulama gibi görünür ve çalışır.

---

## Her hafta yeni test nasıl eklenir?

Ebeveyn Paneli → "Yeni Test Yükle" formunu kullan: ders, hafta no, sorular ve şıkları gir,
"Testi Yayınla" de. Otomatik olarak `data/tests/` klasörüne GitHub'a commit atılır ve
uygulamada anında görünür.

İstersen elle de JSON dosyası hazırlayıp doğrudan `data/tests/` klasörüne push edebilirsin —
format için `data/tests/matematik-hafta1.json` dosyasına bak.

**İpucu:** Pratik Testi Üretici, o dersin TÜM yüklü sorularından besleniyor. Ne kadar çok soru
yüklersen (birden fazla test halinde de olabilir), pratik testleri o kadar çeşitli olur ve
tekrara düşme ihtimali azalır. Haftada 15-20 soru/ders hedeflemek iyi bir başlangıç.

## Yerel geliştirme

```bash
npm install
cp .env.example .env.local   # değerleri doldur
npm run dev
```

`vercel dev` kullanırsan `/api` fonksiyonları da yerelde çalışır (Vercel CLI gerekir: `npm i -g vercel`).
Sadece `npm run dev` ile açarsan `/api` istekleri başarısız olur ve uygulama otomatik olarak
**yerel/çevrimdışı moda** düşer (veriler tarayıcıda localStorage'da tutulur).

## Teknik notlar

- Token **hiçbir zaman** tarayıcıya gönderilmez; tüm GitHub yazma/okuma işlemleri Vercel
  Serverless Functions (`/api/*.js`) üzerinden, sunucu tarafında yapılır.
- Ebeveyn Paneli'ndeki test yükleme, `x-parent-key` header'ı ile korunur.
- Tüm ilerleme (`xp`, `coins`, `history`, `mistakeBox`, `badges`, `avatar`, ...) tek bir
  `data/profile.json` dosyasında tutulur — basit ve tutarlı senkron için.
