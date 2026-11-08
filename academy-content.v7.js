/* Turkish intensive programme. Stable lesson and question IDs preserve old backups. */
(() => {
'use strict';

const weeks = [
  ['Programlama ve C#', 'Programming and C#', 'Konsolda görevleri kaydet, tamamla ve listele.', 'backend bilgisayar kurulum degisken kontrol metot oop oop-tasarim oop-davranis git',
    ['İstek akışını çiz, SDK’yı kur ve ilk programı çalıştır.', 'Veri tipleri, operatörler ve kararları çalış.', 'Döngüler, metotlar ve koleksiyonlarla görev listesini yaz.', 'Sınıf, arayüz ve hata yönetimiyle konsolu düzenle.', 'Konsol projesini test et, Git dalında kaydet ve haftayı tekrarla.']],
  ['ASP.NET Core ve REST API', 'ASP.NET Core and REST APIs', 'Bir ürün API’sini gerçek HTTP istekleriyle doğrula.', 'internet http https-json minimal crud-akisi controller patch-api openapi',
    ['DNS, port ve HTTP isteğini Network sekmesinde izle.', 'JSON, REST ve durum kodlarını API laboratuvarında karşılaştır.', 'ASP.NET Core’da ilk GET ve POST yollarını yaz.', 'Controller ve DI ile ürün CRUD ve PATCH ekle.', 'İstek dosyasıyla hataları dene, OpenAPI sözleşmesini kontrol et.']],
  ['SQL, SQL Server ve EF Core', 'SQL, SQL Server and EF Core', 'Görevleri kalıcı SQL Server veritabanına taşı.', 'iliskisel sql aggregate sql-tasarim transaction sqlserver nuget-linq async cancellation ef relations migration',
    ['İki ilişkili tablo çiz, PK/FK ve temel sorguları çalış.', 'JOIN, GROUP BY, NULL ve veri yazma komutlarını dene.', 'Normalizasyon, indeks, ACID ve SQL Server bağlantısını çalış.', 'LINQ, async ve EF Core ile görevleri sorgula.', 'İlk migration’ı uygula, yeniden başlat ve görevlerin kaldığını kanıtla.']],
  ['Mimari ve güvenlik', 'Architecture and security', 'Kayıt, giriş ve kullanıcıya özel görev erişimi ekle.', 'dto di mimari solid-owasp problem middleware auth jwt config identity-kayit',
    ['DTO, DI ve servis sınırlarını çıkar.', 'Doğrulama ve hata sözleşmesini düzenle.', 'Middleware, loglama, yapılandırma ve secret yönetimini dene.', 'Identity, JWT doğrulama ve sahiplik akışlarını çalış.', 'İki hesapla başka kullanıcıya ait göreve erişimi sınayıp tekrar yap.']],
  ['Test, Docker ve yayınlama', 'Testing, Docker and deployment', 'Testi, imajı ve hazırlık ortamını doğrula.', 'test test-matrisi debug-mock paging cache docker cicd deploy',
    ['Birim testi, entegrasyon testi ve test double yaz.', 'Debugger ile bir hatayı üret ve regresyon testi ekle.', 'Sayfalama ve cache etkisini ölç.', 'Git dalında PR aç, CI’ı ve Docker imajını dene.', 'Hazırlık ortamında /health ve görev akışını doğrula.']],
  ['TaskFlow ve işe hazırlık', 'TaskFlow and interview preparation', 'Projeyi belgeleyip kodunu ve kararlarını anlat.', 'proje final-tasarim mulakat mulakat-vaka',
    ['TaskFlow modelini ve kabul kriterlerini hazırla.', 'Kategori, durum, öncelik ve filtreleri tamamla.', 'Yetki, doğrulama ve kalıcılık regresyonlarını çalıştır.', 'OpenAPI, README ve örnek isteklerle bir inceleme yap.', 'Hata ayıklama vakasını çöz ve kısa teknik mülakat provası yap.']]
];

const additions = [
  {
    id: 'bilgisayar', title: 'Program nasıl çalışır?', english: 'How software runs', terms: ['CPU', 'RAM', 'Compiler', 'Runtime', 'IDE', 'SDK'], ref: 'dotnet',
    expansion: 'CPU: Central Processing Unit. RAM: Random Access Memory. IDE: Integrated Development Environment. SDK: Software Development Kit.',
    definition: 'CPU komutları yürütür. Program çalışırken veriler RAM’de tutulabilir. C# derleyicisi kaynak koddan ara dil ve metadata üretir. .NET çalışma zamanı bu kodu çalıştırır. IDE, yazma ve hata ayıklama araçlarını bir araya getirir.',
    purpose: 'Derleme hatasını çalışma zamanı hatasından ayırmayı ve projenin niçin bazı makinelerde açılmadığını teşhis etmeyi öğrenirsin.',
    usage: 'Önce dotnet new console çalıştır. Program.cs dosyasına örneği yaz. dotnet build çıktısını oku, sonra dotnet run ile programı başlat. Modern .NET, .NET Core’un devamıdır. .NET Framework ayrı, ağırlıklı olarak Windows’a bağlı eski ürün ailesidir.',
    analogy: 'Tarif kaynak koddur. Mutfağın kullandığı hazırlanmış tarif derleme çıktısı, yemeği yapan mutfak da runtime gibidir.',
    code: 'int tamamlanan = 2;\nint toplam = 5;\nConsole.WriteLine($"Kalan: {toplam - tamamlanan}");',
    walkthrough: ['İki tam sayıyı değişkende tut.', 'Çıkarma ifadesi çalışırken hesaplanır.', 'Console.WriteLine sonucu terminale yazar.'],
    mistake: 'SDK ile runtime’ı karıştırmak. Geliştirme ve derleme için SDK gerekir.',
    exercise: 'Programı çalıştır ve Kalan: 3 çıktısını gör. Ardından değişken tipine metin ata ve ilk derleme hatasını oku. Sonra düzelt.',
    solution: 'int toplam = "beş" derlenmez. 5 sayısı veya önce doğrulanmış bir dönüşüm gerekir.',
    quiz: [
      ['Derleyici ne yapar?', ['C# kaynak kodunu derleme çıktısına dönüştürür','HTTP bağlantısını açar','SQL tablosunu oluşturur'],0,'Derleyici kaynak dili işler.'],
      ['dotnet build için ne gerekir?', ['Yalnızca web tarayıcısı','Uygun .NET SDK','SQL Server bağlantısı'],1,'SDK derleme araçlarını içerir.'],
      ['Yeniden başlatınca RAM’deki görev listesine ne olur?', ['Git’e gönderilir','Her zaman dosyada kalır','Kalıcı bir yere yazılmadıysa kaybolur'],2,'RAM’deki süreç durumu, kalıcı depolama yerine geçmez.'],
      ['Bir IDE’nin örnek katkısı hangisidir?', ['Breakpoint ve kod tamamlama','DNS adresi tahsisi','SQL transaction commit’i'],0,'IDE kod yazma ve hata ayıklama araçlarını birleştirir.'],
      ['Modern .NET’in .NET Core ile ilişkisi nedir?', ['Aynı ürün çizgisinin devamıdır','Bir SQL lehçesidir','Sadece tarayıcıda çalışan bir eklentidir'],0,'Modern .NET, .NET Core ürün çizgisini sürdürür.']
    ]
  },
  {
    id: 'oop-davranis', title: 'Soyutlama, çok biçimlilik ve istisnalar', english: 'Abstraction, polymorphism and exceptions', terms: ['OOP', 'Interface', 'Exception'], ref: 'csharp',
    definition: 'Soyutlama, kullanım için gerekli davranışı bir sözleşmeyle sunar. Çok biçimlilik, aynı sözleşmeye farklı uygulamalar bağlar. Kalıtım, gerçek bir alt tür ilişkisi için kullanılır. Exception, olağan akışı durduran bir hata bildirir.',
    purpose: 'Konsol ve test için aynı uygulama davranışını, değişebilir bir çıktı mekanizmasıyla sınarsın.',
    usage: 'Bir konsol projesine örneği koy. Kaynak türünü değiştirerek ana kodu düzenlemeden farklı çıktı davranışı elde et. Kullanıcı girdisini TryParse ile doğrula, beklenmeyen I/O hatasını uygun sınırda ele al.',
    analogy: 'Elektrik prizi bir sözleşmedir. Farklı cihazlar aynı prize takılır ve kendi işini yapar.',
    code: 'IBildirim bildirim = new KonsolBildirim();\nbildirim.Gonder("Görev tamamlandı");\n\ninterface IBildirim { void Gonder(string mesaj); }\nclass KonsolBildirim : IBildirim\n{\n    public void Gonder(string mesaj) => Console.WriteLine(mesaj);\n}',
    walkthrough: ['Çağıran kod arayüzü kullanır.', 'KonsolBildirim bu davranışı terminale yazar.', 'Testte mesajı listeye kaydeden ikinci bir uygulama oluşturabilirsin.'],
    mistake: 'Bütün exception’ları yakalayıp nedenini kaybetmek.',
    exercise: 'BellekBildirim yaz. Gönderilen mesajları bir listede tut. Hatalı görev numarası için TryParse ile kullanıcıya anlamlı yanıt göster.',
    solution: 'BellekBildirim, Gonder içinde listeye ekler. int.TryParse başarısızsa görev arama adımına geçme.',
    quiz: [
      ['Aynı arayüzü iki sınıfın uygulaması neyi sağlar?', ['Polymorphism','DNS çözümleme','Migration'],0,'Çağıran, aynı sözleşme üzerinden farklı davranış alır.'],
      ['Beklenen hatalı sayısal girdi için ne uygundur?', ['Her girdiyi int.Parse ile zorlamak','int.TryParse ile doğrulamak','Hatanın ardından varsayılan görevi silmek'],1,'TryParse olağan kullanıcı hatasını kontrol edilebilir sonuç olarak verir.'],
      ['Hangi ilişki kalıtıma daha uygundur?', ['Görev bir e-posta göndericisi kullanır','Görev bir listeye yazılır','Bir alt tür üst türün sözleşmesini karşılar'],2,'Kalıtım yerine geçebilme ilişkisini modelleyebilir.'],
      ['Arayüzle soyutlama hangi detayı saklar?', ['Davranışı uygulayan sınıfın iç işleyişini','Çağrı için gereken metot imzasını','Bütün hataları'],0,'Arayüz davranışın sözleşmesini görünür tutar.'],
      ['Bir dosya yazma hatasını sessizce yutarsan ne olur?', ['Kaydedildi sanılabilir','Derleyici veriyi yeniden üretir','Veri otomatik SQL’e taşınır'],0,'Çağıran hata bilgisini alamaz ve yanlış başarı gösterebilir.']
    ]
  },
  {
    id: 'patch-api', title: 'Ürün API’si, routing ve PATCH', english: 'Product API, routing and PATCH', terms: ['REST', 'PATCH', 'DTO', 'HTTP'], ref: 'controllers',
    expansion: 'PATCH bir HTTP metodudur. DTO, Data Transfer Object anlamına gelir.',
    definition: 'Routing, HTTP yöntemi ve yolunu bir işleyiciye bağlar. PATCH kaynağın belirli alanlarını değiştirmeyi ifade eder. JSON Patch bunun için kullanılabilen ayrı bir doküman biçimidir.',
    purpose: 'Ürün fiyatını değiştirirken adı ve stok adedini yanlışlıkla sıfırlamadan küçük bir güncelleme yaparsın.',
    usage: 'Controller için [HttpPatch("{id:int}/fiyat")], Minimal API için MapPatch kullan. Bu dersin sözleşmesi yalnızca fiyat alanını kabul eden JSON DTO kullanır. curl, Postman veya .http dosyasında isteği dene.',
    analogy: 'Ürün etiketindeki yalnızca fiyatı değiştirmek, bütün etiketi yeniden basmaktan daha dar bir işlemdir.',
    code: 'PATCH /api/urunler/7/fiyat HTTP/1.1\nHost: localhost:5088\nContent-Type: application/json\n\n{"fiyat":39.90}',
    walkthrough: ['Yöntem PATCH, kaynak kimliği 7 ve hedef alan fiyat.', 'Sunucu fiyatı pozitif sayı olarak doğrular.', 'Bulunan ürünün adını koru ve yeni fiyatı dön.'],
    mistake: 'Varsayılan DTO değerlerini eksik alanlar için uygulayıp mevcut bilgileri silmek.',
    exercise: 'Ürün API’sinde fiyatı güncelle. Olmayan ID için 404 ve negatif fiyat için 400 döndür. GET isteğiyle ürünün adının değişmediğini doğrula.',
    solution: 'Önce fiyat girdisini doğrula, ardından ürünü bul, yalnızca Fiyat alanını değiştir ve güncel yanıtı üret.',
    quiz: [
      ['Sadece fiyat değişecekse hangi sözleşme uygundur?', ['Tüm ürünü sil ve tekrar ekle','PATCH /api/urunler/7/fiyat','GET /api/urunler/7'],1,'PATCH belirli değişiklikleri ifade eder.'],
      ['ID yönlendirmedeki :int kısıtını geçemezse ne olur?', ['Bu route aday olmaz','Rastgele ürün seçilir','Fiyat otomatik sıfırlanır'],0,'Kısıt route eşleşmesini filtreler.'],
      ['Geçerli ID ile olmayan ürünün beklenen yanıtı nedir?', ['201','204','404'],2,'İşleyici kaynak bulunamadığını bildirir.'],
      ['Neden güncellemeden sonra GET çalıştırırsın?', ['Kaynak alanlarının ve kalıcılığın beklenen biçimde kaldığını görmek için','Yalnızca IP adresi bulmak için','POST’u tekrar göndermek için'],0,'GET yanıtı güncellenen ve korunması gereken alanları gösterir.'],
      ['Negatif fiyatı hangi katmanda reddetmelisin?', ['Yalnızca tarayıcıda','API’de ve gerekirse veritabanı kısıtıyla','Yalnızca README’de'],1,'Sunucu istemciden bağımsız olarak kuralı uygular.']
    ]
  },
  {
    id: 'sql-tasarim', title: 'SQL ile veri yazma ve tablo tasarımı', english: 'SQL writes and relational design', terms: ['SQL', 'DBMS', 'NULL', 'Index', 'Normalization'], ref: 'sql',
    expansion: 'SQL: Structured Query Language. DBMS: Database Management System. PK: Primary Key. FK: Foreign Key. ACID: Atomicity, Consistency, Isolation, Durability.',
    definition: 'DBMS veriyi depolar ve kuralları uygular. Normalizasyon, tekrar eden gerçekleri ayrı tablolara taşır. Constraint veri kuralını, indeks ise arama yolunu tarif eder.',
    purpose: 'Her göreve kategori adını kopyalamak yerine kategori tablosuna bağlarsın. Görevleri durum ve sahip üzerinden ararken uygun indeksi ölçebilirsin.',
    usage: 'SQL Server T-SQL, PostgreSQL ve MySQL kendi SQL lehçelerini kullanır. Örneğin SQL Server TOP veya OFFSET/FETCH, PostgreSQL ve MySQL LIMIT kullanabilir. Yazma işlemlerini önce eğitim veritabanında ve dar WHERE koşuluyla dene.',
    analogy: 'Bir dizinde soyadına göre sayfa bulmak indeks gibidir. Bir kişinin telefon numarasını bir rehberde tutup referans vermek normalizasyona benzer.',
    code: 'BEGIN TRANSACTION;\nINSERT INTO Gorevler (Baslik, Tamamlandi, Oncelik, KullaniciId)\nVALUES (\'Sorgu dene\', 0, 2, 1);\nUPDATE Gorevler SET Oncelik = 3 WHERE Id = 1;\nDELETE FROM Gorevler WHERE Id = 1 AND Tamamlandi = 1;\nSELECT Id, Oncelik FROM Gorevler WHERE Id = 1;\nROLLBACK;',
    walkthrough: ['INSERT yeni satır ekler. FK, KullaniciId değerinin mevcut olmasını ister.', 'UPDATE ve DELETE için hedef satırları önce SELECT ile gör.', 'ROLLBACK deneme yazılarını geri alır. NULL aramak için IS NULL kullan.'],
    mistake: 'İndeksi tüm sütunlara eklemek veya WHERE olmadan UPDATE çalıştırmak.',
    exercise: 'Örnek veritabanında kategori tablosu çiz. Hangi alanlara NOT NULL ve FK ekleyeceğini açıkla. SQL laboratuvarında UPDATE ve ROLLBACK dene.',
    solution: 'Kategoriler(Id, Ad) ve Gorevler(KategoriId) oluştur. Bir görevin kategorisi zorunluysa KategoriId için NOT NULL ve FK uygula.',
    practiceRoute: 'sql-lab',
    quiz: [
      ['Kategori adı her görevde tekrar ediyorsa hangi tasarım iyileştirir?', ['Ayrı kategori tablosu ve FK','Daha uzun metin alanı','Her görev için ayrı veritabanı'],0,'Ad bir yerde tutulur ve görevler kategoriye bağlanır.'],
      ['NULL alanı nasıl süzersin?', ['= NULL','IS NULL','== NULL'],1,'SQL’de bilinmeyen değeri IS NULL ile denetlersin.'],
      ['Bir UPDATE öncesi hangi sorgu riski azaltır?', ['Aynı WHERE ile SELECT','DROP TABLE','SELECT 1'],0,'SELECT etkilenecek satırları gösterir.'],
      ['İndeksin bir maliyeti nedir?', ['HTTP durum kodlarını değiştirir','Yazmalarda indeks de güncellenir','FK’yi otomatik kaldırır'],1,'İndeks sorguyu hızlandırabilir, yazma ve alan maliyeti getirir.'],
      ['ROLLBACK ardından ne beklersin?', ['Deneme transaction’ının yazıları geri alınır','Sadece SELECT silinir','Tüm veritabanı silinir'],0,'Transaction içindeki değişiklikler kalıcılaşmaz.']
    ]
  },
  {
    id: 'solid-owasp', title: 'SOLID ve temel API riskleri', english: 'SOLID and common API risks', terms: ['SOLID', 'OWASP', 'BOLA', 'DI'], ref: 'owasp',
    expansion: 'SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. OWASP: Open Worldwide Application Security Project. BOLA: Broken Object Level Authorization.',
    definition: 'SOLID değişebilir kod tasarımı için beş ilkedir. OWASP API riskleri, bir sistemin kimlik, nesne erişimi, girdi, kaynak tüketimi ve yapılandırma sınırlarını incelemeye yardım eder.',
    purpose: 'HTTP ayrıntıları ile iş kurallarını ayırır, bir kullanıcının başka kullanıcıya ait görev ID’sini deneyerek erişmesini engellersin.',
    usage: 'Controller DTO alır, servis iş kuralını uygular, veri erişimi doğrulanmış kimlikle kapsamı sınırlar. Parametreli sorgu kullan, istek sınırları belirle ve secret’ları loglama.',
    analogy: 'Kütüphane kartı kimliği gösterir. Özel arşive girmek için arşivin ayrıca erişim iznini kontrol etmesi gerekir.',
    code: '// Servis içinde, userId doğrulanmış kimlikten geliyor.\nvar gorev = await db.Gorevler.SingleOrDefaultAsync(\n    g => g.Id == id && g.SahipId == userId, cancellationToken);',
    walkthrough: ['Id hangi görev istendiğini söyler.', 'SahipId koşulu kullanıcı kapsamını sorguya ekler.', 'Aynı denetimi okuma, güncelleme ve silmede uygula.'],
    mistake: 'Sahip ID’yi istemcinin JSON gövdesinden alıp güvenmek.',
    exercise: 'GET, PUT ve DELETE için iki kullanıcıyla bir erişim matrisi yaz. Admin rolü varsa sahibi ve rolü ayrı senaryolarda test et.',
    solution: 'A kullanıcısı kendi görevini okuyabilir. B kullanıcısı A’nın görevini okuyamaz, değiştiremez veya silemez. Rol kuralı varsa yalnızca açıkça tanımlanan işleme izin verir.',
    quiz: [
      ['Kayıt kimliğini değiştirerek başkasının görevini okumak hangi risktir?', ['Cache miss','BOLA','Derleme hatası'],1,'Nesne seviyesinde izin atlanmıştır.'],
      ['Dependency Inversion örneği hangisidir?', ['Servisin bağımlılık sözleşmesine dayanması','Servisin doğrudan sabit parolaya bağlanması','Her sınıfın DbContext’ten türemesi'],0,'Üst seviye iş kuralı değişebilir altyapı ayrıntısından ayrılır.'],
      ['SQL enjeksiyonuna karşı ne kullanırsın?', ['Metin birleştirme','Gizli tablo adı','Parametreli sorgu'],2,'Parametre girdiyi SQL komutundan ayırır.'],
      ['Log’a hangi veri yazılabilir?', ['İstek kimliği ve süre','Bearer token','Kullanıcı parolası'],0,'İstek kimliği teşhis sağlar, kimlik bilgileri hassastır.'],
      ['Kaynak tüketimi riskine ne yardımcı olur?', ['Sınırsız sayfa boyutu','Sayfalama ve istek sınırı','Sadece endpoint adını değiştirmek'],1,'Sınırlar isteğin maliyetini denetler.']
    ]
  },
  {
    id: 'identity-kayit', title: 'Identity ile kayıt, giriş ve roller', english: 'Registration, sign-in and roles with Identity', terms: ['Identity', 'JWT', 'Hash', 'Authorization'], ref: 'identity',
    expansion: 'JWT: JSON Web Token. OIDC: OpenID Connect.',
    definition: 'ASP.NET Core Identity kullanıcı kayıtlarını, parola hash’lerini ve giriş akışını yönetir. Yetkilendirme politikası, kullanıcının hangi işlemleri yapabildiğini tanımlar.',
    purpose: 'Parola saklama ve doğrulamayı bakımı yapılan kütüphaneye bırakır, TaskFlow kayıtlarını her kullanıcı için ayrı erişim sınırında tutarsın.',
    usage: 'IdentityDbContext ve EF Core store ekle. AddIdentityApiEndpoints ile giriş servislerini kaydet, MapIdentityApi ile eğitim endpoint’lerini aç. Bu yerleşik bearer token biçimi Identity’ye özgüdür. Standart JWT için önceki dersteki sağlayıcı ve JwtBearer akışını kullan.',
    analogy: 'Resepsiyon kimlik kartını düzenler, oda kapıları kartın hangi odalara eriştiğini denetler.',
    code: '// IdentityUser ve AppDbContext tanımları gereklidir.\nbuilder.Services.AddIdentityApiEndpoints<IdentityUser>()\n    .AddRoles<IdentityRole>()\n    .AddEntityFrameworkStores<AppDbContext>();\nbuilder.Services.AddAuthorization();\nvar app = builder.Build();\napp.UseAuthentication();\napp.UseAuthorization();\napp.MapGroup("/auth").MapIdentityApi<IdentityUser>();\napp.MapGet("/api/ben", (System.Security.Claims.ClaimsPrincipal user) =>\n    Results.Ok(new { ad = user.Identity?.Name })).RequireAuthorization();',
    walkthrough: ['Kullanıcıyı /auth/register ile oluştur.', 'Doğru parola ile /auth/login isteğinden gelen erişim token’ını Authorization başlığında gönder.', 'Rolü kullanıcı kendi kaydında belirleyemez. Sahiplik, korunan her görevin sorgusunda denetlenir.'],
    mistake: 'Kendi hash algoritmanı yazmak veya parolayı hata kaydına eklemek.',
    exercise: 'Yerelde iki eğitim hesabı aç. Eksik token, doğru token ve başka kullanıcının görevine erişim için ayrı istekler yaz.',
    solution: 'Token eksikse 401, sahip kendi görevinde 200, diğer hesap için seçilen sözleşmeye göre 403 veya 404 bekle.',
    quiz: [
      ['Parola saklama için hangisi uygundur?', ['Düz metin','Kendi algoritman','Identity’nin parola hash mekanizması'],2,'Identity parola doğrulamasına uygun, bakımı yapılan bir bileşen sağlar.'],
      ['Identity API’nin yerleşik bearer token’ı standart JWT midir?', ['Kendi token biçimidir','Her zaman JWT’dir','Bir SQL anahtarıdır'],0,'Yerleşik biçim Identity’ye özgüdür.'],
      ['Normal kullanıcıya admin rolünü kim vermelidir?', ['Kayıt isteğinin gövdesi','Yetkili yönetim akışı','Herhangi bir görev sahibi'],1,'Rol yükseltme, yetki kontrolü gerektirir.'],
      ['Geçerli token başka kullanıcının görevine erişim sağlar mı?', ['Sahiplik politikası ayrıca karar verir','Otomatik olarak verir','Sadece token uzunsa verir'],0,'Kimlik doğrulama ile kaynak yetkisi ayrı adımlardır.'],
      ['Parola yanlışsa uygulama ne yapmalı?', ['Parolayı loglamalı','Girişi reddetmeli ve hassas bilgiyi saklamalı','Yeni kullanıcı oluşturmalı'],1,'Hatalı parola erişim vermez ve log’a yazılmaz.']
    ]
  },
  {
    id: 'debug-mock', title: 'Breakpoint, test double ve regresyon', english: 'Breakpoints, test doubles and regression', terms: ['Debugging', 'Mock', 'Regression'], ref: 'test',
    definition: 'Debugging beklenen ve gerçekleşen davranış arasındaki farkı izler. Test double, gerçek bağımlılık yerine geçen kontrollü bir uygulamadır. Mock, çağrı beklentilerini denetlemek için kullanılabilir.',
    purpose: 'Karmaşık loglar yerine problemi yeniden üretip tek bir hipotezi sınarsın. Dış bağımlılıkları denetleyerek hızlı test yazarsın.',
    usage: 'Önce bozuk girdiyi kaydet. IDE’de karar satırına breakpoint koy, Watch ile değişkenleri gör. Sonra hata için önce başarısız, düzeltmeden sonra başarılı olan bir test ekle.',
    analogy: 'Bisikletin hangi vitesinde ses geldiğini bulmak için önce aynı koşulu tekrar oluşturur, sonra bir parçayı değiştirirsin.',
    code: '// Sayfa 1 ilk kayıttan, sayfa 2 boyut kadar atlayarak başlar.\nint Offset(int sayfa, int boyut) => (sayfa - 1) * boyut;\nConsole.WriteLine(Offset(1, 10)); // 0\nConsole.WriteLine(Offset(2, 10)); // 10',
    walkthrough: ['sayfa * boyut hatası ilk 10 kaydı atlar.', 'İlk ve ikinci sayfayı aynı sabit sıralamayla dene.', 'Entegrasyon testinde gerçek sorgu sıralamasını da denetle.'],
    mistake: 'Her iç çağrıyı mock’layıp kullanıcı açısından davranışı sınamamak.',
    exercise: 'Sayfalama hatasını üret, breakpoint’te offset’i gör, iki test ekle ve hatayı düzelt.',
    solution: 'Sayfa numarası birden başlıyorsa (sayfa - 1) * boyut kullan. Aynı değerlerde Id gibi sabit bir sıralama ölçütü ekle.',
    quiz: [
      ['Hata ayıklamada ilk iş hangisi?', ['Hatanın tekrarlandığı girdiyi bulmak','Rastgele kod değiştirmek','Bütün logları silmek'],0,'Yeniden üretilebilir örnek değişiklik etkisini gösterir.'],
      ['Sayfa 1 ve boyut 10 için offset nedir?', ['10','0','1'],1,'İlk sayfa hiçbir satır atlamaz.'],
      ['Mock ne zaman yararlıdır?', ['SQL sağlayıcısı davranışını tek başına doğrulamak için','Bütün kodu atlamak için','Dış servise giden çağrıyı kontrollü sınamak için'],2,'Mock dış davranışı kontrol eder. Gerçek sağlayıcı için entegrasyon testi gerekir.'],
      ['Regresyon testi neyi korur?', ['Düzeltmenin sonradan bozulmasını yakalar','Portu otomatik açar','Sorguyu derlemeden hızlandırır'],0,'Daha önceki hata tekrar ederse test uyarır.'],
      ['Breakpoint üzerinde neye bakarsın?', ['Sadece tema rengine','Girdi, değişken değeri ve akışa','GitHub yıldızına'],1,'Debugger çalışma zamanı durumunu gösterir.']
    ]
  },
  {
    id: 'final-tasarim', title: 'TaskFlow durumları, kategorileri ve filtreleri', english: 'TaskFlow status, categories and filters', terms: ['CRUD', 'DTO', 'Foreign Key', 'Pagination'], ref: 'ef',
    definition: 'Bir TaskFlow görevi, başlık, durum, öncelik, sahip ve isteğe bağlı kategori taşır. Filtreleme seçilen alt kümeyi, sayfalama o kümenin sıralı bölümünü döndürür.',
    purpose: 'Veri modeli, HTTP sözleşmesi ve yetki denetimini bir araya getirip test edilebilir bir portföy projesi oluşturursun.',
    usage: 'Önce Durum ve Oncelik alanlarının izinli değerlerini belirle. Görev ve kategori için sahibin aynı olmasını doğrula. Filtreleri, sahip filtresinin üzerine uygula ve benzersiz bir sıralama kullan.',
    analogy: 'Kişisel bir ajandada önce kendi ajandanı açar, sonra kategoriye ve tarihe göre yaprakları ayırırsın.',
    code: '// Gorev DbSet sorgusu. userId doğrulanmış kimlikten alınır.\nvar liste = await db.Gorevler.AsNoTracking()\n    .Where(g => g.SahipId == userId && g.Durum == durum)\n    .OrderByDescending(g => g.Oncelik).ThenBy(g => g.Id)\n    .Skip((sayfa - 1) * boyut).Take(boyut)\n    .ToListAsync(cancellationToken);',
    walkthrough: ['Sahip ve durum birlikte süzülür.', 'Öncelik eşitliğinde Id sabit sıralama sağlar.', 'Sayfa boyutuna üst sınır koy. İstemciye yanıt DTO’su döndür.'],
    mistake: 'Liste filtresi uygulayıp ID ile güncelleme ve silme yollarını açık bırakmak.',
    exercise: 'Bir kategori ve iki öncelikte üç görev oluştur. Duruma göre filtrele. Diğer kullanıcının kategorisini ilişkilendirmeyi dene ve reddedildiğini göster.',
    solution: 'Kategori sorgusunu da sahibine göre sınırla. Aynı sahip içinde durum filtresini ve öncelik/Id sıralamasını doğrula.',
    quiz: [
      ['Sahip filtresi ne zaman uygulanmalı?', ['Sayfalama ve sonuç döndürmeden önce','Yanıt gönderildikten sonra','Sadece frontend’de'],0,'Filtreleme kullanıcının veri kümesini en başta sınırlar.'],
      ['Öncelik eşitse sayfalama nasıl kararlı olur?', ['Rastgele sırayla','Id gibi ikinci bir sıralama ölçütüyle','Her sayfada tüm veriyi döndürerek'],1,'Benzersiz sıralama eşit değerlerin konumunu belirler.'],
      ['Başkasının kategori ID’si gelirse ne yaparsın?', ['Doğrudan bağlarsın','Kategori adını değiştirirsin','Kategori erişimini doğrulayıp isteği reddedersin'],2,'Kategori de kullanıcıya ait korunan bir kaynaktır.'],
      ['TaskFlow yanıtına hangi veri konur?', ['Gereken görev alanlarından oluşan DTO','Identity tablosunun tamamı','Connection string'],0,'DTO istemci sözleşmesi için gerekli alanları taşır.'],
      ['Sayfa boyutuna neden üst sınır konur?', ['İsteğin bellek ve işlem maliyetini sınırlamak için','Git commit sayısını azaltmak için','Token imzasını değiştirmek için'],0,'Sınır, pahalı sorguları ve büyük yanıtları denetler.']
    ]
  },
  {
    id: 'mulakat-vaka', title: 'Teknik mülakat ve kod inceleme provası', english: 'Technical interview and code review rehearsal', terms: ['HTTP', 'JWT', 'DTO', 'Regression'], ref: 'test',
    definition: 'Kod incelemesi, davranışı ve riskleri somut örneklerle değerlendirir. Teknik mülakatta tanım, gerçek kullanım ve karar gerekçesi birlikte anlatılır.',
    purpose: 'Hazır cevap ezberlemek yerine hatayı yeniden üretir, etkisini ölçer ve düzeltmeni savunursun.',
    usage: 'Aşağıdaki kod için önce riski sesli anlat. Kullanıcı A ve B ile tekrarlanabilir istekler yaz. Düzeltmeden sonra regresyon testini göster.',
    analogy: 'Bir tamirci arızayı hangi koşulda gördüğünü ve onarımın neden işe yaradığını açıklar.',
    code: '// İnceleme vakası: bu sorguda hangi denetim eksik?\nvar gorev = await db.Gorevler.FindAsync(id);\nreturn gorev is null ? Results.NotFound() : Results.Ok(gorev);',
    walkthrough: ['FindAsync yalnızca kayıt anahtarına bakar.', 'A ve B hesaplarında aynı ID ile sonuçları karşılaştır.', 'Sahip koşulu ekle, yanıt DTO’suna dönüştür ve testi yeniden çalıştır.'],
    mistake: 'Bulguyu “güvensiz” diye etiketleyip etkisini ve nasıl yeniden üretileceğini yazmamak.',
    exercise: '10 dakikada kodu incele, iki istekle hatayı göster, düzelt ve 60 saniyede kararını anlat. Ardından eksik sıralamalı sayfalama için ayrı bir test öner.',
    solution: 'Kimlik doğrulanmış olsa bile sorgu B’nin görevini A’ya verebilir. Id ve doğrulanmış SahipId ile süz, 404 dön ve testi başka kullanıcıyla tekrarla.',
    quiz: [
      ['Kod incelemesinde en güçlü bulgu hangisi?', ['Yalnızca “güvensiz” demek','Başka kullanıcının kaydına erişen tekrar üretilebilir istek göstermek','Satır sayısını tartışmak'],1,'Bulguda etki, koşul ve doğrulama adımı bulunur.'],
      ['JWT anlatırken önce hangi ayrımı yaparsın?', ['Token doğrulama ve kaynağa yetki verme','C# ve SQL dosya uzantısı','Git ve terminal rengi'],0,'Geçerli kimlik her kaynağa erişim anlamına gelmez.'],
      ['Bir hata düzeltmesi sonrasında neyi gösterirsin?', ['Sadece ekran görüntüsü','Önce başarısız sonra başarılı olan regresyon testi','Sadece yeni commit mesajı'],1,'Test eski hatanın yeniden ortaya çıkmasını yakalar.'],
      ['Bir endpoint için 401 ve 404 ne anlatabilir?', ['İkisi de başarılı silme','401 eksik/geçersiz kimlik, 404 kaynağın bulunmaması veya gizlenmesi','401 veri formatı, 404 derleme'],1,'Durum kodları istemciye farklı eylem nedenleri verir.'],
      ['Performans kararını en iyi nasıl savunursun?', ['Değişiklikten önce ve sonra aynı yükte ölçümle','Framework popülerliğiyle','Her sonucu cache’leyerek'],0,'Aynı koşullardaki ölçüm kararın etkisini gösterir.']
    ]
  }
];

const references = {
  owasp: ['OWASP · API Security Top 10', 'https://owasp.org/API-Security/'],
  identity: ['Microsoft Learn · ASP.NET Core Identity API', 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0']
};

const moreQuestions = {
  internet: [
    ['Port 443 bu akışta neyi tanımlar?', ['Sunucudaki HTTPS hizmetini','İstemcinin SQL anahtarını','HTTP gövdesinin biçimini'],0,'Port, aynı IP üzerindeki hizmetleri ayırmaya yardım eder.'],
    ['Tarayıcı sertifika hatası verirse ilk nerede inceleme yaparsın?', ['DTO eşlemesinde','TLS ve sertifika zincirinde','SQL indeksinde'],1,'TLS doğrulaması uygulama isteği işlenmeden önce gelir.'],
    ['Frontend’in veritabanına doğrudan bağlanması yerine API kullanmanın nedeni nedir?', ['Sunucu erişim ve iş kurallarını uygulayabilir','Her istek 200 döner','DNS tamamen kalkar'],0,'API istemciden gelen isteği doğrular ve veri erişimini kontrol eder.']
  ],
  'oop-tasarim': [
    ['Görev durumunu yalnızca Tamamla metodu değiştiriyorsa ne kolaylaşır?', ['Kuralın tek yerde korunması','SQL Server kurulumu','HTTP bağlantı sayısı'],0,'Kapsülleme geçersiz durum değişikliklerini sınırlar.'],
    ['private setter olduğunda başka bir sınıf ne yapabilir?', ['Özelliği okuyup açık metodu çağırabilir','Setter’ı doğrudan çağırabilir','Derleyicinin denetimini kaldırabilir'],0,'Açık getter okumaya, metot ise kontrollü değişime izin verir.'],
    ['Görev sınıfında bildirim gönderimi değişecekse ilk hangi bağımlılığı düşünürsün?', ['Değişebilir bir arayüz veya ayrı servis','Görevin SMTP sınıfından türemesi','Her görevde ayrı parola alanı'],0,'Bileşim, görev modelini değişebilir bildirim mekanizmasından ayırır.']
  ],
  'nuget-linq': [
    ['Where çağrısının sonucu ne zaman dizi olur?', ['Where çağrılır çağrılmaz','ToArray ile sorgu yürütülünce','Paket derlenmeden önce'],1,'ToArray diziyi oluşturur ve ertelenmiş sorguyu yürütür.'],
    ['SQL’e çevrilebilen filtreyi ToList öncesinde yazmanın yararı nedir?', ['Daha az satır aktarılır','İndeks her zaman kaldırılır','Tüm sorgular cache’e girer'],0,'Veritabanı filtreyi uygulayıp gerekli satırları döndürebilir.'],
    ['Restore adımında hangi bilgi kullanılır?', ['Projede kayıtlı paket başvuruları','HTTP yanıt başlığı','Tarayıcının dili'],0,'Proje dosyası bağımlılıkları belirtir.']
  ],
  'https-json': [
    ['İstemcinin hangi yanıt türünü tercih ettiğini hangi başlık bildirir?', ['Accept','Location','Host'],0,'Accept tercih edilen yanıt medya türünü belirtir.'],
    ['POST yanıtı 201 ve Location verirse sonraki istek ne olabilir?', ['Konuma GET isteği','SQL tablosuna doğrudan DELETE','Aynı POST’u mutlaka tekrarlamak'],0,'Location oluşturulan kaynağa erişim adresi sunabilir.'],
    ['JSON’da false ile "false" arasındaki fark nedir?', ['İkisi de boolean','İlki boolean, ikincisi metin','İkisi de sayı'],1,'Tırnaklar JSON metni belirtir.']
  ],
  'crud-akisi': [
    ['PUT için tüm güncellenebilir alanları bekleyen API’ye eksik gövde gelirse?', ['Sözleşmeye göre doğrulama hatası ver','Eksik alanları sessizce sıfırla','Rastgele bir kaydı güncelle'],0,'Eksik zorunlu alan açıkça ele alınmalıdır.'],
    ['Başarılı liste isteğinde hiç görev yoksa tipik yanıt?', ['200 ve boş liste','201 ve yeni görev','401 ve parola'],0,'Koleksiyon vardır ancak sonuç kümesi boştur.'],
    ['Olmayan bir görev ID’sine GET için ne beklenir?', ['204 ve gizli veri','404','201'],1,'Kaynak bulunamadığında istemciye 404 bildirilir.']
  ],
  jwt: [
    ['Audience kontrolü neden yapılır?', ['Token bu API için mi üretildiğini doğrulamak için','Kullanıcının adresini bulmak için','Şifreyi çözmek için'],0,'Başka API için üretilmiş bir token kabul edilmemelidir.'],
    ['Süresi geçmiş token için hangi sonuç beklenir?', ['Korumalı uçta 401','Yeni göreve 201','Eski token’ı sonsuza dek kabul et'],0,'Süre doğrulaması artık geçerli olmayan kimlik bilgisini reddeder.'],
    ['İmzalı JWT’nin gövdesi hakkında ne varsayabilirsin?', ['İmza bütünlüğü denetler, gizlilik ayrıca gerekir','İçerik mutlaka şifrelidir','Her claim otomatik yetki verir'],0,'İmza ve şifreleme farklı koruma sağlar.']
  ],
  'test-matrisi': [
    ['POST 400 dönüyor ama satır ekleniyor. Teste ne eklemelisin?', ['İstek sonrası veri durumunu da doğrula','Yalnızca yanıt süresini ölç','Sadece yanıt başlığını değiştir'],0,'Davranış hem HTTP sonucu hem veri etkisidir.'],
    ['İki kullanıcı için erişim testi nasıl hazırlanır?', ['İki ayrı kimlik ve sahipliği bilinen görevlerle','Aynı token’ı iki isimle kullanarak','Sadece boş veritabanıyla'],0,'Farklı gerçek kimlikler kaynak sınırını gösterir.'],
    ['Test verisi diğer testten geliyorsa risk nedir?', ['Test sırasına ve yan etkilere bağlı sonuç','Her zaman daha hızlı sonuç','Daha iyi kapsam garantisi'],0,'Bağımsız test kendi koşulunu kurar.']
  ],
  cache: [
    ['Yazmadan sonra eski veriyi azaltmak için ne yaparsın?', ['İlgili anahtarı geçersiz kıl','Tüm kaynaklara aynı anahtarı ver','Önbellek süresini sonsuz yap'],0,'Sonraki okuma yeni kaynağa başvurur.'],
    ['Filtreli liste cache’inde anahtar neden filtreyi içermeli?', ['Farklı filtreler farklı yanıt üretir','DNS daha hızlı çalışır','SQL şeması değişir'],0,'Yanıtı belirleyen parametreler anahtarda ayırt edilir.'],
    ['Cache iyileştirmesini hangi ölçüm destekler?', ['Benzer yükte p95 gecikme ve hit oranı','Yalnızca dosya sayısı','Başlangıç portu'],0,'Gecikme ve hit oranı faydayı ve etkinliği gösterir.']
  ],
  docker: [
    ['Container’daki localhost nereyi gösterir?', ['Container’ın kendisini','Her zaman ana makineyi','Docker Hub’ı'],0,'Container kendi ağ bağlamında çalışır.'],
    ['127.0.0.1:8080:8080 eşlemesi neyi sınırlar?', ['Yerel makineden erişilen host portunu','SQL tablosundaki satır sayısını','SDK sürümünü'],0,'Host portu yerel arayüze bağlanır.'],
    ['Çok aşamalı Dockerfile’ın faydası nedir?', ['Son imajda derleme SDK’sını taşımak gerekmez','Bütün testler otomatik geçer','Veritabanı parolası kendiliğinden oluşur'],0,'Son aşama yalnızca çalışma çıktısı ve runtime içerebilir.']
  ],
  cicd: [
    ['Başarılı imajı hangi bilgiyle izlemek yararlıdır?', ['Commit kimliği veya değişmez imaj özeti','Rastgele port','Geliştiricinin ekran rengi'],0,'Dağıtımın hangi kaynaktan üretildiğini takip edersin.'],
    ['Bir PR testi başarısız olursa sıradaki güvenli adım?', ['Hatayı düzeltip kontrolleri yeniden çalıştır','Her durumda üretime al','Testleri sil'],0,'Başarısız kontrolü çözmeden yayına geçme.'],
    ['Continuous Delivery ile Deployment arasındaki fark?', ['Delivery yayına hazır tutar, Deployment otomatik yayına alabilir','İkisi de yalnızca Git clone’dur','Deployment test yazma dilidir'],0,'Otomatik üretim adımı ayrımı belirler.']
  ],
  openapi: [
    ['İstek gövdesinin beklenen biçimini nerede ararsın?', ['İlgili işlemin requestBody bölümünde','Git geçmişinin ilk satırında','SQL indeksinde'],0,'requestBody medya türü ve şemayı gösterir.'],
    ['Swagger UI’nin OpenAPI ile ilişkisi nedir?', ['OpenAPI belgesini görüntüleyen bir arayüz olabilir','Yalnızca SQL yedeği oluşturur','HTTP yetkisini tek başına uygular'],0,'Belge sözleşmeyi, arayüz sunumunu sağlar.'],
    ['Sözleşme 201 diyor ama sunucu 200 dönüyorsa ne yaparsın?', ['HTTP testiyle farkı göster, sözleşme ve uygulamayı uyumlu kıl','Farkı göz ardı et','Token’ı README’ye koy'],0,'İstemci uygulamanın gerçek davranışına güvenir.']
  ]
};

window.AcademyContent = { weeks, additions, references, moreQuestions };
})();
