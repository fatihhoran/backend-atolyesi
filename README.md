# Backend Atölyesi

Sıfırdan başlayıp TaskFlow görev yönetim API’sine ilerleyen 6 haftalık yoğun Türkçe backend programı. Ana yol C#, .NET 10, ASP.NET Core, EF Core ve SQL Server kullanır. Haftada beş çalışma günü ve günde 5–6 saat bir plan önerisidir. 52 dersin her birinde açıklama, örnek, uygulama, çözüm ve en az beş quiz sorusu bulunur.

| Haftalar | Uygulama hedefi |
| --- | --- |
| 1 | C# ve Git ile konsolda görev yönetimi. |
| 2 | ASP.NET Core, REST, HTTP ve OpenAPI ile ürün API’si. |
| 3 | SQL Server, LINQ ve EF Core ile kalıcı görev API’si. |
| 4 | Servis katmanı, Identity, JWT ve görev sahipliği. |
| 5 | Testler, Docker, CI/CD ve hazırlık ortamı. |
| 6 | TaskFlow, kod inceleme, hata ayıklama ve mülakat. |

## Uygulama ve kayıtlar

Atölye, GitHub Pages üzerinde çalışan statik bir PWA. HTML/CSS ve JavaScript, ders ve araç sayfalarını oluşturur. Service worker çevrimdışı kullanım için uygulama dosyalarını saklar. API laboratuvarı tarayıcıda HTTP akışını simüle eder. SQL laboratuvarı SQLite/WebAssembly ile gerçek sorgular çalıştırır. TaskFlow ise öğrencinin bilgisayarında geliştirdiği ayrı bir ASP.NET Core projesidir. Mevcut SQLite Görev API ZIP’i ilk HTTP alıştırması olarak kullanılabilir.

İsim, notlar, yer işaretleri, tekrar kartları, test geçmişi ve ilerleme, aynı adres ve tarayıcıda `backend-atolyesi-v1` anahtarıyla saklanır. Ayarlar’dan JSON yedeği alabilir veya eski bir yedeği yükleyebilirsin. Ana rotanın ilerleme yüzdesi yalnızca aktif dersleri sayar. Ayarlar’daki **Ders arşivi** eski yapay zekâ derslerine ve bu derslerin notlarına erişim sağlar. Eski SQLite proje işaretleri TaskFlow sayfasında ayrı bir kontrol listesinde durur.

İlk gün **Başlangıç seviye testi** ile başlayıp **Backend ne yapar?** ve **Program nasıl çalışır?** derslerini çalış. **Bugünkü çalışma** herhangi bir haftayı ve günü seçmene izin verir. Ders işareti, %80 quiz eşiği ve doğrulanmış pratik ayrı göstergelerdir. Eşiğin altında kalan quizler tekrar sırasına düşer.

**Haftalık projeler** bölümündeki [yerel pratik paketi](downloads/Atolye_Yerel_Pratik.zip) başlangıç projeleri, örnek HTTP istekleri ve değerlendirme komutlarını içerir. Komutları kendi bilgisayarında ve atılabilir bir eğitim veritabanıyla çalıştır. Yerel JSON raporu tarayıcıda okunur ve öğrenme geçmişine eklenir. SQL laboratuvarında değerlendirilen denemeler ayrı, başlangıç verisiyle hazırlanmış SQLite veritabanında çalışır. C# kodu sunucuya veya uzaktan çalıştırma hizmetine gönderilmez.

İngilizce arayüz ve önceki İngilizce dersler kullanılabilir. Yeni dersler ve sorular Türkçedir. Ders kimlikleri ve ilerleme iki dilde ortaktır.

## Yerelde çalıştırma

```sh
python -m http.server 8743 --bind 127.0.0.1
node --test tests/curriculum.test.cjs tests/practice.test.mjs
```

Tarayıcıda `http://127.0.0.1:8743` adresini aç. Uygulama hazır statik dosyaları kullanır. Kurulum için [Türkçe rehbere](KURULUM_TR.md) veya [İngilizce rehbere](INSTALL_EN.md) bak.

Ders sırası ve yoğun programa eklenen içerik `academy-content.v7.js`, pratik sözleşmeleri `academy-practice.v7.js`, yerel kontrol aracı `pratik/kontrol.mjs` içindedir. Eski ders kimliklerini ve soru/sözlük sıra numaralarını koru. Çevrimdışı kullanılan dosyalar değişirse service worker paketini ve ilgili sürüm adlarını birlikte güncelle.

## Görsel kimlik

Atölye’nin özgün SVG çizimleri, açık ve koyu logoları ve kurulum ikonları `brand/` klasöründe. Renk, tipografi, boşluk, kontrast ve ortak bileşen kuralları `brand.v8.css` içinde. `brand.v8.js` ana paneli, haritayı, proje kartlarını ve SQL düzenleyici görünümünü ortak veri modeline bağlar.

SQL çalışma alanında **Ctrl + Enter** sorguyu çalıştırır. Ders kodları klavyeyle odaklanabilir ve yatay kaydırılabilir. Masaüstünde üst çubuktaki gezinme düğmesi yan menüyü daraltır. Proje detayında isteğe bağlı GitHub depo bağlantısı yerel çalışma kaydıyla saklanır.
