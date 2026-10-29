/* New original teaching material; existing lesson/question IDs remain stable. */
(() => {
const C=window.COURSE;
C.version='2.0';
C.modules.splice(4,0,{id:'sql-derin',title:'SQL ile derinleş',desc:'SQL Server, toplama, transaction ve ilişkiler.',color:'orange',icon:'database'});
C.modules.splice(6,0,{id:'backend-pratik',title:'.NET pratiğini geliştir',desc:'Controller, sayfalama, iptal ve hata sözleşmeleri.',color:'blue',icon:'network'});
C.modules.forEach((m,i)=>{m.no=String(i+1).padStart(2,'0');m.days=(i+1)+'. hafta';});
C.refs.sqlserver=['EF Core SQL Server sağlayıcısı','https://learn.microsoft.com/en-us/ef/core/providers/sql-server/'];
C.refs.transactions=['EF Core transaction yönetimi','https://learn.microsoft.com/en-us/ef/core/saving/transactions'];
C.refs.relationships=['EF Core ilişkileri','https://learn.microsoft.com/en-us/ef/core/modeling/relationships/'];
C.refs.controllers=['Controller tabanlı Web API','https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-10.0'];
C.refs.pagination=['EF Core sayfalama','https://learn.microsoft.com/en-us/ef/core/querying/pagination'];
C.refs.errors=['API hata yönetimi','https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api?view=aspnetcore-10.0'];
function lesson(id,module,title,terms,definition,purpose,usage,code,walkthrough,mistake,exercise,solution,ref){return {id,module,title,terms,definition,purpose,usage,code,walkthrough,mistake,exercise,solution,ref,minutes:25};}
C.lessons.push(
lesson('sqlserver','sql-derin','C# API’yi SQL Server’a bağlamak',['EF Core','Connection string','SQL','DbContext'],
'SQLite bir dosya veritabanı, SQL Server ise ayrı bir servis olarak çalışan veritabanı sistemidir. EF Core bu farklı motorlarla provider adı verilen sağlayıcılar üzerinden konuşur. Aynı C# entity’leri kullanılsa da her motorun SQL dili ve desteklediği özellikler aynı değildir.',
'İş ilanlarında C# ve SQL Server birlikte sık görülür. İkisini bağlayan zinciri anlaman gerekir: endpoint → DbContext → provider → SQL bağlantısı → tablo. Bağlantı hatası ile sorgu hatasını ayırmak bu zinciri bilmekle kolaylaşır.',
'Çalışan bir SQL Server kurulumun ve yetkili bir veritabanın olmalı. .NET projesine Microsoft.EntityFrameworkCore.SqlServer paketinin kullandığın EF Core ile uyumlu 10.x sürümünü ekle. Bağlantıyı kod içine yazmak yerine configuration üzerinden oku. Aşağıdaki parça mevcut Program.cs’de servis kayıtları bölümüne eklenir.',
`using Microsoft.EntityFrameworkCore;
var connection = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Default bağlantısı eksik.");
builder.Services.AddDbContext<GorevDb>(options =>
    options.UseSqlServer(connection));

// Terminal: kendi makinenin bağlantısını gizli ayara koy.
// dotnet user-secrets init
// dotnet user-secrets set "ConnectionStrings:Default" "KENDI_BAGLANTIN"`,
['UseSqlServer sağlayıcıya özgü uzantıdır; NuGet paketi olmadan bulunmaz.','Bağlantı: sunucu, veritabanı, kimlik doğrulama ve güvenlik seçeneklerini taşır. Örnek bir parola paylaşılmaz.','Önce sunucuya erişimi, sonra kimliği, sonra veritabanı izinlerini denetle.','SQLite migration dosyalarını SQL Server için körlemesine kullanma. Birden fazla sağlayıcıyı destekliyorsan migration stratejisini ayrıca tasarla.'],
'Bağlanamadığında sertifika denetimini veya şifrelemeyi düşünmeden kapatmak. Önce hata mesajının bağlantı, kimlik, sertifika veya yetkiyle ilgili olduğunu belirle. Üretim bağlantı güvenliğini yerel kolaylık için zayıflatma.',
'Bir bağlantı hatasında hangi dört bilgiyi kontrol edersin? Gerçek secret değerlerini not defterine yazmadan sırala.',
'Sunucu adresi ve erişilebilir port; servis çalışıyor mu; kimlik doğrulama yöntemi; hedef veritabanı ve kullanıcının gerekli izni. Sertifika hatası varsa geçerli güven zincirini de incele.','sqlserver'),
lesson('aggregate','sql-derin','GROUP BY, COUNT ve HAVING',['SQL','SELECT','JOIN'],
'Toplama sorgusu, tek tek satırlardan bir özet çıkarır. COUNT satır sayısını, SUM toplamı, AVG ortalamayı üretir. GROUP BY aynı değeri paylaşan satırları gruplar. HAVING grup sonucu üzerinde koşul uygular.',
'Her kullanıcının kaç görevi olduğunu veya hangi kategorinin toplam tutarının yüksek olduğunu veritabanında hesaplayabilirsin. Bütün satırları C# uygulamasına çekip saymak, büyük veride gereksiz aktarım yaratır.',
'Görevleri kullanıcıya göre grupla. Önce WHERE satırları azaltır; sonra GROUP BY grupları kurar; HAVING grupları süzer. Aşağıdaki sorgu birden fazla görevi olan kullanıcıları bulur.',
`SELECT KullaniciId, COUNT(*) AS GorevSayisi
FROM Gorevler
GROUP BY KullaniciId
HAVING COUNT(*) > 1
ORDER BY GorevSayisi DESC;

-- COUNT(*) tüm satırları sayar.
-- COUNT(Aciklama) ise Aciklama null olanları saymaz.`,
['GROUP BY içindeki her kullanıcı ayrı grup olur.','SELECT’te toplama dışında seçilen alanlar GROUP BY ile uyumlu olmalıdır.','WHERE satırı, HAVING grup sonucunu sınar; bunlar birbirinin yerine geçmez.','JOIN ile satırlar çoğalıyorsa COUNT sonucunun neyi saydığını kontrol et. Gerekirse DISTINCT ile benzersiz anahtarları say.'],
'Birleştirmeden sonra artan satır sayısını gerçek görev sayısı sanmak. Sorgunun tane düzeyini, yani her satırın hangi varlığı temsil ettiğini önce belirle.',
'Gorevler tablosunda tamamlanan görev sayısını tüm kullanıcılar için tek değer olarak döndür. SQLite laboratuvarında 1/0, SQL Server’da bit alanı kullanıldığını dikkate al.',
'SELECT COUNT(*) AS Tamamlanan FROM Gorevler WHERE Tamamlandi = 1;','sql'),
lesson('transaction','sql-derin','Transaction ile tutarlılığı korumak',['Database','SQL','SaveChanges'],
'Transaction, birden fazla veri değişikliğini tek bir tamamlanma kararı altında toplar. İşlemlerin tamamı başarılıysa commit edilir; başarısızlıkta rollback ile geri alınabilir. Böylece yarım kalan bir işin tutarsız veri bırakması önlenir.',
'Bir stok azaltma ve sipariş oluşturma işlemi birlikte başarılı olmalı. Sadece sipariş kaydolup stok güncellenmezse uygulama yanlış bilgi sunar. Transaction bu tür ilişkili yazmalarda önemlidir.',
'EF Core destekleyen sağlayıcılarda tek SaveChanges çağrısındaki değişiklikleri varsayılan olarak transaction içinde yazar. Birden fazla SaveChanges çağrısını aynı işte birleştirmen gerekiyorsa açık transaction gerekebilir. Aşağıdaki parça mevcut db context’le çalışan bir metot içindir.',
`await using var tx = await db.Database.BeginTransactionAsync();
try
{
    db.Gorevler.Add(new Gorev { Baslik = "İlk kayıt" });
    await db.SaveChangesAsync();
    db.Gorevler.Add(new Gorev { Baslik = "İkinci kayıt" });
    await db.SaveChangesAsync();
    await tx.CommitAsync();
}
catch
{
    await tx.RollbackAsync();
    throw;
}`,
['BeginTransactionAsync bir transaction açar.','CommitAsync değişiklikleri kalıcı kabul eder.','RollbackAsync o transaction içindeki değişiklikleri geri alır.','Uzak HTTP çağrıları veya e-posta gönderimi veritabanı transaction’ıyla kendiliğinden geri alınmaz. Retry stratejisiyle birlikte kullanım ayrıca tasarlanır.'],
'Transaction’ı uzun süre açık tutup içine kullanıcı bekleme veya yavaş ağ çağrıları koymak. Kilitler ve kaynak tüketimi artabilir. Veritabanı transaction’ı ile bütün dağıtık işi aynı sanma.',
'Sipariş kaydedildikten sonra e-posta başarısız olursa veritabanı transaction’ı gönderilmiş e-postayı geri alabilir mi?',
'Hayır. Veritabanının dışında kalan yan etkiler ayrı tasarım ister. Daha ileri aşamada outbox ve tekrar denenebilir işleme gibi yaklaşımları inceleyebilirsin; ilk projede bu sınırı README’de açıkla.','transactions'),
lesson('relations','sql-derin','EF Core’da ilişkiler ve Include',['EF Core','Entity','Foreign key','LINQ'],
'EF Core’da navigation property nesneler arası ilişkiyi ifade eder. Foreign key veritabanındaki bağı taşır. Include, sorguyla ilişkili veriyi de getirmek için kullanılabilir; her sorguda bütün ilişkileri yüklemek gerekmez.',
'Görevi sahibiyle birlikte göstermek istediğinde ilişkiyi okuyabilirsin. Ancak API yalnızca kullanıcı adını istiyorsa bütün kullanıcı entity’sini taşımak yerine projection ile gereken alanları seçmek daha uygun olabilir.',
'Aşağıdaki sınıflar bir kullanıcının birçok görevi olduğu yeni bir model örneğidir. Aynı projede eski Gorev sınıfıyla ikinci kez tanımlama; mevcut modele uyarlayıp migration oluştur. Kod parçasında context içinde DbSet’lerin bulunduğu varsayılır.',
`// Sorgu parçası; Microsoft.EntityFrameworkCore ve System.Linq gerekir.
var sonuc = await db.Gorevler
    .AsNoTracking()
    .Select(g => new { g.Id, g.Baslik, KullaniciAdi = g.Kullanici.Ad })
    .ToListAsync();

// Entity içine eklenecek ilişki üyeleri:
// public int KullaniciId { get; set; }
// public Kullanici Kullanici { get; set; } = null!;`,
['Select, yalnızca gereken alanların taşındığı bir projection kurar.','Navigation’ı projection içinde kullanmak sağlayıcının uygun SQL üretmesine izin verir; Include her durumda zorunlu değildir.','Tam entity ile ilgili koleksiyonu istiyorsan Include seçeneğini değerlendir.','Döngü içinde her kayıt için ayrıca sorgu çalıştırmak N+1 problemi doğurabilir. Üretilen SQL’i gözlemle.'],
'API yanıtında iki yönlü navigation’ları doğrudan döndürüp döngüsel JSON veya gereksiz veri sızıntısı oluşturmak. İhtiyaca uygun response DTO seç.',
'İstemci yalnızca görev başlığı ve kullanıcı adını istiyorsa neden bütün kullanıcı sütunlarını döndürmeyebilirsin?',
'Gereksiz veri aktarımını ve hassas alanların yanlışlıkla açığa çıkmasını azaltmak için. Select ile ihtiyacın olan alanları belirle; erişim kontrolünü ayrıca uygula.','relationships'),
lesson('controller','backend-pratik','Controller tabanlı ASP.NET Core API',['ASP.NET Core','Routing','DTO'],
'Controller, ilişkili HTTP action’larını bir sınıfta toplayan API yaklaşımıdır. ControllerBase API davranışı için temel sınıftır. ApiController attribute’u parametre bağlama ve model doğrulama gibi API alışkanlıklarını etkinleştirir.',
'Bazı projelerde ve ilanlarda Minimal API yerine controller kullanılır. İkisi de ASP.NET Core üstündedir; HTTP metotları, DI, veri erişimi ve güvenlik kavramları ortaktır. Birini öğrenirken diğerindeki karşılığını görmek geçişi kolaylaştırır.',
'Program.cs içinde AddControllers ve MapControllers ekle. Sonra Controllers klasöründe aşağıdaki sınıfı oluştur. Bu endpoint yalnızca örnek veri döndürür; veritabanı kaydı yaptığını varsayma.',
`// Program.cs servis kaydı: builder.Services.AddControllers();
// Build sonrasında: app.MapControllers();
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class GorevlerController : ControllerBase
{
    [HttpGet("{id:int}")]
    public IActionResult Oku(int id)
        => Ok(new { Id = id, Baslik = "Örnek" });
}`,
['[controller] token’ı sınıf adındaki Controller son eki olmadan kullanılır: Gorevler.','HttpGet, action’a GET isteğini bağlar; route /api/Gorevler/1 olur.','IActionResult farklı HTTP sonuçlarının ortak arayüzüdür.','ApiController ile controller model doğrulamasındaki otomatik 400 davranışı ile Minimal API doğrulama mekanizmalarını karıştırma.'],
'Sadece controller sınıfını ekleyip MapControllers çağrısını unutmak. Action tanımları uygulamanın routing sistemine eşlenmelidir.',
'Bu örneğe /api/Gorevler/merhaba adresinde çalışan, gövdesi “Merhaba” olan GET action’ı nasıl eklersin?',
'[HttpGet("merhaba")]\npublic IActionResult Merhaba() => Ok("Merhaba");','controllers'),
lesson('paging','backend-pratik','Filtreleme, sıralama ve sayfalama',['LINQ','Pagination','SQL','Index'],
'Sayfalama, büyük sonuç kümesini küçük parçalar halinde istemciye vermektir. Filtre hangi kayıtların seçileceğini, sıralama hangi sırada geleceğini belirler. Bunlar C# LINQ ifadelerinden veritabanı sorgusuna dönüşebilir.',
'Binlerce görevi tek yanıtla göndermek hem sunucuyu hem telefonu yorar. Sunucuda sınır koymak yanıt büyüklüğünü kontrol eder. Sayfa boyutunu kullanıcının sınırsız büyütebilmesine izin verme.',
'Aşağıdaki kod, mevcut endpoint içindeki sorgu bölümüdür. Gelen sayfa ve boyut değerlerini doğrula veya sınırla. OrderBy’ı Skip/Take öncesinde koy. ToListAsync sorguyu çalıştırana kadar veriyi belleğe alma.',
`int guvenliSayfa = Math.Max(sayfa, 1);
int guvenliBoyut = Math.Clamp(boyut, 1, 50);
var liste = await db.Gorevler.AsNoTracking()
    .Where(g => !g.Tamamlandi)
    .OrderBy(g => g.Id)
    .Skip((guvenliSayfa - 1) * guvenliBoyut)
    .Take(guvenliBoyut)
    .Select(g => new { g.Id, g.Baslik })
    .ToListAsync();`,
['Where tamamlanmamış görevleri seçer.','OrderBy benzersiz Id ile tutarlı sıra kurar.','İkinci sayfa ve boyut 10 için ilk 10 satır atlanır, sonraki 10 istenir.','Çok ileri sayfalarda offset maliyeti büyüyebilir. Id > sonGorulenId ile keyset sayfalama daha ileri bir seçenektir.'],
'ToListAsync çağırıp bütün kayıtları aldıktan sonra Skip/Take uygulamak. Böyle yaparsan filtrelemeyi veritabanında sınırlama avantajını kaybedersin. Büyük sayfa değerleri için taşma ve girdi sınırlarını da düşün.',
'Üçüncü sayfada boyut 10 ise Skip değeri kaçtır? Neden boyut için üst sınır var?',
'Skip = (3 - 1) * 10 = 20. Take = 10. Üst sınır, tek isteğin aşırı veri ve kaynak tüketmesini sınırlar.','pagination'),
lesson('cancellation','backend-pratik','CancellationToken ve doğru async akış',['Async','Await','Task','Parameter'],
'CancellationToken, bir işin iptal edilmesinin istendiğini taşıyan işbirlikçi bir sinyaldir. İşlemi zorla kesmez; çağrılan kodun bu sinyali desteklemesi gerekir. HTTP istemcisi ayrıldığında gereksiz veri işini durdurmak için kullanılabilir.',
'Telefon bağlantısı kesilse veya kullanıcı başka ekrana geçse de sorgunun sonsuza kadar sürmesini istemezsin. Zaman aşımı ve istemci iptali kaynak kullanımını sınırlandırmaya yardımcı olur. Her iptal sunucu hatası değildir.',
'Minimal API handler’ına CancellationToken parametresi alıp EF Core’un asenkron çağrısına geçir. Aynı scoped DbContext’te sorguları Task.WhenAll ile paralel başlatma; context eşzamanlı kullanım için tasarlanmamıştır.',
`app.MapGet("/api/gorevler", async (
    GorevDb db, CancellationToken ct) =>
{
    var liste = await db.Gorevler
        .AsNoTracking()
        .ToListAsync(ct);
    return Results.Ok(liste);
});`,
['Token, ASP.NET Core tarafından istek iptal sinyaliyle ilişkilendirilir.','ToListAsync(ct) sağlayıcıya iptal isteğini iletir; destek ve zamanlama sağlayıcıya bağlıdır.','İptal ve gerçek bağlantı hatasını aynı log seviyesiyle körlemesine kaydetme.','async/await I/O beklemeyi düzenler; CPU işini otomatik hızlandırmaz.'],
'Token parametresini alıp hiçbir alt çağrıya geçirmemek. Bir başka hata, .Result ile tekrar bloklayan bir beklemeye dönmektir.',
'İstemci iptal ettiğinde CancellationToken veritabanını otomatik rollback eder mi?',
'İptal, daha önce commit edilmiş veriyi geri almaz. İşlem henüz sürüyorsa çağrının iptal desteği ve transaction davranışı önemlidir. Kaydın kesin sonucu için hata ve tutarlılık tasarımı gerekir.','async'),
lesson('problem','backend-pratik','ProblemDetails ve tutarlı hata yanıtları',['Status code','Exception','Logging','Validation'],
'ProblemDetails, HTTP API hatalarını ortak bir JSON yapısında ifade etmek için kullanılan standart biçimdir. type, title, status ve detail gibi alanlarla istemcinin hatayı düzenli yorumlamasına yardımcı olur.',
'Bir endpoint metin, diğeri rastgele nesne, üçüncüsü stack trace döndürürse istemcide hata yönetimi karmaşıklaşır. Tutarlı bir sözleşme hem kullanıcı mesajını hem gözlemlemeyi kolaylaştırır.',
'ASP.NET Core’da AddProblemDetails ve uygun hata middleware’i kullan. Aşağıdaki kod yeni boş web projesi için tam Program.cs örneğidir. Gerçek uygulamada ayrıntıları logda koruyup istemciye hassas bilgi vermeyen bir tasarım yap.',
`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
var app = builder.Build();
app.UseExceptionHandler();
app.MapGet("/api/gorevler/{id:int}", (int id) =>
    Results.Problem(statusCode: 404,
        title: "Görev bulunamadı",
        detail: $"{id} kimlikli görev mevcut değil."));
app.Run();`,
['Bu öğretim endpoint’i her Id için örnek 404 üretir; gerçek sorgu değildir.','HTTP durum kodu ile gövdedeki status tutarlı olmalıdır.','Beklenen doğrulama hataları ile beklenmedik exception’lar ayrı değerlendirilir.','Trace kimliği, kullanıcı hata raporunu sunucu loguyla ilişkilendirmeyi kolaylaştırabilir; secret veya stack trace değildir.'],
'Kullanıcıya SQL sunucu adresi, bağlantı bilgisi veya exception stack trace döndürmek. Sorunun teknik ayrıntıları kontrollü logda tutulmalı, kullanıcıya gerekli açıklama verilmelidir.',
'Boş görev başlığında 500 mü 400 mü beklenir? ProblemDetails kullanmak durum kodunu değiştirir mi?',
'Boş başlık beklenen girdi hatasıdır; bu uygulamada 400 uygundur. ProblemDetails bir yanıt biçimidir, bütün hataları 500 yapmaz.','errors')
);
// Stable lesson identifiers keep all existing progress and notes intact.
C.lessons.sort((a,b)=>C.modules.findIndex(m=>m.id===a.module)-C.modules.findIndex(m=>m.id===b.module));
C.lessons.forEach((l,i)=>l.order=i+1);

// Each pair adds a worked example plus an intentionally different scenario.
const extras={
backend:[['Bir siparişin yolculuğu','Bir müşteri sepetteki fiyatı 1 TL olarak gönderirse bu fiyatı sunucu otoritesi kabul etmez. Ürün kimliklerinden geçerli fiyatı ve stoğu yeniden okur. Kullanıcı ekranı güzel görünse bile backend’in sorumluluğu kuralları bağımsız uygulamaktır.','Telefon: ürünId=4, adet=2\nSunucu: ürün fiyatını oku → stok var mı? → toplamı hesapla\nVeritabanı: sipariş + satırları kaydet\nYanıt: 201 + hesaplanan toplam','İstemci girdisi, sunucu kararı ve kalıcı veri üç ayrı sorumluluktur.'],['Her istek veri yazmaz','Sağlık kontrolü veya uygulama sürümü endpoint’i veritabanına hiç gitmeyebilir. Backend’in varlığı her isteğin SQL çalıştırması gerektiği anlamına gelmez.','GET /health → 200 {"durum":"ok"}\nGET /api/gorevler → sorgu → 200 [...]','İki endpoint’in veri katmanına ihtiyacı farklıdır.']],
kurulum:[['Derleme hatası ile çalışma hatası','Eksik noktalı virgül derleme aşamasında bulunur. Var olmayan dosyaya erişme gibi sorunlar ise program başladıktan sonra ortaya çıkabilir. Önce derlemenin başarılı olup olmadığını ayır.','dotnet build\n# Başarılıysa:\ndotnet run','build hatasını görmeden program davranışını tartışma.'],['Aynı isim, farklı görev','Terminal komutları Program.cs içine yazılmaz. C# ifadeleri de komut satırına olduğu gibi yapıştırılmaz. Hangi aracın hangi girdiyi aldığını ayırmak başlangıçtaki birçok hatayı çözer.','TERMINAL: dotnet new console -n Deneme\nDOSYA Program.cs: Console.WriteLine("Merhaba");','Bu iki satır farklı yerlerde çalışır.']],
degisken:[['Null ile boş metin','Görev açıklaması hiç gönderilmemiş olabilir; bu null olabilir. Açıklama alanı gönderilip boş bırakılmışsa "" olur. İkisini iş kuralına göre aynı veya farklı ele alabilirsin.','string? not = null;\nstring mesaj = not ?? "Not eklenmedi";\nConsole.WriteLine(mesaj);','?? yalnızca null durumunda sağdaki değeri kullanır.'],['Metin sayıya nasıl dönüşür?','İstekten veya dosyadan gelen metin her zaman sayı değildir. TryParse, başarısızlığı exception yerine bool sonuçla ele almanı sağlar.','string girdi = "12";\nif (int.TryParse(girdi, out int adet))\n    Console.WriteLine(adet * 2);','Başarılıysa 24 yazılır. "on iki" girilirse blok çalışmaz.']],
kontrol:[['Erken çıkış ile kuralı sadeleştir','Başlık geçersizse metottan erken dönmek, başarılı akışı daha az iç içe blokla yazmanı sağlar. Web endpoint’te aynı yaklaşım erken hata yanıtına dönüşür.','static bool Uygun(string? baslik)\n{\n    if (string.IsNullOrWhiteSpace(baslik)) return false;\n    return baslik.Length <= 100;\n}','Geçersiz girdi altta devam etmez.'],['Döngüde veri erişimi','Her görev için ayrı kullanıcı sorgusu yapmak kayıt sayısıyla büyüyen çağrı üretir. Döngüyü yazmak kolay olsa da ilişkili veriyi uygun sorguyla almak gerekebilir.','10 görev + görev başına 1 kullanıcı sorgusu\n→ 1 liste sorgusu + 10 ek sorgu\n\nProjection/JOIN yaklaşımı\n→ Gereken veriyi uygun sorguda getir','Bu örnek N+1 düşüncesine giriş sağlar.']],
metot:[['Select ile dönüştür','Where öğeleri eler, Select ise her öğeden başka bir temsil üretir. İkisini peş peşe kullanabilirsin.','int[] sayilar = [1,2,3,4];\nvar sonuc = sayilar.Where(x => x % 2 == 0)\n    .Select(x => x * 10).ToList();\nConsole.WriteLine(string.Join(", ", sonuc));','Beklenen çıktı: 20, 40.'],['Listeyi değiştirmek ile sorgulamak','Where kaynak listeyi silerek değiştirmez. Yeni filtre görünümünü temsil eder; ToList sonucu ayrı liste olarak somutlaştırır.','List<int> kaynak = [1,2,3];\nvar filtre = kaynak.Where(x => x > 1).ToList();\nConsole.WriteLine(kaynak.Count); // 3\nConsole.WriteLine(filtre.Count); // 2','Filtrelemek, kaynakta Delete işlemi yapmak değildir.']],
oop:[['İki değişken aynı nesneyi gösterebilir','Referans tipinde atama, her zaman yeni nesne kopyası üretmez. Biri üzerinden yapılan değişiklik diğeri üzerinden de görülebilir.','var a = new Gorev { Baslik = "İlk" };\nvar b = a;\nb.Baslik = "Değişti";\nConsole.WriteLine(a.Baslik); // Değişti','a ve b aynı nesneye işaret eder; bu parça önceki Gorev tipini kullanır.'],['Kurallı değişiklik','Bir tamamlama kuralını tek metoda koymak, durumu farklı yerlerden tutarsız değiştirme olasılığını azaltabilir.','public void Tamamla()\n{\n    Tamamlandi = true;\n}\n// Gorev sınıfının içinde kullanılacak metot.','Bu parça tek başına Program.cs değildir; sınıf üyesidir.']],
di:[['Yaşam süresi karşılaştırması','Transient her çözümlemede, scoped her kapsamda, singleton container boyunca örnek paylaşımını ifade eder. Yanlış ömür seçimi beklenmedik ortak duruma neden olur.','builder.Services.AddTransient<IMesaj, Mesaj>(); // çözümleme başına\nbuilder.Services.AddScoped<IMesaj, Mesaj>();    // kapsam başına\nbuilder.Services.AddSingleton<IMesaj, Mesaj>(); // uygulama boyunca','Aynı servisi üç kez birlikte kaydetme; ihtiyaca göre birini seç.'],['Constructor injection','Controller veya servis bağımlılığı constructor parametresinden alabilir. new ile her seferinde somut sınıf üretmeye gerek kalmaz.','public class GorevServisi(IMesaj mesaj)\n{\n    public string Bilgi() => mesaj.Oku();\n}','IMesaj ve uygulaması önceki dersteki tanımlardır; servis DI’a kaydedilmelidir.']],
async:[['Task ile sonuç','Asenkron metodun dışarıya sunduğu değer Task içindedir. await sonucu alır. Sahte gecikme yalnızca akışı göstermek içindir.','static async Task<string> OkuAsync()\n{\n    await Task.Delay(50);\n    return "hazır";\n}\nConsole.WriteLine(await OkuAsync());','50 ms beklemek bir performans iyileştirmesi değildir.'],['Hata sınıflarını ayır','Bir timeout, beklenmedik programlama hatası ve geçersiz başlık aynı şey değildir. Kullanıcı girdisini doğrulama ile, uzak servis sorununu uygun exception ve politika ile ele al.','Girdi yanlış → 400\nKaynak yok → 404\nBeklenmedik sunucu hatası → genel 500 yanıtı + log','Bu bir düşünme haritasıdır; gerçek HTTP kodları API sözleşmesine göre seçilir.']],
http:[['Tekrarlanan POST','Aynı POST’u iki kez gönderirsen iki görev oluşabilir. İstemci bağlantı kopunca aynı isteği yeniden deniyorsa bunun iş açısından etkisini düşün.','POST /api/gorevler {"baslik":"Oku"} → Id 1\nPOST /api/gorevler {"baslik":"Oku"} → Id 2','Tekrar güvenliği (idempotency) özellikle ödeme gibi işlerde ayrıca tasarlanır.'],['Route ve query farkı','Bir kaynağın kimliği route içinde olabilir. Filtre, sıralama ve sayfa tercihi çoğunlukla query string’de ifade edilir.','GET /api/gorevler/7\nGET /api/gorevler?tamamlandi=true&sayfa=2','İlki belirli kayıt, ikincisi koleksiyon sorgusudur.']],
minimal:[['Bulunamadı yanıtı','Örnek veri listesi üzerinde önce kayıt bulunur. Yoksa 404, varsa 200 döndürülür. Bu parça existing app içinde MapGet satırı olarak kullanılabilir.','var adlar = new Dictionary<int,string> { [1] = "C#" };\napp.MapGet("/api/adlar/{id:int}", (int id) =>\n    adlar.TryGetValue(id, out var ad)\n        ? Results.Ok(new { id, ad }) : Results.NotFound());','Bellek listesi uygulama yeniden başlatıldığında başlangıca döner.'],['Route kısıtı','{id:int} route eşleşmesinde tür kısıtıdır. Bu, kimliği doğru olan kaydın mevcut olduğunu kanıtlamaz.','GET /api/gorevler/abc → int route’u eşleşmez\nGET /api/gorevler/99 → route eşleşebilir, kayıt olmayabilir','Routing ve veri sorgusu farklı aşamalardır.']],
dto:[['Fazla alan gönderimi','İstemci isAdmin=true gibi bir alan gönderse bile API sözleşmesinde bu alanı kabul etmek zorunda değilsin. İhtiyaca özel DTO, hangi girdileri kullanacağını açıklaştırır.','record YeniGorev(string? Baslik);\n// JSON: {"baslik":"Oku","isAdmin":true}\n// DTO isAdmin özelliği sunmaz.','Bilinmeyen alan davranışı serializer ayarlarına bağlıdır; DTO yetki denetiminin yerine geçmez.'],['Trim ve uzunluk sırası','Başta ve sonda boşlukları temizleyip sınırı o değer üzerinde uygulamak tutarlı bir kural oluşturur. Kuralın neyi saydığını açıkça tanımla.','var temiz = dto.Baslik?.Trim();\nif (string.IsNullOrEmpty(temiz) || temiz.Length > 100)\n    return Results.BadRequest();','Endpoint içi parça. string.Length kullanıcı algısındaki tüm karakterlerle bire bir aynı olmayabilir.']],
middleware:[['İstek ve yanıtın dönüş yolu','Middleware’de next öncesi kod istek ilerlerken, sonrası ise sonraki bileşen tamamlandığında çalışır. İç içe işleyişi kapılardan geçmek gibi düşünebilirsin.','A önce → B önce → endpoint\nA sonra ← B sonra ← yanıt','İkinci satırı sağdan sola oku: dönüşte önce B sonra A tamamlanır.'],['Yapılandırılmış log','Metni birleştirmek yerine isimli alan kullanmak log sisteminde alan bazlı sorgulamayı kolaylaştırır.','logger.LogInformation("Görev oluşturuldu {GorevId}", id);','logger ve id mevcut metot parametresi/üyeleridir; parola eklenmez.']],
iliskisel:[['Birden çoğa ilişki','Tek kullanıcıya ait üç görev için kullanıcı tablosunda bir satır, görev tablosunda üç satır bulunur. KullanıcıId aynı kullanıcıyı işaret eder.','Kullanicilar: 1 | Fatih\nGorevler: 1 | C# | KullaniciId=1\nGorevler: 2 | SQL | KullaniciId=1','Adı tekrar tekrar saklamak yerine anahtar kullanılır.'],['Null kuralı','İsteğe bağlı açıklama null olabilir; zorunlu başlık null olmamalıdır. Veritabanı kısıtları uygulama doğrulamasını destekler.','Baslik nvarchar(100) NOT NULL\nAciklama nvarchar(500) NULL','NOT NULL boş metni otomatik reddetmez; ayrıca uygulama kuralı gerekir.']],
sql:[['LEFT JOIN ile boş ilişki','Hiç görevi olmayan kullanıcıyı da raporda göstermek istiyorsan LEFT JOIN değerlendir. Sağ tablodan eşleşen kayıt bulunmazsa alanlar null olur.','SELECT k.Ad, g.Baslik\nFROM Kullanicilar k\nLEFT JOIN Gorevler g ON g.KullaniciId = k.Id;','Sorguyu SQL laboratuvarında çalıştır. İsimler SQLite örnek şemasıyla uyumludur.'],['Sıralama sonucu değiştirir','Sorguda ORDER BY yoksa veritabanının hangi sırayla sonuç döndüreceğine güvenme. Küçük örnekte düzenli görünmesi garanti değildir.','SELECT Id, Baslik FROM Gorevler ORDER BY Id DESC;','En büyük Id önce gelir. Bu bir zaman sıralaması yerine ancak Id politikasına göre kullanılabilir.']],
ef:[['Sorguyu çalıştıran adım','IQueryable üzerinde Where ve Select sorgu tanımlar. ToListAsync veya benzer bir sonlandırıcı veriyi getirir. Erken belleğe almak sonraki adımların SQL’de çalışmasını engeller.','var sorgu = db.Gorevler.Where(g => !g.Tamamlandi);\nvar liste = await sorgu.ToListAsync();','İlk satır sorguyu hazırlar, ikinci satır sonucu alır.'],['Sadece gereken alanlar','Liste ekranı için Id ve başlık yeterliyse entity’nin tüm alanlarını taşımana gerek yoktur. Projection yanıt sözleşmesini de sadeleştirir.','var liste = await db.Gorevler.AsNoTracking()\n    .Select(g => new { g.Id, g.Baslik }).ToListAsync();','EF Core kod parçası; uygun using ve db context gerektirir.']],
migration:[['Okuma ile yazma farkı','İzlenen nesnenin alanını değiştirmek kaydetme ihtiyacını ortadan kaldırmaz. SaveChangesAsync veritabanındaki sonucu belirleyen adımdır.','var gorev = await db.Gorevler.FindAsync(id);\nif (gorev is null) return Results.NotFound();\ngorev.Tamamlandi = true;\nawait db.SaveChangesAsync();\nreturn Results.NoContent();','Mevcut async endpoint içine eklenecek parça.'],['Şema değişikliğini incele','Bir sütunu yeniden adlandırırken migration yanlışlıkla silme ve ekleme üretebilir. Özellikle gerçek veri üzerinde dosyayı incelemeden uygulama.','dotnet ef migrations add AciklamaEkle\n# Üretilen Up ve Down adımlarını incele.\ndotnet ef database update','Komutun başarılı olması veri kaybı riski olmadığı anlamına gelmez.']],
auth:[['Kayıt sahipliği','Route’ta görevin Id’sini almak yeterli değildir. Sorgu, giriş yapan kullanıcının güvenilir kimliğiyle de sınırlandırılmalıdır.','var gorev = await db.Gorevler.SingleOrDefaultAsync(g =>\n    g.Id == id && g.KullaniciId == kullaniciId);','kullaniciId doğrulanmış kimlikten alınır; kullanıcıdan gelen serbest bir query parametresine güvenilmez.'],['401 ve 403 ayrımı','Geçerli kimlik yoksa 401, kimliği bilinen kullanıcı için izin yoksa genellikle 403 düşünülebilir. Kaynağın varlığını gizlemek için bazı tasarımlar 404 kullanır.','Kimlik yok → authentication\nKimlik var, izin yok → authorization','Yanıt politikasını API sözleşmesinde tutarlı uygula.']],
config:[['Ortam değişkeni anahtarı','Hiyerarşik configuration anahtarı ortam değişkeninde çift alt çizgiyle ifade edilebilir. Değer deployment ortamında sağlanır.','ConnectionStrings__Default=KENDI_BAGLANTIN\n\n// Kod:\nvar cs = builder.Configuration.GetConnectionString("Default");','Bu bir gerçek bağlantı örneği değildir; secret paylaşılmaz.'],['Sızan anahtar','Dosyayı silmek bütün kopyaları ortadan kaldırmaz. Anahtarın geçerliliğini sonlandırıp yenisini üretmek ilk adımdır.','Sızıntıyı fark et → anahtarı iptal et → yenisini sağla\n→ erişim izlerini incele → geçmiş temizliğini planla','Git geçmişi ve loglar da kopya içerebilir.']],
test:[['Sınır değeri testi','100 karaktere izin veriliyorsa 99, 100 ve 101 karakteri düşün. Kuralın tam sınırda doğru çalışması normal örnek kadar önemlidir.','Girdi uzunluğu 99 → geçerli\nGirdi uzunluğu 100 → geçerli\nGirdi uzunluğu 101 → geçersiz','Beklenen sonucu iş kuralı belirler.'],['API akışını test et','Integration testte gerçek HTTP isteği üretip yanıtı, gövdeyi ve kayıt etkisini birlikte doğrularsın. Test verisini gerçek kullanıcı kayıtlarından ayır.','POST geçerli görev → 201\nYanıttaki Id ile GET → 200 ve aynı başlık\nPOST boş başlık → 400 ve kayıt sayısı değişmez','HTTP sonucu ile veri etkisi birlikte ele alınır.']],
git:[['Commit öncesi inceleme','Yanlışlıkla veritabanı dosyasını veya secret’ı hazırlama alanına eklemek mümkündür. Commit öncesi hangi değişikliğin gideceğini kontrol et.','git status\ngit diff\ngit diff --staged','status dosya durumunu, staged diff sıradaki commit içeriğini gösterir.'],['Bir değişiklik, anlaşılır açıklama','Birbirinden ilgisiz on özelliği aynı commit’e toplamak incelemeyi zorlaştırabilir. İşlevsel ve açıklanabilir küçük adımlar tercih et.','İyi: "Boş görev başlığını reddet"\nBelirsiz: "son son düzeltme 3"','Mesaj, değişikliğin anlamını anlatmalıdır.']],
mimari:[['Sorumluluk sınırı','Fiyat hesaplama kuralını HTTP status code ile aynı sorumluluk sanma. Kural başka bir arayüzde de çalışabilir; HTTP yanıtı web sınırına özgüdür.','İş kuralı: toplam = adet × birimFiyat\nHTTP sınırı: geçersiz adet → 400\nVeri sınırı: siparişi kaydet','Katman sayısını değil bu ayrımın faydasını düşün.'],['Soyutlama ihtiyacı','DbContext zaten birçok veri erişim görevini sunar. Üzerine katman eklemeden önce test sınırını, tekrar eden davranışı ve ekip ihtiyacını belirle.','Önce çalışan akış\nSonra tekrar eden veya değişen sorumluluğu bul\nGerekirse küçük bir servis/sözleşme çıkar','Her tasarım kalıbı her küçük projede zorunlu değildir.']],
proje:[['Kabul ölçütü yaz','“POST çalışıyor” belirsizdir. Girdi, çıktı ve veri etkisini belirterek doğrulanabilir bir ölçüt kur.','Verilen: 10 karakterlik başlık\nİşlem: POST /api/gorevler\nBeklenen: 201 + Id + yeniden GET ile aynı kayıt','Başarı iddiası gözlemlenebilir hale gelir.'],['Küçük ikinci proje','Görev API tamamlandıktan sonra Kitaplık API geliştir. Kitap, yazar ve ödünç alma ilişkisi yeni bir modelleme pratiği sağlar.','Kitap(Id, Ad, YazarId)\nYazar(Id, Ad)\nOdunc(Id, KitapId, KullaniciId, IadeTarihi)','Önce kitap ve yazar CRUD; sonra ödünç iş kuralları.']],
deploy:[['Publish çıktısı ile barındırma','Dağıtım klasörü üretmek URL oluştuğu anlamına gelmez. Bir çalışma ortamı, süreç başlatma, güvenli ağ erişimi ve veri depolama düzeni gerekir.','Kaynak → build/test → publish klasörü\n→ hedef ortam → ayarlar → süreç → HTTPS URL','Akıştaki her adımın amacı farklıdır.'],['Veritabanı kalıcılığı','Dosya tabanlı veritabanı kullanırken dağıtım ortamı dosyaları her yeniden başlatmada silebilir. Kalıcı disk veya uygun yönetilen veritabanı ihtiyacını kontrol et.','Yerel SQLite dosyası ≠ her platformda kalıcı disk garantisi','Dağıtım sağlayıcısının disk yaşam döngüsü belirleyicidir.']],
mulakat:[['Kendi katkını anlat','Hazır öğreticide gördüğün özellik ile kendin yazıp test ettiğin özelliği ayır. Mülakatçı takip sorusu sorduğunda akışı gösterebilmelisin.','“Görev API’de başlık doğrulamasını ekledim.\nBoş girdinin 400 dönmesini ve kayıt oluşmamasını test ettim.”','Somut ve doğrulanabilir bir anlatım kur.'],['Bir hatayı açıklama','“Çalışmadı” yerine gözlemi, bekleneni ve denediğin kontrolü söyle. Böylece sorunu ekip arkadaşınla birlikte daraltabilirsin.','Beklenen: POST 201\nGözlenen: 500\nKontrol: logdaki bağlantı hatası; secret anahtarı eksik\nDüzeltme: doğru configuration; tekrar deneme','Hata incelemesini ezber yerine neden-sonuç ilişkisiyle anlat.']]
};
Object.assign(extras,{
sqlserver:[['Bağlantı hattındaki hata','Bağlantı hatası alan endpoint’i incele: sağlayıcı eklenmiş mi, configuration anahtarı doğru mu, SQL Server erişilebilir mi? Her katman farklı kanıt üretir.','Endpoint → DI → GorevDb → UseSqlServer → ağ → SQL Server\nÖrnek: Default ayarı null ise ağ sorgusuna bile geçilmez.','Önce hatanın gerçekleştiği aşamayı daralt.'],['Provider değişiminde veri tipi','C# modelindeki bir tipin SQL karşılığı sağlayıcıya bağlıdır. Aynı modelin SQLite ve SQL Server çıktısını migration dosyalarında karşılaştır.','C#: bool Tamamlandi\nSQL Server: bit\nSQLite: genellikle INTEGER 0/1','Aynı entity, her motorun aynı söz dizimini kullandığı anlamına gelmez.']],
aggregate:[['Görevi olmayan kullanıcıyı da say','LEFT JOIN ve COUNT(g.Id) ile hiç görevi olmayan kullanıcıyı sıfırla gösterebilirsin. COUNT(*) birleşmenin sol satırını da sayacağı için farklı sonuç doğurabilir.','SELECT k.Ad, COUNT(g.Id) AS GorevSayisi\nFROM Kullanicilar k LEFT JOIN Gorevler g ON g.KullaniciId=k.Id\nGROUP BY k.Id, k.Ad ORDER BY k.Id;','SQL laboratuvarında Can için 0; Fatih/Ece için 3; Deniz için 2.'],['Satır koşulu ve grup koşulu','Önce tamamlanmamış görevleri seç, sonra kullanıcıya göre say. Bu ikisini ayırmak WHERE ile HAVING farkını görselleştirir.','SELECT KullaniciId, COUNT(*) AS Bekleyen\nFROM Gorevler WHERE Tamamlandi=0\nGROUP BY KullaniciId HAVING COUNT(*) >= 2;','Başlangıç verisinde KullaniciId 1 ve 2 için iki bekleyen görev vardır.']],
transaction:[['Geri almayı gözlemle','SQL laboratuvarında bu sorguyu çalıştır. UPDATE gerçekten yürür; ROLLBACK sonrasında önceki değer korunur.','BEGIN TRANSACTION;\nUPDATE Gorevler SET Tamamlandi=1 WHERE Id=1;\nROLLBACK;\nSELECT Tamamlandi FROM Gorevler WHERE Id=1;','Başlangıç verisinde sonuç 0.'],['İş sınırını doğru seç','Kaydetme ile bildirim gönderimini aynı işlem sanma. DB sonucu ve dış servis sonucu birbirinden bağımsız arıza yaşayabilir.','DB transaction: sipariş + satırlar\nDış işlem: bildirim servisine HTTP çağrısı','Uzak servis hatası commit edilmiş siparişi kendiliğinden geri almaz.']],
relations:[['Tam entity ile ilişki','İlişkili entity’nin tamamına bilinçli ihtiyaç varsa Include kullanılabilir. Çok sayıda ilişki ve büyük koleksiyonların maliyetini ölç.','var kullanicilar = await db.Kullanicilar\n    .Include(k => k.Gorevler).ToListAsync();','Gorevler navigation’ı bulunan Kullanici modeli ve uygun context gerekir; bu mevcut modele eklenecek sorgu parçasıdır.'],['JSON yanıtını daralt','Entity’nin bütün alanlarını yanıtlamak yerine gereken görünümü açıkça oluştur. İlişki dolaşımını sınırlamak okunurluk ve veri paylaşımı kontrolü sağlar.','var liste = await db.Gorevler.Select(g => new {\n    g.Id, g.Baslik, Sahibi = g.Kullanici.Ad\n}).ToListAsync();','Kullanıcının parola veya diğer özel alanları bu yanıta dahil değildir.']],
controller:[['Action sonucunu ayır','Aynı action kayıt varsa 200, yoksa 404 verebilir. Bu kod sınıf içi parçadır; veri kaynağı bu küçük örnekte bellektedir.','[HttpGet("ornek/{id:int}")]\npublic IActionResult Ornek(int id) =>\n    id == 1 ? Ok(new { Id=1, Baslik="C#" }) : NotFound();','Id 1 için 200; diğer sayılar için 404.'],['ApiController doğrulaması','Controller’da model attribute’larıyla doğrulama tanımlayabilirsin. Bu davranışı farklı API türleri için otomatik aynı varsayma.','public class YeniGorev\n{\n    [System.ComponentModel.DataAnnotations.Required]\n    public string? Baslik { get; init; }\n}','DTO üzerinde zorunlu alan örneği; maksimum uzunluk ve diğer kuralları da uygulama sözleşmesine göre tanımla.']],
paging:[['SQL ve LINQ aynı fikri anlatır','SQLite laboratuvarındaki sayfa ile C# sorgusunu eşleştir. İkisinde de önce tutarlı sıralama, sonra atlama ve alma var.','SQL: ORDER BY Id LIMIT 3 OFFSET 3\nLINQ: OrderBy(g=>g.Id).Skip(3).Take(3)','Başlangıç verisindeki ikinci 3’lü sayfa Id 4, 5, 6’dır.'],['Kararlı sıra','Yalnızca tarihe göre sıralandığında eşit tarihlerde sıra belirsiz olabilir. İkinci benzersiz anahtar eklemek tutarlılığa yardımcı olur.','OrderBy(g => g.OlusturmaTarihi)\n    .ThenBy(g => g.Id)','OlusturmaTarihi alanı olan bir model için sorgu parçası; mevcut örnek modele otomatik eklenmez.']],
cancellation:[['Alt çağrıya ilet','Token sadece endpoint parametresi olarak kalırsa veri çağrısı onu görmez. Asenkron zincirde aşağıya ilet.','// Mevcut async handler içinde:\nvar liste = await db.Gorevler.ToListAsync(ct);','İşbirlikçi iptal destekleniyorsa gereksiz bekleme azaltılabilir.'],['Zaman aşımı sınırı','İstemci iptali ile belirli bir süre sınırı farklı kaynaklardan gelebilir. Linked token kullanırken kaynakları dispose etmeyi unutma.','using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));\nusing var linked = CancellationTokenSource.CreateLinkedTokenSource(ct, timeout.Token);\nvar liste = await db.Gorevler.ToListAsync(linked.Token);','Mevcut ct, db ve EF Core using gerektiren bir metot parçasıdır; her iş için 5 saniye uygun olmayabilir.']],
problem:[['Ortak hata gövdesini oku','type hatanın türünü, title kısa başlığını, status HTTP durumunu açıklar. İstemci, anlamı aynı olan alanları farklı endpoint’lerde düzenli okuyabilir.','{"title":"Geçersiz başlık","status":400,"detail":"Başlık gerekli."}','Bu kavramsal JSON örneği gerçek sunucu çağrısı değildir.'],['Kullanıcı raporunu logla eşleştir','Hata raporuna güvenli ilişkilendirme kimliği eklemek, teknik ayrıntıyı kullanıcının ekranına dökmeden inceleme yapmanı sağlar.','İstemci: sorun kimliği abc-123\nSunucu logu: abc-123 → uygun teknik ayrıntı','Gerçek secret, token veya bağlantı dizesini rapora ekleme.']]
});
for(const l of C.lessons){const rows=extras[l.id];l.examples=(rows||[
 ['Akışı kendi projenle eşleştir',l.purpose,l.code,l.walkthrough[0]],
 ['Sınır durumu üzerinde düşün',l.exercise,l.solution,'Bu örnek çözümü kendi çalışma ortamında doğrula; eksik bağlamı dersin uygulama bölümünden tamamla.']
]).map((r,i)=>({id:l.id+'-e'+(i+1),title:r[0],narrative:r[1],code:r[2],expected:r[3],language:l.id==='sql'||['aggregate','iliskisel'].includes(l.id)?'sql':'csharp',kind:'Özgün eğitim örneği'}));}
window.COURSE_EXTRA_READY=true;
})();
