# Soru Bankası - 20'lik Testlere Bölünmüş Hâli

## Ne Değişti?

Önceki pakette 24 dosya vardı, her biri 70-86 soru içeriyordu (yani "1 test" = 70-86 soru
demekti). Bu, tamamlama bonusunu/sticker'ı/"Harika İş!" ekranını görmek için çok uzun
bekleme demekti.

Bu pakette aynı 1.758 soru, **96 dosyaya, her biri ortalama 18-20 soru** olacak şekilde
bölündü. Hiçbir soru kaybolmadı veya değiştirilmedi — sadece test dosyaları küçük
parçalara ayrıldı.

## Ne Yapmalısın?

1. GitHub'daki `data/tests/` klasöründeki **eski 24 dosyayı sil** (isimleri `-genis` veya
   ünite adlarıyla bitenler — önceki yüklemede verdiğim dosyalar).
2. Bu paketteki **96 dosyanın tamamını** aynı klasöre yükle.
3. Her dosya artık kendi başına bağımsız bir test — çocuğun "1 test" çözmesi ~20 soru
   demek, bu da tamamlama bonusunu çok daha sık tetikler.

## Dosya İsimlendirmesi

Örnek: `matematik-unite1-dogalsayilar-genis.json` (80 soru) →
- `matematik-unite1-dogalsayilar-genis-p1.json` (20 soru)
- `matematik-unite1-dogalsayilar-genis-p2.json` (20 soru)
- `matematik-unite1-dogalsayilar-genis-p3.json` (20 soru)
- `matematik-unite1-dogalsayilar-genis-p4.json` (20 soru)

Başlıklar da otomatik güncellendi: "Ünite 1 - Doğal Sayılar (1/4)" gibi, böylece
Pratik Testi Üretici veya Ebeveyn Paneli'nde hangi parçanın hangisi olduğu bellidir.

## Not

Pratik Testi Üretici zaten tüm bu soruları (parçalanmış olsa da) tek bir havuzdan
karıştırıp yeni testler oluşturuyor, dolayısıyla bu bölme işlemi üretici tarafında
hiçbir şeyi bozmaz — sadece elle yüklenen "sabit" testlerin uzunluğunu düzeltir.
