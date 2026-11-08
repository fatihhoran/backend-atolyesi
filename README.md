# Backend Atölyesi

Sıfırdan başlayıp TaskFlow görev yönetim API’sine ilerleyen 16 haftalık Türkçe backend programı. Ana yol C#, .NET 10, ASP.NET Core, EF Core ve SQL Server kullanır. Derslerde kavram açıklaması, örnek, uygulama görevi, örnek çözüm ve mini quiz bulunur.

| Haftalar | Uygulama hedefi |
| --- | --- |
| 1–4 | Bir internet isteğini izle. C# ile konsol uygulaması yaz, görev nesnesi modelle ve LINQ sorgula. |
| 5–8 | HTTP/JSON sözleşmesiyle CRUD geliştir. İlişkisel sorgu yaz, SQL Server’a bağlan ve EF Core migration uygula. |
| 9–12 | DTO ve servis katmanını ayır. JWT, görev sahipliği, otomatik test, doğrulama, loglama ve cache ekle. |
| 13–16 | Git, Docker ve CI/CD ile hazırlık ortamını kur. OpenAPI sözleşmesini doğrula ve TaskFlow’u portföye hazırla. |

## Uygulama ve kayıtlar

Atölye, GitHub Pages üzerinde çalışan statik bir PWA. HTML/CSS ve JavaScript, ders ve araç sayfalarını oluşturur. Service worker çevrimdışı kullanım için uygulama dosyalarını saklar. API laboratuvarı tarayıcıda HTTP akışını simüle eder. SQL laboratuvarı SQLite/WebAssembly ile gerçek sorgular çalıştırır. TaskFlow ise öğrencinin bilgisayarında geliştirdiği ayrı bir ASP.NET Core projesidir. Mevcut SQLite Görev API ZIP’i ilk HTTP alıştırması olarak kullanılabilir.

İsim, notlar, yer işaretleri, tekrar kartları, test geçmişi ve ilerleme, aynı adres ve tarayıcıda `backend-atolyesi-v1` anahtarıyla saklanır. Ayarlar’dan JSON yedeği alabilir veya eski bir yedeği yükleyebilirsin. Ana rotanın ilerleme yüzdesi yalnızca aktif dersleri sayar. Ayarlar’daki **Ders arşivi** eski yapay zekâ derslerine ve bu derslerin notlarına erişim sağlar. Eski SQLite proje işaretleri TaskFlow sayfasında ayrı bir kontrol listesinde durur.

İngilizce arayüz ve önceki İngilizce dersler kullanılabilir. Yeni dersler ve sorular Türkçedir. Ders kimlikleri ve ilerleme iki dilde ortaktır.

## Yerelde çalıştırma

```sh
python -m http.server 8743 --bind 127.0.0.1
node --test tests/curriculum.test.cjs
```

Tarayıcıda `http://127.0.0.1:8743` adresini aç. Uygulama hazır statik dosyaları kullanır. Kurulum için [Türkçe rehbere](KURULUM_TR.md) veya [İngilizce rehbere](INSTALL_EN.md) bak.

Ders sırası, yeni dersler ve TaskFlow ölçütleri `curriculum.v6.js` içindedir. Eski ders kimliklerini ve soru/sözlük sıra numaralarını koru. Çevrimdışı kullanılan dosyalar değişirse service worker paketini ve ilgili sürüm adlarını birlikte güncelle.
