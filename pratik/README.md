# Atölye yerel pratik paketi

Bu paketi bir çalışma klasörüne aç. .NET 10 SDK ve Node.js 22 veya daha yenisi gerekir. Terminali bu README ile aynı klasörde aç. Haftalık kontroller yalnızca kendi makinen ve atılabilir eğitim veritabanın için tasarlandı. Deneme kullanıcıları eğitim veritabanında kalabilir.

## Hafta 1 · Konsol görevleri

```text
dotnet build Konsol -c Release
node kontrol.mjs hafta-1 ./Konsol/bin/Release/net10.0/Konsol.dll
```

Başlangıç projesi derlenir. Komutları tamamlayana kadar kontroller hata gösterir. Program standart girdiyi satır satır okur. Test modu için ek istem, menü veya boş olmayan açıklama satırı yazdırma.

| Girdi | Beklenen çıktı |
| --- | --- |
| `ekle SQL çalış` | `OK 1` ve sonraki yeni göreve yeni kimlik |
| `ekle   ` | `HATA baslik` |
| `tamamla 1` | `OK` |
| `tamamla x` | `HATA kimlik` |
| `tamamla 77` | Görev bulunmadığında `HATA bulunamadi` |
| `liste` | Her görev için `1|SQL çalış|tamam` biçiminde ayrı satır. Açık görev için `acik`, liste boşsa `BOS`. |
| Tanınmayan komut | `HATA komut` |
| `cik` | Çıktı vermeden kapat |

## Hafta 2 · Ürün API’si

API başlangıç projesini kopyalayarak çalış. İlk terminalde `dotnet run --project Api --urls http://127.0.0.1:5088` komutunu çalıştır. İkinci terminalde kontrolleri başlat.

```text
node kontrol.mjs hafta-2 http://127.0.0.1:5088
```

- Ürün yanıtı `id` (pozitif sayı), `ad` ve `fiyat` içerir. `GET /api/urunler` dizi döndürür.
- POST geçerli gövdede 201 ve Location, boş ad veya pozitif olmayan fiyatta 400 döndürür.
- ID ile GET ve PUT 200, olmayan ID için 404. PUT gövdesi `{ "ad": "Defter", "fiyat": 30 }`.
- `PATCH /api/urunler/{id}/fiyat` yalnızca `{ "fiyat": 39.90 }` alır ve 200 döndürür. Negatif fiyat 400. DELETE başarıda 204.
- ASP.NET Core OpenAPI belgesinde `GET /api/urunler` bulunur. Geliştirme ortamı için `ASPNETCORE_ENVIRONMENT=Development` ayarıyla çalıştır.

## Hafta 3 · SQL Server Görev API’si

Yeni bir API projesine SQL Server ve EF Core Design paketlerini uyumlu 10.x sürümünde ekle. SQL Server dersindeki `UseSqlServer` ve user secrets yönergesini uygula. Ayrı bir eğitim veritabanı oluştur. Migration üret, SQL betiğini incele, ardından `dotnet ef database update` çalıştır. `EnsureCreated` ile migration’ı aynı veritabanında karıştırma.

POST `/api/gorevler` gövdesi `baslik` alır, 201 ve `{ "id": 1, "baslik": "...", "tamamlandi": false }` biçiminde yanıt döndürür. Boş başlık 400. ID ile GET 200 veya 404. DELETE 204.

```text
node kontrol.mjs hafta-3 http://127.0.0.1:5088 hazirla
# API’yi durdur ve aynı veritabanıyla yeniden başlat
node kontrol.mjs hafta-3 http://127.0.0.1:5088 dogrula
```

İlk adım yerel kontrol dosyası oluşturur. İkinci adım geçersiz başlığı ve yeniden başlatma sonrası yazılan görevi sınar. Veritabanı sağlayıcısını ayrıca migration ve bağlantı ayarında doğrula. HTTP denemesi arka plandaki SQL motorunu ayırt edemez.

## Hafta 4 · Kayıt, giriş ve görev sahipliği

ASP.NET Core Identity ile `/auth/register` ve `/auth/login` ekle. Her ikisi başarılı durumda 200 döndürür. Token ile giriş `accessToken` döndürür. Identity’nin yerleşik biçimi bu yerel alıştırma için yeterlidir. JWT doğrulaması, ayrı bir standart sağlayıcı üzerinden ders olarak çalışılır.

Görev yollarında eksik ve geçersiz token 401. Başka bir kullanıcının görevi 403 veya 404. Kimlik, sunucunun doğruladığı token’dan gelir. `GET /api/gorevler` dizi veya `kayitlar` dizisi olan nesne döndürebilir.

```text
node kontrol.mjs hafta-4 http://127.0.0.1:5088
```

## Hafta 5 · Test, Docker, hazırlık ortamı

Test projesi için `dotnet new xunit -n TaskFlow.Tests` ve API referansı ile başla. Başlık doğrulaması için birim testi, `Microsoft.AspNetCore.Mvc.Testing` ve `WebApplicationFactory` ile HTTP entegrasyon testi yaz. SQL testlerini ayrı eğitim veritabanında çalıştır. Kök çözümde `dotnet test -c Release` kullan.

Docker dersindeki imajı yerel porta bağla ve `node kontrol.mjs hafta-5 http://127.0.0.1:5088` çalıştır. Kontrol HTTP davranışını doğrular. Hangi imajı, testleri ve hazırlık ortamını kullandığını PR veya README’de göster. Uygun bir hazırlık ortamın varsa HTTPS ve veritabanı kalıcılığını orada ayrıca dene.

## Hafta 6 · TaskFlow

- `POST /api/kategoriler` ad alır, 201 ve sayısal `id` döndürür. Sahip, DELETE ile kullanılmayan kategoriyi kaldırır ve 204 alır.
- Görev `durum` olarak `acik` veya `kapali`, `oncelik` olarak 1–3 ve isteğe bağlı `kategoriId` kabul eder. Başkasının kategorisi için 403 veya 404. Durum ve öncelik boş bırakılırsa açık ve normal öncelik varsayılanı kullan.
- `GET /api/gorevler?durum=acik&sayfa=1&boyut=1` yanıtında `toplam` filtreye uyan toplamı, `kayitlar` ilgili sayfayı içerir. Öncelik azalan, eşitlikte ID artan sıralama kullan.
- Açık ve hatalı istekleri belgeleyen OpenAPI, örnek istekler, README, Dockerfile ve CI kontrolünü tamamla. Uygulamanı başka bir klasöre alıp README ile sıfırdan çalıştır.
- Mülakat provasında tasarımını, bir güvenlik regresyonunu ve SQL migration kararını örnekle açıkla.

```text
node kontrol.mjs hafta-6 http://127.0.0.1:5088
```

Her kontrolden sonra `atolye-sonuc.json` dosyasını ilgili Atölye haftasında yükle. Başarısız kontrolleri terminalden incele ve düzeltip tekrar dene. Rapor, yerel öğrenme kaydıdır ve elle düzenlenebilir. Bu paket çalışma kodunu ve kimlik bilgilerini herhangi bir dış hizmete göndermez.
