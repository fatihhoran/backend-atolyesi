/* Each weekly contract matches the downloadable, local verification runner. */
(() => {
'use strict';
const projects = [
  {
    id: 'hafta-1', title: 'Konsolda görev yöneticisi', en: 'Console task manager',
    task: 'Bir oturumda görev ekleyen, tamamlayan ve listeleyen bir konsol uygulaması yaz. Geçersiz komutlar çalışmayı kesmesin.',
    starter: 'Console.ReadLine() ile komutları oku. Görevleri List<Gorev> içinde tut. Ekle, tamamla, liste ve cik komutlarını ayrı metotlara böl.',
    code: 'var gorevler = new List<Gorev>();\nwhile (Console.ReadLine() is { } satir && satir != "cik")\n{\n    // Komutu ayır, doğrula, sonucu yaz.\n}',
    criteria: ['Başlık boşsa görev oluşmaz.', 'Sıralı kimlik verilir ve liste sırayı korur.', 'Olmayan kimlik ve bozuk komut hata verir.'],
    hint: 'Split ile ilk boşluktan ayır. Sayı bekleyen yerde int.TryParse kullan. ID’yi listenin o anki konumuna bağlama.',
    solution: 'Görev nesnesi Id, Baslik ve Tamamlandi taşır. Ekle başlığı kırpar ve ID verir. Tamamla kimliğe göre nesneyi bulur. Liste görevleri ID sırasıyla çıktı sözleşmesine göre yazar.',
    command: 'node kontrol.mjs hafta-1 ./Konsol/bin/Release/net10.0/Konsol.dll',
    checks: ['ekleme-liste', 'tamamlama', 'gecersiz-girdi']
  },
  {
    id: 'hafta-2', title: 'Ürün yönetim API’si', en: 'Product management API',
    task: 'ASP.NET Core ile ürünler için CRUD ve fiyat güncellemesi geliştir. İlk sürüm için veri bellekte durabilir.',
    starter: 'dotnet new webapi -n UrunApi. Program.cs’de /health ekle. Controller veya Minimal API ile /api/urunler rotalarını eşle.',
    code: 'public record UrunOlustur(string Ad, decimal Fiyat);\npublic record FiyatDegistir(decimal Fiyat);\n// POST /api/urunler ve PATCH /api/urunler/{id}/fiyat',
    criteria: ['GET, POST, PUT, PATCH ve DELETE sözleşmeye uygun yanıt verir.', 'Negatif fiyat reddedilir.', 'PATCH ürün adını korur.', 'OpenAPI belgesi ürün rotasını içerir.'],
    hint: 'POST 201 yanıtında Location yaz. Ürün yoksa 404 dön. PUT tüm ürün alanlarını, PATCH yalnızca fiyatı değiştirir.',
    solution: 'İşlemleri bir servis arayüzü arkasına al. POST ve PUT için DTO’yu doğrula. PATCH işlemi için ayrı fiyat DTO’su kullan ve GET ile kalıcı olan alanları denetle.',
    command: 'node kontrol.mjs hafta-2 http://127.0.0.1:5088',
    checks: ['urun-crud', 'patch-ve-dogrulama', 'openapi']
  },
  {
    id: 'hafta-3', title: 'SQL Server kullanan Görev API', en: 'Task API with SQL Server',
    task: 'Bellekteki görev listesini EF Core üzerinden SQL Server’a taşı. İlk migration’ı üret ve yeniden başlatınca veriyi tekrar oku.',
    starter: 'ASP.NET Core başlangıç projesini aç. GorevDb, Gorev ve SQL Server sağlayıcısını ekle. Bağlantıyı user secrets ile ayarla.',
    code: 'builder.Services.AddDbContext<GorevDb>(options =>\n    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));',
    criteria: ['Migration yeni eğitim veritabanında uygulanır.', 'Geçersiz başlık reddedilir.', 'Kaydedilen görev uygulama yeniden başlatıldıktan sonra okunur.'],
    hint: 'İlk komut bir deneme görevi oluşturur ve kimliğini yerelde saklar. API sürecini durdurup tekrar başlattıktan sonra ikinci komutu çalıştır.',
    solution: 'AddDbContext ile sağlayıcıyı kaydet. Program kodundan ayrı bir EF migration üret ve SQL betiğini incele. POST için SaveChangesAsync çağır, GET için kimlikle sorgula.',
    command: 'node kontrol.mjs hafta-3 http://127.0.0.1:5088 hazirla\n# API sürecini yeniden başlat\nnode kontrol.mjs hafta-3 http://127.0.0.1:5088 dogrula',
    checks: ['gorev-yazma', 'kalicilik']
  },
  {
    id: 'hafta-4', title: 'Kimlik ve görev sahipliği', en: 'Identity and task ownership',
    task: 'Kayıt ve giriş akışını Identity ile kur. Her görevin sahibini doğrulanmış kullanıcı kimliğinden ata.',
    starter: 'SQL Server Görev API’sine IdentityDbContext ekle. /auth/register ve /auth/login yollarını Identity’ye bırak.',
    code: 'app.MapGroup("/auth").MapIdentityApi<IdentityUser>();\nvar tasks = app.MapGroup("/api/gorevler").RequireAuthorization();',
    criteria: ['Token olmadan 401.', 'Geçersiz token reddedilir.', 'İki farklı hesapla görev okuma, değiştirme ve silme yetkisi doğrulanır.'],
    hint: 'JSON içindeki sahip alanını kabul etme. UserManager.GetUserId(user) veya doğrulanmış claim kullan.',
    solution: 'Sahibi sunucuda bağla. Listeyi sahipliğe göre süz, ID ile işlemlerde aynı koşulu uygula. Başka sahibin kaydı için sözleşmeye göre 403 veya 404 dön.',
    command: 'node kontrol.mjs hafta-4 http://127.0.0.1:5088',
    checks: ['kayit-ve-giris', 'kimlik-zorunlu', 'gorev-sahipligi']
  },
  {
    id: 'hafta-5', title: 'Test, Docker ve hazırlık ortamı', en: 'Tests, Docker and staging',
    task: 'Testleri çalıştır. API’yi bir Docker imajında başlat ve /health, OpenAPI ile gerçek görev isteklerini dene.',
    starter: 'Dockerfile ve .dockerignore oluştur. SDK ile derle, runtime imajında çalıştır. Yerel SQL Server’a çalışma zamanı ayarıyla bağlan.',
    code: 'dotnet test -c Release\ndocker build -t taskflow-api .\ndocker run --rm -p 127.0.0.1:5088:8080 taskflow-api',
    criteria: ['Birim ve entegrasyon testleri geçer.', 'Container üzerinden health ve güvenli görev isteği çalışır.', 'OpenAPI belge ve HTTP yanıtı tutarlıdır.', 'Bir hazırlık ortamında aynı akışı doğrula.'],
    hint: 'Container içindeki localhost ana bilgisayar değildir. Bağlantı ve token bilgilerini imaja koyma.',
    solution: 'GitHub Actions PR açılınca build ve test yapar. Yerel container doğrulamasından sonra aynı imajı hedef ortamda ayağa kaldır ve kontrol listesini uygula.',
    command: 'dotnet test -c Release\nnode kontrol.mjs hafta-5 http://127.0.0.1:5088',
    checks: ['saglik', 'openapi', 'container-http']
  },
  {
    id: 'hafta-6', title: 'TaskFlow final ve kod incelemesi', en: 'TaskFlow capstone and code review',
    task: 'Görevlere durum, öncelik ve kategori ekle. Filtre ve sayfalama sözleşmesini tamamla, kodunu mülakat provasında anlat.',
    starter: 'GorevGuncelle DTO’suna Durum, Oncelik ve KategoriId ekle. Kullanıcıya ait Kategori tablosu ve ilgili migration’ı oluştur.',
    code: 'public record GorevYanit(int Id, string Baslik, bool Tamamlandi,\n    string Durum, int Oncelik, int? KategoriId);',
    criteria: ['Sahiplik görev ve kategori için korunur.', 'Durum filtresi ve sayfalama doğru sonuç döndürür.', 'README, Docker, OpenAPI, örnek istekler ve staging doğrulaması vardır.'],
    hint: 'Sahipliği filtrele, sonra duruma göre daralt, sonra kararlı sıralama ile sayfala.',
    solution: 'Test kullanıcısına kategori ekle. Farklı kullanıcıyla kategori ilişkilendirmesini reddet. Geçerli görevi durum ve sayfa boyutu ile sorgula. Kararlarını HTTP sözleşmesi ve erişim testiyle açıkla.',
    command: 'node kontrol.mjs hafta-6 http://127.0.0.1:5088',
    checks: ['gorev-sahipligi', 'kategori-ve-oncelik', 'filtre-ve-sayfa', 'openapi']
  }
];
window.AcademyPractice = { projects };
})();
