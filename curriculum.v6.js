/* The old IDs are part of the local backup format. New lessons use new IDs. */
(() => {
'use strict';

const weeks = [
  ['İnternet ve istek akışı', 'The internet and request flow', 'Tarayıcıdan veritabanına giden yolu izle.', 'Trace a request from the browser to the database.', 'backend internet'],
  ['C# ve algoritma', 'C# and algorithms', 'Konsolda veri oku, karar ver ve sonucu hesapla.', 'Read data, make decisions and compute results in a console app.', 'kurulum degisken kontrol metot'],
  ['Nesne yönelimli programlama', 'Object-oriented programming', 'Görev durumunu sınıflar, davranış ve arayüzlerle modelle.', 'Model tasks with classes, behaviour and interfaces.', 'oop oop-tasarim'],
  ['.NET, NuGet, LINQ ve async', '.NET, NuGet, LINQ and async', 'Paket ekle, koleksiyon sorgula, I/O işlemlerini bekle.', 'Add packages, query collections and await I/O.', 'nuget-linq async cancellation'],
  ['HTTP, HTTPS, REST ve JSON', 'HTTP, HTTPS, REST and JSON', 'İsteği, yanıtı ve JSON sözleşmesini oku.', 'Read requests, responses and JSON contracts.', 'http https-json'],
  ['ASP.NET Core ve CRUD', 'ASP.NET Core and CRUD', 'Bellekte çalışan ilk görev endpoint’lerini yaz.', 'Write your first in-memory task endpoints.', 'minimal crud-akisi controller'],
  ['İlişkisel SQL ve SQL Server', 'Relational SQL and SQL Server', 'Anahtarları, sorguları ve transaction sınırlarını çalış.', 'Practise keys, queries and transaction boundaries.', 'iliskisel sql aggregate transaction sqlserver'],
  ['EF Core ve kalıcı veri', 'EF Core and persistent data', 'SQL Server’a bağlan, ilişki kur ve migration uygula.', 'Connect to SQL Server, map relationships and apply a migration.', 'ef relations migration'],
  ['DTO, DI ve servis mimarisi', 'DTOs, DI and service architecture', 'HTTP sözleşmesini iş kurallarından ve veri erişiminden ayır.', 'Separate the HTTP contract from business rules and data access.', 'dto di mimari'],
  ['Kimlik doğrulama ve güvenlik', 'Identity and security', 'JWT doğrula, görev sahipliğini denetle ve gizli bilgileri koru.', 'Validate JWTs, enforce task ownership and protect secrets.', 'auth jwt config'],
  ['Otomatik testler', 'Automated testing', 'İş kuralını, HTTP yanıtını ve SQL davranışını ayrı katmanlarda doğrula.', 'Verify business rules, HTTP responses and SQL behaviour at separate layers.', 'test test-matrisi'],
  ['Doğrulama, loglama ve cache', 'Validation, logging and caching', 'Hataları anlaşılır döndür, kayıtları incele ve önbelleği ölç.', 'Return readable errors, inspect logs and measure caching.', 'problem middleware paging cache'],
  ['Git ve Docker', 'Git and Docker', 'Değişikliği bir dalda izle ve çalıştırılabilir imaj üret.', 'Track a change in a branch and build a runnable image.', 'git docker'],
  ['Deployment ve CI/CD', 'Deployment and CI/CD', 'Testten geçen sürümü hazırlık ortamına taşı ve doğrula.', 'Move a tested release to staging and verify it.', 'deploy cicd'],
  ['OpenAPI ve API sözleşmesi', 'OpenAPI and the API contract', 'İstek, yanıt ve hata sözleşmelerini belgeleyip denetle.', 'Document and verify request, response and error contracts.', 'openapi'],
  ['TaskFlow final projesi ve portföy', 'TaskFlow capstone and portfolio', 'Görev yönetim API’sini uçtan uca doğrula ve sun.', 'Verify and present your task management API end to end.', 'proje mulakat']
];

const refs = {
  internet: ['MDN · How does the Internet work?', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work'],
  linq: ['Microsoft Learn · LINQ', 'https://learn.microsoft.com/en-us/dotnet/csharp/linq/'],
  jwt: ['Microsoft Learn · JWT Bearer', 'https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-10.0'],
  cache: ['Microsoft Learn · Output caching', 'https://learn.microsoft.com/en-us/aspnet/core/performance/caching/output?view=aspnetcore-10.0'],
  docker: ['Docker Docs · .NET', 'https://docs.docker.com/guides/dotnet/'],
  cicd: ['GitHub Docs · Building and testing .NET', 'https://docs.github.com/en/actions/tutorials/build-and-test-code/net'],
  openapi: ['Microsoft Learn · OpenAPI', 'https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi?view=aspnetcore-10.0']
};

const practiceRoutes = {
  internet: 'lab', http: 'lab', 'https-json': 'lab', minimal: 'lab', 'crud-akisi': 'lab',
  iliskisel: 'sql-lab', sql: 'sql-lab', aggregate: 'sql-lab', transaction: 'sql-lab',
  proje: 'project'
};

// Quiz tuples contain the question, three answers, the correct index, and feedback.
const additions = [
  {
    id: 'internet', title: 'DNS, IP, TCP ve bir isteğin yolculuğu', minutes: 18, ref: 'internet',
    terms: ['DNS', 'IP', 'TCP', 'HTTPS'],
    definition: 'DNS (Domain Name System), alan adının IP (Internet Protocol) adresini bulmaya yardım eder. TCP (Transmission Control Protocol), HTTP/1.1 ve HTTP/2 için sıralı ve güvenilir veri aktarımı sağlar. HTTPS, HTTP trafiğini TLS (Transport Layer Security) ile korur.',
    purpose: 'Bir sayfa açılmadığında alan adı çözümlemesini, bağlantıyı ve HTTP yanıtını ayrı ayrı inceleyebilirsin.',
    usage: 'Tarayıcıdaki Network sekmesinde bir HTTPS sayfasını yeniden yükle. Alan adını, HTTP yöntemini ve durum kodunu bul. Aşağıdaki akış HTTPS üzerinden HTTP/1.1 veya HTTP/2 için basitleştirilmiştir.',
    code: 'Frontend → DNS → IP adresi → TCP + TLS\nFrontend → HTTP isteği → API → backend iş kuralı → veritabanı\nFrontend ← HTTP yanıtı ← API ← sorgu sonucu',
    walkthrough: ['Tarayıcı DNS sonucunu önbellekten alabilir.', 'Sunucu sertifikası, bağlanılan alan adının doğrulanmasına yardım eder.', '404 yanıtı varsa HTTP sunucusuna kadar ulaşılmıştır.'],
    mistake: 'HTTP 404 ile DNS hatasını aynı sorun sanmak.',
    exercise: 'Network sekmesinde bir 200 isteği seç. Yöntemi ve adresi yaz. Sonra uygulamanın API laboratuvarında olmayan bir görevi iste ve 404’ü incele.',
    solution: 'Örnek: GET /api/gorevler/999 → 404. API isteği aldı ve kaydı bulamadı. DNS hatasında bir HTTP durum kodu gelmez.',
    quiz: [['DNS neyi bulmaya yardım eder?', ['HTTP durum kodunu', 'Alan adının IP adresini', 'Tablonun birincil anahtarını'], 1, 'DNS alan adını çözer. HTTP yanıtı daha sonra gelir.'], ['404 gördüğünde hangi çıkarım yapılabilir?', ['Bir HTTP sunucusu yanıt verdi', 'Alan adı hiç çözülemedi', 'Veritabanı kesinlikle kapalı'], 0, '404 bir HTTP yanıtıdır. Tek başına veritabanının durumunu açıklamaz.']]
  },
  {
    id: 'oop-tasarim', title: 'OOP: kapsülleme, arayüz ve bileşim', minutes: 22, ref: 'csharp',
    terms: ['OOP', 'Interface', 'Encapsulation'],
    definition: 'OOP (Object-Oriented Programming), nesnenin durumunu ve davranışını birlikte modeller. Kapsülleme, durumu hangi işlemlerin değiştirebileceğini sınırlar. Interface, uygulanacak davranışın sözleşmesidir.',
    purpose: 'Görevin durumunu her endpoint’in istediği gibi değiştirmesi yerine iş kuralını tek yerde tutarsın. Bileşim, bir nesnenin başka bir nesnenin davranışını kullanmasıdır.',
    usage: 'Bir konsol projesinde aşağıdaki sınıfı yaz. Benzer türlerin farklı biçimlerde aynı davranışı sunması gerektiğinde ortak bir arayüz kullan. Kalıtımı ancak alt tür gerçekten üst türün yerine geçebiliyorsa düşün.',
    code: 'var gorev = new Gorev();\ngorev.Tamamla();\nConsole.WriteLine(gorev.Tamamlandi); // True\n\nclass Gorev\n{\n    public bool Tamamlandi { get; private set; }\n    public void Tamamla() => Tamamlandi = true;\n}',
    walkthrough: ['Dış kod Tamamlandi değerini okuyabilir.', 'private set, doğrudan atamayı sınıfın içine sınırlar.', 'Daha sonra servis, bu nesneyi kullanarak tamamlama işini yürütür.'],
    mistake: 'Bir iş kuralını farklı endpoint’lere kopyalamak.',
    exercise: 'Arsivlendi durumunu ekle. Arşivlenmiş bir görev tamamlanmak istenirse işlemin başarısız olduğunu göster.',
    solution: 'Tamamla içinde önce Arsivlendi kontrolü yap. Arşivli görev için false döndür ve durumu koru. Diğer durumda Tamamlandi değerini true yapıp true döndür.',
    quiz: [['Kapsülleme için hangi değişiklik uygundur?', ['Tamamlandi setter’ını private yapmak', 'Her endpoint’te ayrı tamamlanma kuralı yazmak', 'Tüm alanları public field yapmak'], 0, 'Sınıfın metotları, durumun hangi kuralla değiştiğini denetler.'], ['Bileşim örneği hangisi?', ['Görev servisi bir bildirim arayüzü kullanır', 'Görev sınıfı tüm servislerden türetilir', 'HTTP yanıtı doğrudan tabloya dönüşür'], 0, 'Bileşimde bir nesne başka bir nesnenin davranışından yararlanır.']]
  },
  {
    id: 'nuget-linq', title: '.NET SDK, NuGet ve LINQ', minutes: 22, ref: 'linq',
    terms: ['SDK', 'NuGet', 'LINQ'],
    definition: 'SDK (Software Development Kit), proje oluşturma ve derleme araçlarını içerir. NuGet .NET paket yöneticisidir. LINQ (Language Integrated Query), C# içinde filtreleme, sıralama ve seçim ifadeleri yazmanı sağlar.',
    purpose: 'Paketle hazır bir kütüphane ekler, LINQ ile görevlerden ihtiyacın olan sonucu çıkarırsın. EF Core desteklediği LINQ sorgularını SQL’e çevirebilir.',
    usage: 'dotnet new console ile proje oluştur. Bir paket gerektiğinde dotnet add package komutu proje dosyasına PackageReference ekler. Örnek kod standart .NET kütüphanesiyle çalışır.',
    code: 'string[] gorevler = ["API", "SQL Server", "Test"];\nvar uzunlar = gorevler.Where(g => g.Length > 3)\n    .OrderBy(g => g).ToArray();\nConsole.WriteLine(string.Join(", ", uzunlar));\n// SQL Server, Test',
    walkthrough: ['Where öğeleri süzer, OrderBy sıralar.', 'ToArray sorguyu yürütür ve sonucu diziye alır.', 'dotnet restore proje dosyasındaki paketleri çözer.'],
    mistake: 'EF Core sorgusunda önce ToList çağırıp bütün tabloyu belleğe almak. Süzme ve sayfalamayı mümkünse veritabanına bırak.',
    exercise: 'Dizide 4 veya daha fazla karakterli adları uzunluğa göre sırala. Ayrı bir boş projede dotnet add package ile EF Core sağlayıcısı ekleyip proje dosyasını incele.',
    solution: 'gorevler.Where(g => g.Length >= 4).OrderBy(g => g.Length).ToArray(). Paket eklediğin projenin .csproj dosyasında PackageReference satırı görünür.',
    quiz: [['Listeyi süzmek için hangi LINQ metodu kullanılır?', ['OrderBy', 'ToArray', 'Where'], 2, 'Where bir koşula uyan öğeleri geçirir.'], ['NuGet paket başvurusu genellikle nereye yazılır?', ['.csproj dosyasına', 'HTTP header’a', 'SQL tablosuna'], 0, 'PackageReference derleme ve restore işlemlerine bağımlılığı bildirir.']]
  },
  {
    id: 'https-json', title: 'HTTPS, REST ve JSON sözleşmesi', minutes: 20, ref: 'http',
    terms: ['HTTPS', 'REST', 'JSON'],
    definition: 'HTTP (Hypertext Transfer Protocol), istek ve yanıt protokolüdür. HTTPS bunun TLS ile korunan biçimidir. REST (Representational State Transfer) bir mimari tarzdır. JSON (JavaScript Object Notation) veriyi temsil eden metin biçimidir.',
    purpose: 'İstemci ve sunucu aynı adres, yöntem, gövde biçimi ve yanıt kodu üzerinde anlaşır. Görev oluşturma ile listeleme bu sözleşmede ayrı işlemlerdir.',
    usage: 'API laboratuvarında POST ve GET’i karşılaştır. Gerçek bir istemcide JSON gövdesi gönderirken Content-Type başlığını ayarla. Oluşturma yanıtında Location yeni kaynağın adresini gösterebilir.',
    code: 'POST /api/gorevler HTTP/1.1\nHost: taskflow.example\nContent-Type: application/json\n\n{"baslik":"SQL çalış"}\n\n→ 201 Created\nLocation: /api/gorevler/42',
    walkthrough: ['URL kaynak koleksiyonunu belirtir, POST işlemi tanımlar.', 'JSON anahtarları çift tırnakla yazılır.', 'TLS aktarımı korur. Görev sahibini yine backend denetler.'],
    mistake: 'POST ile oluşturulan kaydın adresini veya doğrulama hatasının biçimini istemcinin tahmin etmesini beklemek.',
    exercise: 'Simülasyonda geçerli bir başlık ve boş bir başlık gönder. Durum kodlarını ve gövdeleri karşılaştır.',
    solution: 'Geçerli POST 201 döndürür. Boş başlık 400 döndürür ve görev listesine yeni kayıt eklenmez.',
    quiz: [['JSON gövdesinin biçimini hangi başlık bildirir?', ['Location', 'Content-Type', 'Authorization'], 1, 'Content-Type gövdenin medya türünü belirtir.'], ['HTTPS burada hangi işi yapar?', ['Görevin sahibini seçer', 'JSON alanlarını doğrular', 'Aktarım sırasında isteği ve yanıtı korur'], 2, 'TLS aktarımı korur. Yetki ve veri doğrulaması uygulamanın sorumluluğudur.']]
  },
  {
    id: 'crud-akisi', title: 'CRUD: görev ekle, oku, güncelle ve sil', minutes: 22, ref: 'api',
    terms: ['CRUD', 'Endpoint', 'HTTP'],
    definition: 'CRUD; Create, Read, Update, Delete yani oluşturma, okuma, güncelleme ve silme işlemleridir. Endpoint, yöntem ve yol üzerinden bir HTTP isteğinin çalıştırdığı giriş noktasıdır.',
    purpose: 'Her operasyonun yanıtını açıkça belirlemek, frontend’in sonucu doğru göstermesini ve testlerin anlaşılır olmasını sağlar.',
    usage: 'Önce tarayıcıdaki API laboratuvarında akışı dene. Sonra aynı sözleşmeyi ASP.NET Core projesinde uygulayıp .http dosyasından test et.',
    code: 'POST   /api/gorevler       → 201 + Location\nGET    /api/gorevler       → 200 + liste\nGET    /api/gorevler/42    → 200 veya 404\nPUT    /api/gorevler/42    → 200 veya 404\nDELETE /api/gorevler/42    → 204 veya 404',
    walkthrough: ['POST doğrulamadan sonra yeni kayıt oluşturur.', 'PUT örneğinde güncellenebilir alanların tamamını gönder.', '204 yanıtı gövde içermez.'],
    mistake: 'Başarısız işlemleri de 200 döndürerek hata ve başarıyı istemciye aynı göstermek.',
    exercise: 'Görev oluştur, ID’sini al, başlığını güncelle ve sil. Aynı ID ile GET çalıştır.',
    solution: 'Önce 201, ardından güncellemede 200 ve silmede 204 beklenir. Son GET için beklenen durum 404’tür.',
    quiz: [['Başarılı DELETE için 204 dönersen gövdede ne bulunur?', ['Silinen nesne', 'JSON hata nesnesi', 'Gövde bulunmaz'], 2, '204 No Content yanıtı gövde taşımaz.'], ['Yeni görevin adresini hangi başlıkla döndürebilirsin?', ['Location', 'Accept', 'Host'], 0, 'Location başlığı oluşturulan kaynağın URI’sini gösterebilir.']]
  },
  {
    id: 'jwt', title: 'JWT Bearer ve görev sahipliği', minutes: 24, ref: 'jwt',
    terms: ['JWT', 'Authentication', 'Authorization'],
    definition: 'JWT (JSON Web Token), claim denen kimlik veya yetki bilgilerini taşıyabilen token biçimidir. Bearer erişim token’ını istemci Authorization başlığında gönderir.',
    purpose: 'API, imzası ve bağlamı doğrulanmış bir erişim token’ından kimliği çıkarır. Daha sonra bu kimliğin istenen kayda erişip erişemeyeceğini kontrol eder.',
    usage: 'Microsoft.AspNetCore.Authentication.JwtBearer paketini ekle. Aşağıdaki kayıt kodunda Authority ve Audience ayarlarını güvenilir kimlik sağlayıcına göre doldur. Endpoint’i RequireAuthorization ile koru ve görevi doğrulanmış kullanıcı kimliğine göre süz.',
    code: '// Servis kaydı, builder.Build() öncesi\nbuilder.Services.AddAuthentication("Bearer").AddJwtBearer("Bearer", o =>\n{\n    o.Authority = builder.Configuration["Auth:Authority"];\n    o.Audience = builder.Configuration["Auth:Audience"];\n});\nbuilder.Services.AddAuthorization();\n// app.Build sonrası, endpoint kayıtlarından önce:\napp.UseAuthentication();\napp.UseAuthorization();',
    walkthrough: ['Authority, güvenilen üretici ve anahtarların keşfi için kullanılır. API imza, üretici, hedef ve süreyi denetler.', 'Token yoksa veya geçersizse korunan endpoint 401 verir.', 'Geçerli token yanlış kullanıcıya aitse kaynak sahipliğini ayrı kontrol et. Tasarıma göre 403 veya 404 döndür.'],
    mistake: 'Token’ı yalnızca çözümleyip imzasını doğrulamadan claim’lere güvenmek.',
    exercise: 'Korumalı bir görev isteğini üç biçimde test et: token yok, sahibi olan kullanıcı, başka bir kullanıcı.',
    solution: 'Beklenen durumlar sırasıyla 401, 200 ve seçtiğin sözleşmeye göre 403 veya 404. Test verisine kullanıcı A ve B için ayrı görev ekle.',
    quiz: [['Geçerli token görev sahipliğini garanti eder mi?', ['Evet, imza varsa', 'Hayır, kaynak ayrıca denetlenir', 'Sadece token uzun ise'], 1, 'Token kimliği doğrular. Yetki kontrolü o kimliğin bu kaynağa erişimini denetler.'], ['Token olmayan istemci için beklenen durum?', ['401', '201', '204'], 0, 'Korumalı endpoint kimlik doğrulama bilgisi ister.']]
  },
  {
    id: 'test-matrisi', title: 'TaskFlow için otomatik test matrisi', minutes: 22, ref: 'test',
    terms: ['Unit test', 'Integration test'],
    definition: 'Birim testi bir davranışı yalıtılmış biçimde çalıştırır. Entegrasyon testi birden fazla bileşenin birlikte davranışını sınar. xUnit, .NET için bir test çerçevesidir.',
    purpose: 'Doğrulama kuralını hızlı test edebilir, HTTP katmanının doğru kodu döndürdüğünü ve SQL Server’ın beklenen kısıtları uyguladığını ayrı ayrı kanıtlayabilirsin.',
    usage: 'xUnit projesinde Arrange–Act–Assert adımlarını izle. ASP.NET Core entegrasyonunda WebApplicationFactory ile uygulamayı başlat. SQL davranışı için ayrı, atılabilir SQL Server veritabanı kullan.',
    code: '// xUnit projesi; GorevKurallari uygulamadaki sınıf\n[Fact]\npublic void BosBaslik_Gecersizdir()\n{\n    var baslik = "   ";\n    var gecerli = GorevKurallari.BaslikGecerliMi(baslik);\n    Assert.False(gecerli);\n}',
    walkthrough: ['Arrange girdiyi hazırlar, Act davranışı çağırır, Assert sonucu doğrular.', 'POST entegrasyon testinde 400’ü ve kayıt oluşmadığını birlikte denetle.', 'SQL Server’a özgü davranışı SQLite veya bellek sağlayıcısı kanıtlamaz.'],
    mistake: 'Testi ortak ya da üretim veritabanına bağlamak.',
    exercise: 'Boş başlık için birim testi yaz. Entegrasyonda geçerli POST 201, boş POST 400, olmayan ID 404 ve başka kullanıcının görevine erişim için test ekle.',
    solution: 'Her test verisini kendisi hazırlasın. Geçerli POST sonrasında Location’daki kaynağı GET ile oku. Geçersiz POST sonrasında satır sayısının artmadığını doğrula.',
    quiz: [['SQL Server’a özgü bir migration nerede sınanır?', ['Atılabilir SQL Server veritabanında', 'Yalnızca xUnit mock ile', 'Tarayıcıdaki API simülasyonunda'], 0, 'Sağlayıcıya özgü SQL ve kısıtlar gerçek motorla sınanır.'], ['Boş başlığın iş kuralını en hızlı hangi test sınar?', ['Tam dağıtım testi', 'Birim testi', 'Ekran görüntüsü testi'], 1, 'Bu kuralı denetlemek için HTTP veya veritabanı gerekmez.']]
  },
  {
    id: 'cache', title: 'Caching: önbellek, TTL ve geçersiz kılma', minutes: 22, ref: 'cache',
    terms: ['Cache', 'TTL', 'HTTP'],
    definition: 'Cache, pahalı bir işlem sonucunu yeniden kullanmak için geçici saklar. TTL (Time To Live), kaydın ne kadar süre geçerli olacağını belirler.',
    purpose: 'Sık okunan ve seyrek değişen ortak veride gecikme ile veritabanı yükünü azaltabilirsin. Bunun bedeli, kısa süreli eski veri görme olasılığıdır.',
    usage: 'Aşağıdaki örnek, herkes için aynı olan bir GET yanıtına uygulanır. Kullanıcıya özel görev listesini herkese ortak bir anahtarla önbelleğe alma.',
    code: 'builder.Services.AddOutputCache();\nvar app = builder.Build();\napp.UseOutputCache();\napp.MapGet("/api/durumlar", () => new[] { "Açık", "Kapalı" })\n   .CacheOutput(p => p.Expire(TimeSpan.FromSeconds(30)));',
    walkthrough: ['İlk istek yanıtı üretir, uygun sonraki istekler sonucu yeniden kullanır.', 'Güncellenen veri için TTL veya yazma sonrasında geçersiz kılma planı gerekir.', 'Cache hit oranı ve yanıt süresini ölç; veritabanı asıl kaynaktır.'],
    mistake: 'Kullanıcı veya filtre farklı olsa bile tüm yanıtları aynı anahtarla saklamak.',
    exercise: 'Herkese açık bir liste oluştur. Handler’a geçici log koy ve iki kez aynı isteği gönder. Süre dolduktan sonra üçüncü isteği dene.',
    solution: 'İlk istek handler’ı çalıştırır. Uygun ikinci istek cache’ten karşılanır. TTL sonrasında handler yeniden çalışır.',
    quiz: [['Ortak cache için güvenli aday hangisi?', ['Kullanıcının özel görevleri', 'Herkese aynı görünen görev durumları listesi', 'Bearer token yanıtı'], 1, 'Herkese aynı olan düşük değişimli liste ortak önbelleğe uygundur.'], ['TTL hangi soruyu yanıtlar?', ['Kayıt ne kadar geçerli?', 'Kullanıcı kim?', 'Kaç SQL tablosu var?'], 0, 'TTL, önbellek girdisinin geçerlilik süresidir.']]
  },
  {
    id: 'docker', title: 'Docker imajı, container ve port eşleme', minutes: 25, ref: 'docker',
    terms: ['Docker', 'Container', 'Deployment'],
    definition: 'İmaj, uygulama ve çalıştırma ortamının paketidir. Container, bu imajın çalışan örneğidir. Dockerfile, imajı oluşturmak için talimatları tanımlar.',
    purpose: 'API’yi başka bir makinede aynı runtime ile başlatabilirsin. SQL Server bağımsız çalışır ve kalıcı verisi uygulama container’ından ayrı tutulur.',
    usage: 'Tek projeli TaskFlow.Api klasöründe .dockerignore ile bin, obj ve yerel secret dosyalarını hariç tut. Aşağıdaki Dockerfile dosyasını oluştur. Proje adın farklıysa DLL adını değiştir.',
    code: 'FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build\nWORKDIR /src\nCOPY . .\nRUN dotnet publish -c Release -o /out\n\nFROM mcr.microsoft.com/dotnet/aspnet:10.0\nWORKDIR /app\nCOPY --from=build /out .\nUSER $APP_UID\nEXPOSE 8080\nENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]',
    walkthrough: ['SDK katmanı derler. Son imaj yalnızca runtime ve çıktı içerir.', 'docker build -t taskflow-api . komutuyla imajı oluştur.', 'docker run --rm -p 127.0.0.1:8080:8080 taskflow-api komutuyla yerelde dene. SQL gerekiyorsa bağlantıyı çalışma anında sağla.'],
    mistake: 'Veritabanı parolasını Dockerfile’a yazmak veya container içindeki localhost’un ana makine olduğunu varsaymak.',
    exercise: 'İmajı oluştur ve /health endpoint’ini localhost:8080 üzerinden çağır. Container’ı durdurup tekrar başlat.',
    solution: 'İki çalıştırmada da /health 200 dönmeli. SQL Server ayrı çalışıyorsa container’ın erişebildiği bir adres ve çalışma zamanı yapılandırması kullan.',
    quiz: [['Çalışan imaj örneği nedir?', ['NuGet paketi', 'Container', 'Migration'], 1, 'İmaj paket, container onun çalışan örneğidir.'], ['SQL parolası nereye konur?', ['Dockerfile satırına', 'Herkese açık README’ye', 'Çalışma zamanı secret yapılandırmasına'], 2, 'Çalışma zamanı secret’ı imaj ve Git geçmişine girmez.']]
  },
  {
    id: 'cicd', title: 'CI/CD: derleme, test ve güvenli dağıtım', minutes: 24, ref: 'cicd',
    terms: ['CI/CD', 'Git', 'Deployment'],
    definition: 'CI (Continuous Integration), değişiklikleri düzenli birleştirip otomatik derleme ve testle doğrulamaktır. CD, Continuous Delivery (yayına hazır tutma) veya Continuous Deployment (başarılı değişikliği otomatik yayımlama) anlamına gelebilir.',
    purpose: 'Her pull request aynı kontrolleri geçer. Başarılı çıktıyı hazırlık ortamına taşıyıp üretime geçmeden önce gerçek HTTP akışını doğrulayabilirsin.',
    usage: 'API ve test projelerini içeren çözümün kökünde .github/workflows/ci.yml oluştur. Aşağıdaki örnek CI adımlarını çalıştırır. Dağıtım işini başarılı CI çıktısına ve seçtiğin ortam kurallarına bağla.',
    code: 'name: TaskFlow CI\non: [pull_request]\npermissions:\n  contents: read\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v6\n      - uses: actions/setup-dotnet@v4\n        with:\n          dotnet-version: "10.0.x"\n      - run: dotnet restore\n      - run: dotnet build -c Release --no-restore\n      - run: dotnet test -c Release --no-build',
    walkthrough: ['Runner temiz bir ortamda çalışır. Projeyi ve SDK’yı yükler.', 'Test başarısızsa doğrulama kırmızı görünür. Başarılı sürümün imajını etiketle.', 'Hazırlık ortamında /health ve görev akışını dene. Migration ve geri dönüş planını dağıtımdan önce gözden geçir.'],
    mistake: 'Her pull request’e üretim kimlik bilgileri vermek veya migration’ın her zaman güvenle geri alınabileceğini varsaymak.',
    exercise: 'Bir testin beklentisini bilerek bozup bir deneme PR’ında CI sonucunu izle. Beklentiyi düzelt ve başarılı çalışmayı doğrula.',
    solution: 'İlk çalıştırmada test adımı hata vermeli. Düzeltmeden sonra derleme ve testler yeşile dönmeli. Yayınlamadan önce çıktı sürümünü ve test sonucunu kaydet.',
    quiz: [['CI’nın görevi hangisi?', ['Her değişikliği koşulsuz üretime almak', 'Değişikliği otomatik derleyip test etmek', 'Gizli bilgileri repoya koymak'], 1, 'CI, değişikliğin ortak doğrulama adımlarını geçip geçmediğini gösterir.'], ['Hazırlık ortamında neyi doğrulamak gerekir?', ['Sadece imajın etiketi', 'Yalnızca README', 'Gerçek URL’den health ve görev akışı'], 2, 'Çalışma zamanı, ağ ve veritabanı ayarları ancak çalışan sistemde sınanır.']]
  },
  {
    id: 'openapi', title: 'OpenAPI ile API sözleşmesini belgelemek', minutes: 22, ref: 'openapi',
    terms: ['API', 'OpenAPI', 'JSON'],
    definition: 'OpenAPI, HTTP API yollarını, yöntemleri, girdi ve yanıt şemalarını tarif eden standarttır. Swagger UI gibi araçlar bu belgeyi okunabilir bir arayüzde gösterebilir.',
    purpose: 'Frontend geliştiricisi hangi alanları göndereceğini ve hangi hata kodlarını ele alacağını önceden görür. Sözleşme testi, belgenin gerçek davranışla uyuşmasını denetleyebilir.',
    usage: 'Microsoft.AspNetCore.OpenApi paketinin .NET 10 ile uyumlu sürümünü ekle. AddOpenApi ve MapOpenApi ile belgeyi geliştirici ortamında sun. Çalışan projede /openapi/v1.json adresini aç.',
    code: 'builder.Services.AddOpenApi();\nvar app = builder.Build();\nif (app.Environment.IsDevelopment()) app.MapOpenApi();\n\napp.MapGet("/health", () => TypedResults.Ok(new { durum = "ok" }))\n    .WithName("Health");\napp.Run();',
    walkthrough: ['AddOpenApi belge üretim hizmetini kaydeder.', 'MapOpenApi belge endpoint’ini eşler.', 'TaskFlow için 201, 400, 401 ve 404 yanıtlarını ilgili operasyonlarda belirt. HTTP testleriyle aynı kodları doğrula.'],
    mistake: 'OpenAPI belgesini, çalışan API’nin doğru yetki denetimi yaptığının kanıtı sanmak.',
    exercise: 'Belgede GET /health yolunu bul. Sonra görev POST işleminin istek gövdesini ve 201 ile 400 yanıtlarını tanımla.',
    solution: 'paths altında /health → get görünür. Görev POST’unda requestBody JSON DTO’yu, responses ise 201 başarı ve 400 doğrulama yanıtını tarif eder.',
    quiz: [['OpenAPI belgesi neyi tanımlar?', ['API yollarını ve istek/yanıt sözleşmelerini', 'Yalnızca Git commit’lerini', 'Veritabanının parolasını'], 0, 'Belge istemci ile sunucunun HTTP üzerinden nasıl konuştuğunu tarif eder.'], ['Belgelenen 400 yanıtı nasıl doğrulanır?', ['Şemayı PDF’e aktararak', 'Geçersiz bir HTTP isteğiyle test ederek', 'Veritabanı parolasını değiştirerek'], 1, 'Gerçek bir istek belgenin uygulama davranışıyla eşleştiğini sınar.']]
  }
];

const projectSteps = {
  tr: [
    'C# / ASP.NET Core ile TaskFlow API’yi oluştur. /health yanıtını yerelde dene.',
    'Görev ve kullanıcı sahipliğini modelle. SQL Server için migration üret, incele ve yerel eğitim veritabanına uygula.',
    'DTO ve servis katmanını kullanarak görev CRUD işlemlerini, filtrelemeyi ve sayfalamayı tamamla.',
    'JWT doğrulamasını ekle. Kullanıcı A’nın kullanıcı B’ye ait bir görevi okuyamadığını ve değiştiremediğini göster.',
    'Geçersiz başlık, bulunamayan görev, eksik token ve başarılı CRUD akışlarını otomatik testlerle doğrula.',
    'OpenAPI belgesini ve örnek HTTP isteklerini ekle. Geçersiz isteklerin ProblemDetails yanıtlarını kontrol et.',
    'Docker imajını yerelde çalıştır. CI’da derleme ve testleri, hazırlık ortamında HTTPS ve kalıcılığı dene.',
    'README’ye kurulum, test, örnek istek, veri modeli, migration ve dağıtım adımlarını yaz.'
  ],
  en: [
    'Create the C# / ASP.NET Core TaskFlow API and verify /health locally.',
    'Model tasks and ownership. Generate and review a SQL Server migration, then apply it to a local training database.',
    'Implement task CRUD, filtering and pagination using DTOs and a service layer.',
    'Validate JWTs and show that user A cannot read or modify user B’s task.',
    'Automate checks for invalid titles, missing tasks, missing tokens and successful CRUD.',
    'Add OpenAPI and sample HTTP requests. Verify ProblemDetails responses for invalid requests.',
    'Run the Docker image locally. Build and test in CI, then verify HTTPS and persistence in staging.',
    'Document setup, tests, HTTP examples, the data model, migrations and deployment in the README.'
  ]
};

const terms = [
  ['DNS', 'Web', 'Domain Name System. Alan adının IP adresini bulmaya yardım eder.', 'Kullanıcının sayısal adres yerine alan adıyla bağlanmasını sağlar.', 'Tarayıcı taskflow.example için adres çözümlemesi ister.', 'DNS sonucu bir HTTP yanıtı değildir.'],
  ['IP', 'Web', 'Internet Protocol. Ağ paketlerinin adreslenmesi ve yönlendirilmesiyle ilgilidir.', 'İsteğin hangi ağ hedefine gideceğini belirlemeye yardım eder.', '192.0.2.10, dokümantasyon için ayrılmış bir IPv4 adresi örneğidir.', 'Bir IP adresi tek bir web sitesiyle sınırlı değildir.'],
  ['TCP', 'Web', 'Transmission Control Protocol. Sıralı ve güvenilir bir bayt akışı sağlar.', 'HTTP/1.1 ve HTTP/2 bağlantıları bu aktarım protokolünü kullanır.', 'İstemci HTTPS için genellikle 443 numaralı porta bağlanır.', 'HTTP/3, TCP yerine QUIC kullanır.'],
  ['OOP', 'C#', 'Object-Oriented Programming. Durum ve davranışı nesnelerde toplar.', 'İş kurallarını durumu değiştiren davranışlarla birlikte tanımlamayı sağlar.', 'Gorev.Tamamla() görev durumunu değiştirir.', 'Her iş için bir kalıtım zinciri kurman gerekmez.'],
  ['NuGet', 'Araçlar', '.NET paket yöneticisidir.', 'Bağımlılıkların sürümlerini proje dosyasından çözmeye yardım eder.', 'dotnet add package Microsoft.EntityFrameworkCore.SqlServer', 'EF Core sağlayıcısı ile diğer EF Core paketlerinin sürümlerini uyumlu tut.'],
  ['SQL Server', 'Veri', 'Microsoft’un ilişkisel veritabanı motorudur. T-SQL lehçesini kullanır.', 'Görevleri ve sahiplik ilişkilerini kalıcı olarak saklar.', 'EF Core, UseSqlServer üzerinden bağlanır.', 'SQLite ve MySQL sorgu sözdizimiyle sağlayıcı özellikleri yer yer farklıdır.'],
  ['Cache', 'Web', 'Tekrar kullanılacak veriyi ya da yanıtı geçici saklayan önbellektir.', 'Tekrarlanan sorgu ve hesaplama yükünü azaltabilir.', 'Herkese açık görev durumları listesi 30 saniye saklanabilir.', 'Kişiye özel veriyi ortak bir anahtarla saklama.'],
  ['TTL', 'Web', 'Time To Live. Bir önbellek kaydının geçerli kalacağı süredir.', 'Verinin ne zaman yeniden üretilmesi gerektiğini sınırlar.', 'TimeSpan.FromSeconds(30) ile 30 saniyelik süre belirle.', 'Veri yazıldığında geçersiz kılma da gerekebilir.'],
  ['Docker', 'Araçlar', 'Container imajları oluşturmak ve çalıştırmak için kullanılan araçlardır.', 'Uygulamayı ve çalışma ortamını birlikte paketler.', 'docker build -t taskflow-api .', 'Parolayı imaja ekleme.'],
  ['Container', 'Araçlar', 'Bir imajdan başlatılan yalıtılmış çalışma ortamıdır.', 'Uygulamayı öngörülebilir bağımlılıklarla çalıştırır.', 'docker run --rm -p 127.0.0.1:8080:8080 taskflow-api', 'Kalıcı veriyi silinebilen container katmanına bağlama.'],
  ['CI/CD', 'Araçlar', 'Continuous Integration ve Continuous Delivery veya Deployment.', 'Değişikliği otomatik doğrular ve yayına hazırlar veya yayınlar.', 'Pull request açılınca GitHub Actions dotnet test çalıştırır.', 'Üretim erişimini pull request doğrulamasından ayrı tut.'],
  ['OpenAPI', 'Web', 'HTTP API sözleşmesini tanımlayan standarttır.', 'Yöntemleri, yolları, şemaları ve yanıtları istemciye belgeler.', 'ASP.NET Core /openapi/v1.json adresinde belge sunabilir.', 'Belgedeki davranışı gerçek HTTP testleriyle doğrula.']
];

function updateSqlTrack(lessons, english) {
  const sql = lessons.get('sql');
  sql.walkthrough.push(english
    ? 'SQL Server uses TOP (5) or ORDER BY with OFFSET/FETCH. The SQLite browser lab and MySQL use LIMIT 5. Use ORDER BY when you need a predictable subset.'
    : 'SQL Server’da TOP (5) veya ORDER BY ile OFFSET/FETCH kullanılır. Tarayıcıdaki SQLite ve MySQL’de LIMIT 5 kullanılır. Hangi satırların döneceğini belirlemek için ORDER BY ekle.');
  const ef = lessons.get('ef');
  ef.usage = english
    ? 'Install Microsoft.EntityFrameworkCore.SqlServer at a compatible 10.x version. Run dotnet list package --vulnerable --include-transitive. If it flags System.Security.Cryptography.Pkcs, add a direct reference to a patched 10.x release. Put the DbContext and entity below in a separate file.'
    : 'Microsoft.EntityFrameworkCore.SqlServer paketini uyumlu bir 10.x sürümüyle ekle. dotnet list package --vulnerable --include-transitive ile dolaylı paketleri de kontrol et. System.Security.Cryptography.Pkcs için uyarı çıkarsa güvenlik düzeltmesi içeren bir 10.x sürümünü doğrudan ekle. DbContext ve entity tiplerini ayrı bir dosyaya koy.';
  ef.walkthrough[3] = english
    ? 'SQL Server runs separately from the API. The browser lab uses SQLite to practise common SQL operations.'
    : 'SQL Server API’den ayrı çalışır. Tarayıcı laboratuvarı ortak SQL işlemlerini çalışmak için SQLite kullanır.';

  const migration = lessons.get('migration');
  migration.terms = migration.terms.map(term => term === 'SQLite' ? 'SQL Server' : term);
  migration.usage = english
    ? 'Use GorevDb and Gorev from the EF Core lesson. Set ConnectionStrings:Default in user secrets as shown in the SQL Server lesson. Run the commented commands separately in a terminal, against a fresh training database.'
    : 'EF Core dersindeki GorevDb ve Gorev tiplerini kullan. SQL Server dersindeki gibi ConnectionStrings:Default değerini user secrets ile tanımla. Yorumlardaki terminal komutlarını yeni bir eğitim veritabanına karşı ayrı ayrı çalıştır.';
  migration.code = migration.code.replace('builder.Services.AddDbContext<GorevDb>(o =>\n    o.UseSqlite("Data Source=gorevler.db"));',
    'var connection = builder.Configuration.GetConnectionString("Default")\n    ?? throw new InvalidOperationException("Missing ConnectionStrings:Default");\nbuilder.Services.AddDbContext<GorevDb>(o => o.UseSqlServer(connection));');
  migration.code = migration.code.replace(/(\/\/ dotnet ef migrations add IlkKurulum[^\n]*\n)/, '$1// dotnet ef migrations script --idempotent -o migration.sql\n');
  migration.walkthrough[1] = english
    ? 'UseSqlServer selects the SQL Server provider. Review the generated migration and script before applying them.'
    : 'UseSqlServer, SQL Server sağlayıcısını seçer. Uygulamadan önce üretilen migration’ı ve SQL betiğini incele.';

  const project = lessons.get('proje');
  project.title = english ? 'TaskFlow · Build your portfolio API' : 'TaskFlow · Portföy API’sini geliştir';
  project.definition = english
    ? 'TaskFlow is a C# / ASP.NET Core task management API backed by EF Core and SQL Server. A task has a title, status and owner. Begin with local CRUD and add verified identity and ownership before deploying.'
    : 'TaskFlow, C# / ASP.NET Core ile geliştirilen ve veriyi EF Core üzerinden SQL Server’da saklayan bir görev yönetim API’sidir. Görevin başlığı, durumu ve sahibi vardır. Yerel CRUD ile başla. Yayından önce kimlik doğrulama ve görev sahipliği denetimini ekle.';
  project.usage = english
    ? 'Use the local SQLite exercise to learn the HTTP flow if needed. In your own TaskFlow project, configure UseSqlServer and generate a new SQL Server migration. Work through the checklist from the API contract to staging.'
    : 'HTTP akışını denemek için istersen SQLite çalışma paketini kullan. Kendi TaskFlow projen için UseSqlServer yapılandır ve yeni bir SQL Server migration’ı üret. API sözleşmesinden hazırlık ortamına kadar proje kontrol listesini izle.';
  project.walkthrough = english
    ? ['Create an initial migration and apply it to a dedicated training database.', 'Return 400 for invalid titles and 404 for missing tasks. Require a validated identity and enforce ownership in every task operation.', 'Add filtering and pagination, then document the successful and error responses in OpenAPI.', 'Show that valid records survive a restart and that the API, tests and Docker image can be reproduced from the README.']
    : ['İlk migration’ı oluştur ve ayrı bir eğitim veritabanına uygula.', 'Geçersiz başlığa 400, bulunamayan göreve 404 döndür. Her görev işleminde kimliği ve sahipliği denetle.', 'Filtreleme ve sayfalama ekle. Başarı ve hata yanıtlarını OpenAPI’de belgele.', 'Yeniden başlatma sonrası verinin durduğunu ve README ile API, test ve Docker imajının yeniden çalıştırılabildiğini göster.'];
  project.code = 'GET    /api/gorevler       → 200\nGET    /api/gorevler/{id}  → 200 / 404\nPOST   /api/gorevler       → 201 / 400\nPUT    /api/gorevler/{id}  → 200 / 400 / 404\nDELETE /api/gorevler/{id}  → 204 / 404\n\nAuthorization: Bearer <access-token>\nContent-Type: application/json\n\n{"baslik":"SQL çalış","tamamlandi":false}';
}

function apply(course, lang) {
  const english = lang === 'en';
  const lessons = new Map(course.lessons.map(lesson => [lesson.id, lesson]));
  updateSqlTrack(lessons, english);
  course.archiveModules = course.modules.filter(module => module.id === 'ai');
  course.archiveLessons = course.lessons.filter(lesson => lesson.module === 'ai');
  course.legacyModules = { temel: 'hafta-1', csharp: 'hafta-2', api: 'hafta-5', veri: 'hafta-7', 'sql-derin': 'hafta-7', kalite: 'hafta-9', 'backend-pratik': 'hafta-6', proje: 'hafta-16' };
  course.resources = course.resources.filter(resource => !['ollama-chat', 'ollama-tools', 'onnx-rag'].includes(resource.id));
  Object.assign(course.refs, refs);

  for (const { quiz, ...lesson } of additions) {
    lessons.set(lesson.id, { ...lesson, language: 'tr', examples: [] });
    for (const [question, options, answer, explanation] of quiz) {
      course.questions.push({ id: course.questions.length, lesson: lesson.id, question, options, answer, explanation, code: '', kind: english ? 'TR' : 'Mini quiz', language: 'tr' });
    }
  }
  course.lessons = [];
  course.modules = weeks.map(([tr, en, trDesc, enDesc, ids], index) => {
    const number = index + 1;
    const id = 'hafta-' + number;
    for (const lessonId of ids.split(' ')) {
      course.lessons.push({
        ...lessons.get(lessonId), module: id, order: course.lessons.length + 1,
        practiceRoute: practiceRoutes[lessonId]
      });
    }
    const stage = Math.floor(index / 4);
    return {
      id, no: String(number).padStart(2, '0'),
      title: english ? `Week ${number} · ${en}` : `${number}. hafta · ${tr}`,
      desc: english ? enDesc : trDesc,
      icon: ['code', 'database', 'quiz', 'rocket'][stage],
      color: ['teal', 'blue', 'purple', 'green'][stage],
      days: english ? `Week ${number}` : `${number}. hafta`
    };
  });
  course.legacyProjectLength = course.projectSteps.length;
  course.projectSteps = [...course.projectSteps, ...projectSteps[lang]];
  for (const [term, category, definition, purpose, example, warning] of terms) {
    const localizedCategory = english ? ({ Veri: 'Data', Araçlar: 'Tools' }[category] ?? category) : category;
    course.glossary.push({ id: course.glossary.length, term, category: localizedCategory, definition, purpose, example, warning, language: 'tr' });
  }
  course.activeGlossary = course.glossary.filter(term => !['Yapay zekâ', 'AI'].includes(term.category));
  const activeIds = new Set(course.lessons.map(lesson => lesson.id));
  course.activeQuestions = course.questions.filter(question => activeIds.has(question.lesson));
}

window.AtolyeCurriculum = { apply };
})();
