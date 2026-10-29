/* Authored topic-specific questions. Existing 0..47 IDs are retained for saved wrong-answer reviews. */
(() => {
const C=window.COURSE;
function add(lesson,rows){for(const r of rows){const id=C.questions.length,shift=id%4,options=r[1].slice(shift).concat(r[1].slice(0,shift));C.questions.push({id,lesson,question:r[0],options,answer:(4-shift)%4,explanation:r[2],kind:r[3]||'Senaryo',code:r[4]||null});}}
add('backend',[
['İstemci ürün fiyatını 1 TL gönderdi. API ne yapmalı?',['Güncel fiyatı güvenilir veri kaynağından hesaplamalı','Gönderilen fiyatı sorgusuz kullanmalı','Sadece formdaki etiketi kontrol etmeli','Siparişin JSON olmasını yeterli saymalı'],'İstemci girdisi değiştirilebilir. Ürün kimliği ve miktar üzerinden sunucudaki fiyat ve stok kuralları uygulanır.'],
['Bir endpoint veritabanına gitmeden yanıt dönebilir mi?',['Evet; örneğin basit sağlık veya sürüm yanıtı','Hayır; bütün endpoint’ler tablo okumalı','Sadece POST ise','Yalnızca SQL Server kullanılıyorsa'],'Backend davranışı her zaman veri erişimi gerektirmez. İhtiyaç duyulan kaynak, endpoint’in işine bağlıdır.'],
['Telefondaki “başlık boş olamaz” kontrolü kaldırıldı. Hangi kural geçerli kalmalı?',['Sunucunun bağımsız başlık doğrulaması','CSS ile gizleme kuralı','Telefon klavyesinin önerileri','Tarayıcının dosya önbelleği'],'Sunucu, farklı istemcilerden ve doğrudan HTTP araçlarından gelen istekleri de doğrular.'],
['API ve veritabanı arasındaki fark nedir?',['API işlem sözleşmesi sunar, veritabanı veriyi saklar','API ve veritabanı aynı süreç olmak zorunda','Veritabanı yalnızca ekran çizer','API yalnızca tablo adıdır'],'Veritabanı sorgulama ve saklama hizmetidir. API bunun önünde doğrulama, yetki ve iş kurallarını uygulayabilir.','Kavram'],
['Bir istek için doğru sorumluluk sırası hangisi?',['İsteği al → doğrula/yetkiyi kontrol et → işle → yanıtla','Önce yanıtla → sonra gelen veriyi doğrula','Önce bütün kullanıcıların verisini istemciye ver','Gelen JSON’u doğrudan güvenilir kayıt say'],'İşlem uygulanmadan önce uygun kontroller gerekir. Her istekte aynı adımların hepsi bulunmayabilir.'],
['İş kuralı örneği hangisidir?',['Stok sıfırsa sipariş kabul edilmez','Butonun kenarı 8 piksel yuvarlak','Kod editörünün koyu teması açık','Sekmenin başlığında logo bulunur'],'İş kuralı uygulamanın geçerli davranışını belirler. Görsel tercihler frontend tasarımıdır.']
]);
add('kurulum',[
['dotnet build hangi aşamayı kontrol eder?',['Kaynak kodun derlenebilmesini','Canlı alan adının satın alınmasını','Kullanıcının API yetkisini','Veritabanındaki tüm kayıtları'],'Derleme hatası ile uygulama çalışırken oluşan hatayı ayırmak gerekir. build sunucuya yayın yapmaz.'],
['Program.cs içine dotnet new console yazmak neden yanlış?',['Bu bir terminal komutudur, C# ifadesi değildir','SDK yalnızca SQL kodu kabul eder','Program.cs sadece JSON kabul eder','console şablonu tarayıcı içindir'],'CLI komutları terminalde, C# ifadeleri kaynak dosyasında çalışır.'],
['Proje bulunamadı hatasında ilk kontrol?',['Terminalin .csproj bulunan klasörde olması','Kodu başka renkte göstermek','Her paketi kaldırmak','Sunucu portunu rastgele değiştirmek'],'Komutun çalışma klasörü, hangi projenin seçileceğini belirler.'],
['.NET ile C# ilişkisi hangisi?',['C# dil, .NET geliştirme ve çalışma platformudur','İkisi aynı dosya uzantısıdır','.NET yalnızca bir SQL kütüphanesidir','C# web sunucusunun markasıdır'],'ASP.NET Core ise .NET üzerinde web geliştirme framework’üdür.','Kavram'],
['dotnet --version neyi gösterir?',['Seçilen SDK sürümünü','Git deposunun yaşını','Veritabanı sürümünü','API’nin yanıt kodunu'],'Birden fazla SDK varsa seçim global.json gibi etkenlere bağlı olabilir.'],
['Aynı kod başka makinede derlenmiyorsa hangi bilgi önemlidir?',['Hedef framework ve kurulu SDK/paket sürümleri','Masaüstü duvar kâğıdı','Tarayıcı sekme sayısı','Klasör simgesinin rengi'],'Projenin hedeflediği framework ve bağımlılıkları çalışma ortamıyla uyumlu olmalıdır.']
]);
add('degisken',[
['Bu kodun çıktısı nedir?',['Not yok','null sözcüğü','Boş satır','Derleme hatası'],'?? operatörü soldaki değer null ise sağdaki değeri seçer.','Kod okuma','string? not = null;\nConsole.WriteLine(not ?? "Not yok");'],
['"false" ile false arasındaki fark?',['İlki string, ikincisi bool','İkisi de int','İkisi de null','C# ikisini daima eşit sayar'],'Tırnak işaretleri metin oluşturur. JSON ve DTO tür kontrolünde bu ayrım önemlidir.'],
['int.TryParse("on", out int n) ne döndürür?',['false','true','"on" metni','Her zaman exception'],'TryParse başarısız dönüşümü bool sonuçla bildirir; n başarı doğrulanmadan iş kuralında kullanılmamalı.','Kod okuma'],
['decimal fiyat = 10.5m; içindeki m neyi belirtir?',['Ondalıklı sabitin decimal olduğunu','Sürenin dakika olduğunu','Değerin nullable olduğunu','Değerin string olduğunu'],'m son eki decimal literal içindir. Fiyat için yuvarlama kuralları ayrıca belirlenir.'],
['string? not bildirimi ne anlatır?',['Metnin null olabileceğini','Metnin yalnızca boş olacağını','Metnin SQL’de şifreleneceğini','Her erişimde null hatası olacağını'],'Nullable reference annotations derleyici analizine yardımcı olur; giriş doğrulamasının yerini almaz.'],
['int a = 5; int b = 2; a / b sonucu?',['2','2.5','3','null'],'İki int ile bölme tam sayı sonucu üretir. Ondalıklı hesap istiyorsan uygun tipe dönüştür.','Kod okuma']
]);
add('kontrol',[
['if koşulunun tipi ne olmalıdır?',['bool','string','List<int>','decimal'],'C# if, true/false üreten bir ifade ister; bir string doğrudan koşul değildir.','Kavram'],
['for (int i=1; i<4; i++) kaç tur çalışır?',['3','4','2','Sonsuza kadar'],'i sırasıyla 1, 2 ve 3 olur; 4 koşulu sağlamaz.','Kod okuma'],
['Geçersiz girdide erken return ne sağlar?',['Başarılı akışı daha az iç içe blokla yazmayı','Girdiyi otomatik kaydetmeyi','Bütün exception’ları çözmeyi','Her metodu asenkron yapmayı'],'Guard clause, geçersiz durumu başta ele alır. Kuralın kendisi yine açıkça yazılır.'],
['Bu koşul hangi adetleri kabul eder?',['1 ile 10 dahil','0 ile 10 dahil','Sadece 10','Tüm negatif sayılar'],'>= ve <= sınırları dahil eder; && iki koşulun birlikte doğru olmasını ister.','Kod okuma','adet >= 1 && adet <= 10'],
['Bir foreach içinde her görev için ayrı SQL sorgusu neye yol açabilir?',['N+1 sorgu ve artan gecikme','Otomatik transaction birleşmesi','Bütün sorguların tek sorgu olması','Veritabanına hiç gidilmemesi'],'Döngü sayısıyla büyüyen veri erişimini projection/JOIN veya uygun toplu sorguyla değerlendirmek gerekir.'],
['Sadece baslik == "" kontrolü hangi girdiyi kaçırır?',['"   "','Boş string','Tam olarak ""','Sıfır uzunluklu metin'],'Yalnızca boşluk içeren metin boş string’e eşit değildir. IsNullOrWhiteSpace bu durumu da yakalar.']
]);
add('metot',[
['Where ile Select arasındaki fark?',['Where filtreler, Select dönüştürür','İkisi de her zaman veriyi siler','Where sıralar, Select parola üretir','İkisi yalnızca string üzerinde çalışır'],'Seçilen öğelerin şeklini Select ile değiştirebilirsin; Where öğeyi dahil edip etmeme kararı verir.'],
['LINQ filtre ve dönüşüm örneğinin çıktısı nedir?',['20, 40','10, 20, 30, 40','2, 4','1, 3'],'Where çiftleri seçer; Select onları 10 ile çarpar.','Kod okuma','int[] s = [1,2,3,4];\nvar a = s.Where(x => x % 2 == 0).Select(x => x*10);\nConsole.WriteLine(string.Join(", ", a));'],
['Bir metot void döndürüyorsa ne ifade eder?',['Doğrudan bir sonuç değeri döndürmez','Metot hiç çalışmaz','Metot mutlaka async’tir','Yalnızca null dönebilir'],'void davranışı gerçekleştirebilir fakat çağırana değer sunmaz. async void ayrı bir konu olup genellikle event handler’larla sınırlıdır.'],
['Filtrelenen ToList sonucu kaynak listeyi otomatik siler mi?',['Hayır; ayrı sonuç listesi oluşturur','Evet; eşleşmeyenleri siler','Sadece SQL Server’da siler','Yalnızca int listesinde siler'],'Sorgulama ile kaynak koleksiyonda değişiklik yapmak ayrı işlemlerdir.'],
['Parametre ile yerel sabit kullanımı arasındaki fayda nedir?',['Metodu farklı girdilerle tekrar kullanabilmek','Her çağrıda yeni SDK kurmak','Tüm hataları kaldırmak','Tür kontrolünü devre dışı bırakmak'],'Parametre, davranışın tek bir gömülü değere bağımlı olmasını önler.'],
['Tek metotta HTTP, fiyat hesabı ve SQL ayrıntıları aşırı büyüdü. İlk adım?',['Sorumlulukları belirleyip anlamlı parçalara ayırmak','Tüm değişkenleri global yapmak','Metodun adını uzatmak','Bütün işlemleri catch içine saklamak'],'Metot sınırlarını gerçek davranışa göre belirle; sırf satır sayısı için rastgele bölme.']
]);
add('oop',[
['Ortak nesne referansı örneğinin çıktısı nedir?',['Yeni','İlk','null','İki farklı satır'],'a ve b aynı referans tipli nesneyi gösterir; atama derin kopya üretmez.','Kod okuma','var a = new Gorev { Baslik = "İlk" };\nvar b = a;\nb.Baslik = "Yeni";\nConsole.WriteLine(a.Baslik);'],
['new Gorev() ne yapar?',['Gorev tipinden nesne oluşturur','Tabloyu otomatik siler','Bütün görevleri getirir','Bir endpoint kaydeder'],'Nesne oluşturmak, nesneyi veritabanına kalıcı kaydetmek değildir.'],
['Tamamlandi alanını sadece Tamamla metoduyla değiştirmek hangi yaklaşımı destekler?',['Encapsulation','Pagination','Routing','SQL injection'],'Durum değişikliklerini kontrollü davranış üzerinden sunmak kapsülleme örneğidir.'],
['Bir class içine yazılan metot genellikle neyi temsil eder?',['Nesnenin veya tipin davranışını','Sadece veritabanı sütununu','Daima HTTP route’unu','NuGet paket sürümünü'],'Sınıflar veri ve davranışı bir araya getirebilir; her metot HTTP endpoint değildir.'],
['get; set; özelliği ne sağlar?',['Değeri okuma ve değiştirme erişimini','Salt okunur sabiti','Otomatik yetki denetimini','Her değer için ayrı tabloyu'],'Erişim belirleyicileri ve iş kuralı, hangi değişikliklerin mümkün olduğunu ayrıca sınırlar.'],
['İki ayrı new Gorev oluşturulduğunda?',['İki ayrı nesne örneği oluşur','İkisi zorunlu olarak aynı nesnedir','İkinci oluşturma her zaman hata verir','Id’leri veritabanı olmadan otomatik aynı tablodan gelir'],'Nesne kimliği ile veritabanı Id değeri aynı kavram değildir.']
]);
add('di',[
['Transient ne zaman yeni örnek sağlar?',['Servis her çözümlendiğinde','Sadece ilk uygulama açılışında','Her veritabanı sütununda','Yalnızca hata oluştuğunda'],'Transient çözümleme başına, scoped kapsam başına, singleton container yaşamı boyunca örnek kullanır.'],
['Singleton içinde mutable liste tutmanın riski?',['Eşzamanlı istekler arasında ortak durum ve yarış','Her istek için otomatik ayrı liste','Listenin otomatik SQL’e dönmesi','Liste hiçbir zaman değişmez'],'Paylaşılan değiştirilebilir veri için eşzamanlılık ve sahiplik tasarımı gerekir.'],
['Bir interface uygulamasını değiştirmek için DI’da neyi güncellersin?',['Servis eşlemesini','Her çağıran endpoint’in JSON’unu','Bütün tablo adlarını','Runtime dilini'],'Çağıran sözleşmeye bağlıysa somut uygulama kayıt üzerinden değiştirilebilir.'],
['Interface var ama uygulama DI’a kaydedilmemiş. Olası sonuç?',['Çözümleme sırasında uygun servis bulunamaması','SQL kendiliğinden tablo oluşturur','C# interface’i yok sayar','Endpoint otomatik mock üretir'],'DI container hangi sözleşmeye hangi uygulamayı vereceğini bilmelidir.'],
['Constructor injection örneği hangisi?',['GorevServisi(IMesaj mesaj)','Her metoda gizli new Mesaj eklemek','Tüm servisleri static değişkende tutmak','Connection string’i route’a koymak'],'Constructor parametresi bağımlılığı dışarıdan açıkça alır.'],
['Her küçük sınıf için interface şart mı?',['Hayır; ihtiyaç ve sınırlarla değerlendirilir','Evet; C# sınıf derlemez','Yalnızca entity için zorunlu','Bütün test araçları interface ister'],'Gereksiz soyutlama öğrenme ve bakım yükü yaratabilir.']
]);
add('async',[
['Task<string> ne taşır?',['Tamamlanacak işlemin string sonucunu','Doğrudan bir SQL tablosunu','Her zaman yeni thread’i','Bir HTTP durum kodunu'],'Task işlemi temsil eder; string sonuca genellikle await ile ulaşırsın.'],
['.Result ile beklemenin web uygulamasındaki sakıncası?',['İş parçacığını bloke edebilmesi','Her zaman iki sorgu üretmesi','JSON’u şifrelemesi','Tür güvenliğini kaldırması'],'Asenkron zinciri await ile sürdürmek, gereksiz senkron bloklamadan kaçınmaya yardımcı olur.'],
['async eklemek CPU hesaplamasını otomatik hızlandırır mı?',['Hayır','Evet; en az iki kat','Sadece bool dönerse','Her zaman GPU kullanır'],'Asenkronluk bekleme ve devam akışını düzenler; CPU hızlanması garantisi değildir.'],
['await edilmeden başlatılan kayıt işi için hangi risk var?',['Sonuç ve hatanın düzgün izlenmemesi','İşin kesin başarıyla bitmesi','Verinin mutlaka iki kez kaydolması','Derleyicinin veritabanını açması'],'İstek yaşamı, hata gözlemi ve işlemin tamamlanması önemlidir. Bilinçsiz fire-and-forget yaklaşımından kaçın.'],
['HttpRequestException hangi probleme örnektir?',['HTTP istemcisinin ağ/yanıt işlemi sorununa','Başlığın boş olmasına','Bir CSS hatasına','Her C# derleme hatasına'],'Beklenen kullanıcı doğrulaması ile uzak servis hatası farklı sınıflardır.'],
['Async metotlarda genel dönüş tercihi nedir?',['Task veya Task<T>','Her zaman async void','Her zaman string','Yalnızca bool'],'Task ile çağıran tamamlanmayı ve hatayı izleyebilir. async void çoğunlukla olay işleyiciler içindir.']
]);
add('http',[
['Başarılı ve gövdesiz silme yanıtı hangisi?',['204','201','500','401'],'204 No Content başarılı sonucu gövdesiz bildirir.'],
['Content-Type: application/json neyi belirtir?',['Mesaj gövdesinin JSON biçimini','Kullanıcının yetki seviyesini','SQL motorunu','HTTP’nin şifresini'],'İçerik türü veri biçimini açıklar; verinin geçerli veya yetkili olduğunu kanıtlamaz.'],
['POST tekrar gönderilirse hangisi mümkündür?',['İkinci bir kayıt oluşması','Kesin olarak hiç etkisi olmaması','Her zaman GET’e dönüşmesi','Tarayıcının bütün tekrarları engellemesi'],'POST varsayılan olarak tekrar güvenli sayılmaz; idempotency ihtiyacı iş kuralıyla ele alınır.'],
['PUT ve PATCH farkı için doğru ifade?',['PUT genellikle tam temsil, PATCH kısmi değişiklik taşır','İkisi her zaman salt okunurdur','PATCH yalnızca dosya indirir','PUT sadece JSON liste okuyabilir'],'Detaylı gövde sözleşmesi API tarafından belirlenir.'],
['JSON’da geçerli bool yazımı hangisi?',['{"tamamlandi":true}','{"tamamlandi":"true"}','{tamamlandi:true}','{"tamamlandi":True}'],'Anahtar çift tırnaklıdır; bool true küçük harfle ve tırnaksız yazılır. Diğer seçeneklerden ikincisi string taşır.'],
['Location üstbilgisi yeni kaynak yanıtında ne işe yarar?',['Yeni kaynağın adresini bildirir','Kullanıcının GPS bilgisini verir','Sunucunun parolasını iletir','SQL sorgusunu zorunlu olarak taşır'],'201 Created yanıtında kaynak URL’si için kullanılabilir.']
]);
add('minimal',[
['{id:int} eşleşmesi neyi garanti etmez?',['O Id ile kayıt bulunduğunu','Route değerinin int biçimine uyduğunu','Yol şablonunun kullanıldığını','Endpoint’in sayısal Id beklediğini'],'Routing sonrası uygulama veritabanında kaydı ayrıca arar.'],
['app.Run() genel olarak nerede yer alır?',['Uygulama kurulumunun ve endpoint tanımlarının ardından','Her entity’nin içinde','Sadece SQL dosyasında','Her GET handler’ının başında'],'Run uygulamayı başlatır; servis ve endpoint kurulumu önceden yapılır.'],
['MapPost handler’ı DTO alıyor. Bu değer genellikle nereden bağlanır?',['JSON istek gövdesinden','Mutlaka CSS dosyasından','Sadece veritabanı index’inden','Git commit mesajından'],'Bağlama kuralları parametre tipi ve attribute’lara bağlıdır. Basit DTO çoğunlukla JSON body’den gelir.'],
['Terminalde API farklı port gösteriyor. Hangi adres kullanılır?',['Terminalin yazdığı gerçek yerel adres','Eğitimdeki rastgele sabit port','GitHub deposunun adresi','Her zaman port 80'],'launchSettings ve ortam ayarları yerel adresi değiştirebilir.'],
['Controller ile Minimal API arasındaki ortak temel?',['ASP.NET Core HTTP ve servis altyapısı','Bütün dosyaların aynı yazımı','Her ikisinin veritabanı gerektirmemesi değil, kullanamaması','Sadece tarayıcı JavaScript’i olmaları'],'Her ikisi de routing, DI ve HTTP sonuçları gibi aynı platform kavramlarını kullanır.'],
['Dictionary içinde olmayan Id istendi. Uygun kontrol?',['TryGetValue sonucu false ise NotFound','Her Id için Created dönmek','Sadece UI’de aramayı gizlemek','500’ü başarılı kabul etmek'],'Bellek örneğinde de kaynak varlığı kontrolü gerekir; kalıcılık ise ayrı konudur.']
]);
add('dto',[
['DTO’da olmayan isAdmin alanını istemci gönderdi. Ne varsaymamalısın?',['Bu alanın kullanıcıyı yönetici yaptığını','JSON’un ek alan taşıyabildiğini','Serializer ayarlarının etkisi olabildiğini','API sözleşmesinin sınırlı olduğunu'],'Yetki sunucunun güvenilir kimlik ve politikalarıyla belirlenir.'],
['Trim işlemi ne yapar?',['Baştaki ve sondaki boşlukları temizler','Metnin içindeki tüm harfleri siler','Metni şifreler','Null üzerinde çağrıyı daima güvenli yapar'],'Null için önce kontrol veya ?. kullan. Trim metnin ortasındaki normal boşlukları kaldırmaz.'],
['Sınır 100 ise hangi uzunluk geçersizdir?',['101','100','99','1'],'Sınırın dahil olup olmadığını açık testlerle doğrula.'],
['Request DTO ve Response DTO neden farklı olabilir?',['İstemciden alınan ve ona gösterilen alanlar farklıdır','C# aynı tipin iki kez kullanılmasını yasaklar','Yanıtlar hiçbir zaman JSON olamaz','Veritabanı Id tutamaz'],'Örneğin Id’yi sunucu üretir; istemcinin oluşturma isteğinde vermesi gerekmeyebilir.'],
['NOT NULL veritabanı kuralı boş string’i reddeder mi?',['Tek başına reddetmez','Her zaman reddeder','Sadece HTTP GET’te reddeder','Bütün whitespace’i temizler'],'Null ile boş metin farklıdır; boş başlık için ayrıca uygulama doğrulaması gerekir.'],
['Geçersiz başlıkla kayıt sayısı artıyorsa?',['Doğrulama kayıt işleminden önce uygulanmalıdır','400 yanıtı tüm kayıtları otomatik siler','DTO kullanmak tek başına yeterlidir','İstemciyi yenilemek kuralı düzeltir'],'Yanıt kodu ve veri etkisi birlikte doğrulanmalı; hata yanıtı verilse bile hatalı yazma yapılmamalıdır.']
]);
add('middleware',[
['A ve B middleware’i kayıtlı. Normal dönüş sırası?',['A önce → B önce → endpoint → B sonra → A sonra','A önce → A sonra → B önce → endpoint','Endpoint her zaman en başta','B sonra hiçbir zaman çalışmaz'],'next çağrıları iç içe akış oluşturur; exception veya kısa devre bu yolu değiştirebilir.'],
['Bir middleware next çağırmadan yanıt verdiyse?',['Sonraki hat kısa devre edilebilir','Sonraki bütün bileşenler kesin çalışır','Veritabanı silinir','Uygulama otomatik yeniden derlenir'],'Kimlik veya önbellek gibi bileşenler bilinçli olarak isteği sonlandırabilir.'],
['Yapılandırılmış log örneği hangisi?',['LogInformation("Görev {Id}", id)','LogInformation(parola)','LogInformation(token)','LogInformation(connectionString)'],'İsimli alan, hassas veri içermeden olayın ayrıntısını sorgulamaya yardımcı olur.'],
['Yetkilendirmeden önce hangi bilgi gerekebilir?',['Doğrulanmış kullanıcı kimliği','Ekran çözünürlüğü','Git branch adı','Metnin fontu'],'Kimlik doğrulama ve yetkilendirme sırası uygulamanın güvenlik akışını etkiler.'],
['Middleware neden ortak işlemler için uygundur?',['Birden fazla endpoint’e giden istek hattını kapsayabilir','Yalnızca tek entity sınıfında çalışır','Sadece derleme aşamasında çalışır','Her log için yeni tablo zorunlu kılar'],'Ortak HTTP davranışı endpoint’lerde tekrar tekrar yazılmadan ele alınabilir.'],
['next sonrasındaki log her durumda çalışır mı?',['Hayır; sonraki bileşen hata fırlatabilir','Evet; exception’lar kod akışını etkilemez','Yalnızca POST’ta çalışır','Sadece SQLite varsa'],'finally veya merkezi hata yönetimi gibi ihtiyaçlar bilinçli tasarlanmalıdır.']
]);
add('iliskisel',[
['Kullanıcı 1, onun üç görevi varsa hangi model doğal?',['1 kullanıcı satırı, 3 görev satırı ve foreign key','3 ayrı kullanıcı tablosu','Her görevde bütün kullanıcı geçmişi','Hiçbir anahtar kullanmamak'],'Birden çoğa ilişki tekrarı azaltır ve referansları açıklaştırır.'],
['Foreign key kısıtı olmayan kullanıcıya görev bağlamayı ne yapar?',['Tanımlıysa geçersiz referansı engeller','Her durumda kullanıcıyı oluşturur','Görevi otomatik anonim yapar','API’ye yönetici yetkisi verir'],'Veritabanı tutarlılığı ile kullanıcı erişim yetkisi farklıdır.'],
['Kullanıcı silinince ilişkili görevler için ne gerekir?',['İş kuralına uygun silme davranışı kararı','Her zaman bütün veritabanını silmek','Hiçbir zaman düşünmemek','Sadece CSS’te satırı gizlemek'],'Engelleme, cascade veya nullable ilişki seçenekleri veri modeline göre seçilir.'],
['Tablo şeması neyi tanımlar?',['Sütunlar, tipler, ilişkiler ve kısıtlar','Sadece tarayıcı ekranını','Yalnızca Git geçmişini','Runtime sürümünü tek başına'],'Modeldeki yapısal kurallar veritabanında şema olarak somutlaşır.'],
['Primary key alanının aynı tablodaki iki satırda aynı olması?',['Anahtarın benzersizlik kuralını ihlal eder','Her zaman normaldir','Sadece ekranda sorun çıkarır','GET metodu bunu zorunlu kılar'],'Primary key tek alanlı veya bileşik olabilir; benzersizliği sağlar.'],
['Bir kimlik sütunu tanımlamak otomatik artışı garanti eder mi?',['Hayır; veritabanı/model üretim stratejisine bağlı','Evet; bütün int alanlar otomatik artar','Sadece string ise artar','Foreign key buna karar verir'],'SQL Server IDENTITY ve EF sağlayıcı kuralları gibi stratejiler ayrıca belirlenir.']
]);
add('sql',[
['ORDER BY olmadan sonuç sırası için doğru ifade?',['Belirli bir sıraya güvenilmez','Her zaman Id artan gelir','Her zaman eklenme zamanıdır','JOIN sorgusunda daima alfabetiktir'],'Gözlenen sıra kalıcı sözleşme değildir; sıralamayı açıkça yaz.'],
['LEFT JOIN neyi korur?',['Sol tablonun eşleşmeyen satırlarını da','Yalnızca sağ tablonun tüm satırlarını','Sadece eşleşen satırları','Tablo başlıklarını'],'Sağda eşleşme yoksa sağ alanlar null olabilir.'],
['SQL’de null kontrolü için hangisi doğrudur?',['IS NULL','= NULL','== NULL','LIKE NULL'],'Null, bilinmeyen/yok değeri ifade eder. Eşitlik karşılaştırması yerine IS NULL kullanılır.'],
['Index eklemenin bedeli olabilir mi?',['Yazma maliyeti ve depolama alanı','Hiçbir maliyeti yoktur','Bütün sorgular yavaşlamak zorundadır','Sadece JSON büyür'],'Index’i sorgu desenine ve ölçüme göre seçmek gerekir.'],
['WHERE Id > 10 ORDER BY Id DESC ne yapar?',['10’dan büyük Id’leri azalan sırada getirir','10 dahil tüm Id’leri artan getirir','Sadece Id 10’u siler','Tabloyu tersine kaydeder'],'SELECT, veri okur; ORDER BY depolama sırasını değiştirmez.'],
['SELECT * yerine gereken sütunları seçmenin faydası?',['Gereksiz veri aktarımını azaltabilir','Her zaman bütün index’leri siler','Yetkilendirmeyi otomatik kurar','Transaction’ı gereksiz kılar'],'Az veri taşımak yardımcıdır; erişim ve performans yine ayrıca değerlendirilir.']
]);
add('ef',[
['DbSet<Gorev> neyi temsil eder?',['Sorgulanabilir entity kümesini','Her zaman bellekteki tüm görevleri','Bir HTTP header’ını','Yalnızca migration dosyasını'],'Sorgu tanımı ile sorgunun çalıştırılması aynı adım değildir.'],
['Where sonrası ToListAsync ne yapar?',['Sorguyu çalıştırıp sonucu liste olarak alır','Tabloyu otomatik siler','İstemciye kendiliğinden 201 döner','Bütün property’leri private yapar'],'Sonlandırıcı çağrı, sağlayıcının sorguyu veritabanına göndermesini tetikler.'],
['DbContext’i iki eşzamanlı görev arasında paylaşmak neden sorunlu?',['Thread-safe olmadığı için','Hiç sorgu desteklemediği için','Sadece SQL Server’da sınıf olduğu için','Her çağrıda kaynak kodu sildiği için'],'İstek kapsamı ve paralellik sınırı bilinçli yönetilmelidir.'],
['Select(g => new {g.Id,g.Baslik}) ne sağlar?',['İhtiyaç duyulan alanlara projection','Her görev için parola hash’i','Otomatik login','Tablonun primary key’ini kaldırma'],'API yanıtına gereken alanları seçer ve sorguyu sadeleştirebilir.'],
['Bellekte çalışan her LINQ ifadesi SQL’e çevrilir mi?',['Hayır; sağlayıcı destekleri farklıdır','Evet; bütün C# metotları SQL olur','Yalnızca var kullanılırsa','Sadece bool alanlar varsa'],'Çevrilemeyen ifadeler hata veya farklı yürütme davranışı doğurabilir; sorguyu gözlemle.'],
['Id’nin key kabul edilmesi neye örnektir?',['EF Core adlandırma convention’ına','Zorunlu JWT alanına','HTTP routing garantisine','Her database sütununun identity olmasına'],'Convention başlangıcı kolaylaştırır; gerektiğinde model yapılandırmasıyla açık seçim yapılabilir.']
]);
add('migration',[
['Entity’ye Aciklama ekledin. Mevcut veritabanı için?',['Şema değişimini migration ile planlayıp uygulamalısın','Her tablo kendiliğinden değişir','Sadece tarayıcıyı yenilemek yeter','GET isteği tabloyu her zaman günceller'],'C# model ve mevcut şema ayrı kaynaklardır; migration aradaki değişimi taşır.'],
['Üretilen migration neden incelenir?',['Yanlış silme/ekleme veya veri kaybı etkisini görmek için','Yalnızca dosya adını renklendirmek için','JWT süresini uzatmak için','DI’a otomatik singleton eklemek için'],'Özellikle sütun yeniden adlandırmaları ve kısıt değişimleri dikkat gerektirir.'],
['İzlenen entity güncellendi. Veritabanına yazma ne zaman olur?',['SaveChanges/SaveChangesAsync çağrısıyla','Property set edilir edilmez her zaman','Kod editörü kaydedilince','GET route’u eşleşince'],'Change tracking yerel değişikliği izler; yazma ayrı adımdır.'],
['dotnet ef database update ne yapar?',['Bekleyen migration’ları hedef veritabanına uygular','Her zaman yeni migration dosyası üretir','Sadece Git’e commit eder','API’yi internete yayımlar'],'Hedef bağlantının doğru ortamı gösterdiğinden emin ol.'],
['Üretim migration’ında önce ne planlanır?',['Veri yedeği, etki ve geri dönüş stratejisi','Sadece uygulama logosu','Soru sayısı','Tarayıcı tema rengi'],'Başarılı komut gerçek veri üzerinde risksiz işlem anlamına gelmez.'],
['AsNoTracking sonucu değiştirip kaydetmek neden beklediğin gibi olmayabilir?',['Nesne değişiklik takibinde olmayabilir','C# özellik değişimini yasaklar','Veritabanı read-only olmak zorundadır','JSON her durumda geçersizdir'],'Güncelleme için entity’nin uygun takip/attach ve durum yönetimi gerekir.']
]);
add('auth',[
['Bir kullanıcının başka kullanıcının görevini Id ile okumasını ne önler?',['Kaynak sahipliği veya erişim politikası kontrolü','Sadece login ekranının varlığı','Id’nin int olması','Yalnızca HTTPS kullanmak'],'Kimlik doğrulama ve nesne seviyesinde yetki denetimi birlikte gereklidir.'],
['Parola saklamak için hangisi tercih edilir?',['Uygun ve bakımı yapılan password hasher','Düz metin','Tek başına hızlı SHA256','JWT gövdesine koymak'],'Parola saklama, uygun maliyet ve salt yönetimi gibi özellikleri olan yerleşik çözüm gerektirir.'],
['JWT alındığında hangi kontroller önemlidir?',['İmza, issuer, audience ve süre','Sadece token uzunluğu','Yalnızca nokta sayısı','Kullanıcının ekran boyutu'],'Token’ın beklenen kaynaktan ve bu API için geçerli olduğunu doğrulamak gerekir.'],
['CORS ne değildir?',['Kimlik doğrulama ve yetkilendirme sistemi','Tarayıcı cross-origin erişim mekanizması','Origin politikasıyla ilgili yapı','Yanıt okuma iznini etkileyen ayar'],'Tarayıcı dışı istemcileri veya izinsiz veri erişimini tek başına engellemez.'],
['RequireAuthorization tek başına login akışını kurar mı?',['Hayır; uygun şema ve servis yapılandırması gerekir','Evet; veritabanı ve parolaları otomatik üretir','Yalnızca SQL Server varsa','Cookie’leri sonsuza kadar geçerli yapar'],'Endpoint şartı ile kimlik sağlayıcısının kurulumu farklı adımlardır.'],
['Token neden loga yazılmamalı?',['Erişim yetkisini ele geçirmeye yol açabilir','JSON olduğu için derlenmez','Metin olduğu için saklanamaz','Her token açık lisanslıdır'],'Loglar farklı kişi ve sistemlere erişebilir; gizli değerleri taşımamalıdır.']
]);
add('config',[
['ConnectionStrings:Default ortam değişkeninde nasıl ifade edilebilir?',['ConnectionStrings__Default','ConnectionStrings.Default[]','Default/Password.json','HTTP__GET__Default'],'Çift alt çizgi hiyerarşi ayrımı için kullanılır.'],
['Secret’ın değerini README’ye yazmak neden yanlış?',['Gizli bilgi kopyalanıp yetkisiz kullanılabilir','README kod derlemediği için','Markdown JSON’u desteklemediği için','Git hiç metin saklamadığı için'],'README’de anahtar adını ve nasıl sağlanacağını anlat; gerçek değeri yazma.'],
['Aynı kod farklı ortamlara nasıl bağlanabilir?',['Ortamın sağladığı configuration değerleriyle','Her defasında tüm sınıfları yeniden adlandırarak','Bütün secret’ları route’a ekleyerek','Yalnızca frontend CSS’i değiştirerek'],'Configuration, kod ile ortam değerlerini ayırır.'],
['User Secrets şifreli üretim kasası mıdır?',['Hayır; yerel geliştirme için tasarlanır','Evet; her production için zorunludur','Yalnızca Android’de öyledir','SQL tablosu açar'],'Geliştirme kolaylığı sunar; üretim sırlarını uygun secret yönetimiyle sağla.'],
['Eksik bağlantı ayarını erken hata ile bildirmek ne sağlar?',['Yanlış ortamın hızlı fark edilmesini','Otomatik geçerli parola üretimini','Veritabanını her zaman sıfırlamayı','Her HTTP hatasını gizlemeyi'],'Fail-fast yaklaşımı eksik yapılandırmayı geç fark etmek yerine açıkça ortaya çıkarabilir.'],
['Development hata ekranını production’da açmak neden sakıncalı?',['İç ayrıntıları ve hassas bilgileri açığa çıkarabilir','Sadece tema bozulur','JSON boyutu mutlaka sıfır olur','Runtime çalışmaz'],'Ayrıntıyı kontrollü logda tut, istemciye uygun genel hata sözleşmesi sun.']
]);
add('test',[
['100 karakter sınırı için en yararlı üç girdi?',['99, 100, 101','1, 2, 3','10, 20, 30','Sadece 50'],'Sınırın hemen altı, kendisi ve hemen üstü hatalı karşılaştırmaları yakalar.'],
['Arrange Act Assert sırası?',['Girdiyi hazırla → davranışı çalıştır → sonucu doğrula','Sonucu doğrula → sınıfı sil → commit et','SDK kur → token üret → tabloyu sil','Logla → gizle → yayınla'],'Testin amacını ve hangi davranışı çalıştırdığını açık tutar.'],
['Theory + InlineData ne işe yarar?',['Aynı testi farklı girdilerle çalıştırmaya','Testin production’da çalışmasını zorlamaya','Her testi otomatik başarılı saymaya','Veritabanı bağlantısını şifrelemeye'],'Parametreli test, null/boş/whitespace gibi senaryoları açıkça kapsayabilir.'],
['Testte doğrulama kuralını kopyalamak yerine ne yapmalısın?',['Gerçek üretim metodunu çağırmak','Beklenen sonucu hep true yapmak','Assertion’ı kaldırmak','Test adını uzun yazmak'],'Kopya kod doğru kalsa bile üretim kodu bozulabilir; testi gerçek davranışa bağla.'],
['API integration testinde 400 dışında ne kontrol edilebilir?',['Hatalı girdinin kayıt oluşturmaması','Logo rengi','IDE teması','Commit yazarının fotoğrafı'],'Yanıt ile veritabanı etkisi birlikte değerlendirildiğinde daha anlamlı güven sağlanır.'],
['Test veritabanını production ile ortak kullanmak?',['İstenmeyen veri değişimi riski taşır','Her zaman daha güvenlidir','Testler veri yazamaz','Yalnızca int Id varsa zorunludur'],'Testleri kontrollü, izole veri ve ortamla çalıştır.']
]);
add('git',[
['git diff --staged ne gösterir?',['Bir sonraki commit’e hazırlanmış değişiklikleri','Sadece uzaktaki parolaları','Derleme sonucunu','SQL tablolarını'],'Staged içerik commit’e girecek seçilmiş değişikliklerdir.'],
['.gitignore ne için kullanılır?',['İzlenmemesi gereken dosya desenlerini belirtmek','Takipteki bütün geçmişi temizlemek','Token iptal etmek','Branch’leri şifrelemek'],'Zaten takip edilen secret’ı geçmişten kendiliğinden kaldırmaz.'],
['Branch ne sağlar?',['Ayrı geliştirme hattı','Her zaman ayrı sunucu','Otomatik production deploy','Veritabanı kopyası'],'Branch kod geçmişine ait kavramdır; altyapıyı kendiliğinden oluşturmaz.'],
['Pull request açmak ne anlama gelir?',['Değişikliklerin inceleme ve birleştirme isteği','Kodun kesin birleştirilmiş olması','Veritabanının silinmiş olması','Paket sürümünün otomatik yükselmesi'],'İnceleme ve merge ayrı aşamalardır.'],
['Anlamlı commit mesajı hangisi?',['Boş görev başlığını reddet','son3','asdf','her şey'],'Mesaj, yapılan işin amacını okuyana anlatmalıdır.'],
['git status ne için yararlıdır?',['Dosyaların çalışma ve hazırlama durumunu görmek','API gecikmesini ölçmek','JWT doğrulamak','SQL transaction’ını kapatmak'],'Commit öncesi hangi değişikliklerin olduğunu görmek temel alışkanlıktır.']
]);
add('mimari',[
['“Adet negatif olamaz” kararı hangi sorumluluk?',['İş/doğrulama kuralı','Yalnızca tarayıcı fontu','Git remote ayarı','HTTP port seçimi'],'Kural web dışı bir arayüzde de geçerli olabilir. HTTP 400’e eşleme ayrı sınırdır.'],
['Repository EF Core üzerinde her zaman zorunlu mu?',['Hayır; ihtiyaç ve faydayla değerlendirilir','Evet; DbContext onsuz çalışmaz','Sadece SQLite’ta zorunludur','Tüm entity’ler repository’den kalıtım alır'],'Ek katmanın hangi sınırı veya tekrarı çözdüğünü açıkla.'],
['Dikey çalışan ilk akış hangisi?',['İstek → doğrulama → kayıt → yanıt','Sadece boş klasörler açmak','Bütün interface isimlerini ezberlemek','README’ye bütün teknolojileri yazmak'],'Çalışan küçük özellik, gerçek gereksinimleri görmeni sağlar.'],
['Servisin test edilebilirliğine ne yardımcı olur?',['Bağımlılık ve davranış sınırlarının açık olması','Tüm durumun global olması','Her metodun HTTP’ye bağlı olması','İçeride rastgele secret üretmek'],'Anlaşılır sınırlar test girdisini ve beklenen sonucu kontrol etmeyi kolaylaştırır.'],
['Çok sayıda klasör neyi garanti etmez?',['İyi sorumluluk ayrımını','Daha fazla dosya yolunu','Daha fazla isim gereksinimini','Gezinme ihtiyacını'],'Mimari kalite klasör sayısından değil davranış ve sınırların açıklığından gelir.'],
['Fiyat hesabı API ve başka arayüzde ortak. Nerede toplamak yararlı olabilir?',['HTTP’den bağımsız bir iş bileşeninde','CSS dosyasında','Her endpoint’e farklı kopya olarak','Git commit mesajında'],'Tek kuralın farklı kopyalarının zamanla çelişmesini önlemeye yardımcı olur.']
]);
add('proje',[
['Somut kabul ölçütü hangisi?',['Geçerli POST 201 döndürür ve yeniden GET ile kayıt okunur','Her şey güzel çalışır','Kodda çok klasör vardır','Birçok araç ismi kullanılmıştır'],'Girdi, işlem, çıktı ve veri etkisi ölçülebilir olmalı.'],
['Görev başlığı boşken 400 dönüyor ama kayıt ekleniyor. Proje doğru mu?',['Hayır; veri etkisi de hatalıdır','Evet; kod 400 ise yeter','Sadece UI yenilenirse doğrudur','Yalnızca SQLite’ta normaldir'],'Kabul ölçütü yanıt ile birlikte kalıcı etkiyi de kapsamalıdır.'],
['İlk sürüme login eklemeden önce hangi hedef değerli?',['Çalışan ve test edilen temel CRUD','Önce tüm mikroservis araçları','Sadece görsel animasyon','Henüz olmayan özelliği CV’ye yazmak'],'Küçük kapsam öğrenmeyi ve doğrulamayı yönetilebilir tutar; çok kullanıcılı sürümde güvenlik şartları eklenir.'],
['Kitap-yazar projesi hangi yeni beceriyi çalıştırır?',['İlişki modelleme ve sorgu','Sadece sayı bölme','Runtime indirme hızını ölçme','Her zaman ödeme entegrasyonu'],'Bir yazarın birden çok kitabı, foreign key ve projection için iyi pratik sağlar.'],
['README’de “bilinen sınırlar” neden yararlıdır?',['Projenin gerçekten ne yaptığını açıklar','Eksikleri gizler','Bütün testlerin yerini alır','Kodu otomatik tamamlar'],'Dürüst kapsam, değerlendiren kişinin projeyi doğru anlamasına yardım eder.'],
['Tamamlanmış özelliği nasıl anlatırsın?',['Yaptığın akışı ve doğruladığın davranışı somut örnekle','Duyduğun tüm terimlerde uzmanlık iddia ederek','Sadece araç logosu göstererek','Başkalarının üretim deneyimini aktararak'],'Öğrenme çalışması ile profesyonel iş deneyimini ayrı tut.']
]);
add('deploy',[
['Yerelde çalışan SQLite dosyası her hosting’de kalıcı mıdır?',['Hayır; dosya yaşam döngüsü platforma bağlıdır','Evet; dosya adı .db ise','Sadece GET kullanılırsa','Her zaman Git’te tutulduğu için'],'Ephemeral disk yeniden başlatma veya dağıtımda kaybolabilir; kalıcı depolama planlanır.'],
['Production’da hangi hata yanıtı daha uygundur?',['Hassas ayrıntısız sözleşme ve kontrollü log','Tam connection string','Stack trace ve gerçek parola','Bütün exception nesnesi'],'Hata incelemesi için log ve ilişkilendirme kimliği kullanılabilir; sırlar istemciye verilmez.'],
['Deploy sonrası ne kontrol edilir?',['Gerçek URL’de başarı, hata ve kalıcılık akışları','Yalnızca sayfa başlığı','Sadece paket klasörünün adı','IDE’nin açık olması'],'Ortam ayarı, ağ ve depolama yerelden farklı olabilir.'],
['Runtime-dependent dağıtımın hedefinde ne gerekir?',['Uygun .NET runtime','Mutlaka aynı kod editörü','Her zaman SQL Server Express','C# kaynaklarının tarayıcıya gönderilmesi'],'Self-contained dağıtım farklı bir seçenektir; hedef mimari ve platformla uyum gerekir.'],
['Geri dönüş planı ne içermeli?',['Önceki sağlıklı sürüme ve uyumlu veri durumuna dönüş yaklaşımı','Sadece tarayıcı geri düğmesi','Logları tamamen silmek','Gizli anahtarı açık etmek'],'Kod sürümü ve şema değişikliği birlikte değerlendirilir; eski kod yeni şemayla uyumlu olmayabilir.'],
['/health 200 fakat DB kapalı. Bu mümkün mü?',['Evet; endpoint DB’yi denetlemiyorsa','Hayır; 200 bütün sistemi kanıtlar','Sadece POST açıksa','SQL sorgusu her route’ta zorunludur'],'Sağlık kontrolünün neyi ölçtüğü açık olmalıdır.']
]);
add('mulakat',[
['“SQL öğreniyorum” diyen biri becerisini nasıl somutlaştırır?',['Yazabildiği SELECT, JOIN ve filtre örneğiyle','Her veritabanında uzmanım diyerek','Yalnızca SQL logosuyla','Başkasının CV’sini okuyarak'],'Bir örneği açıklamak ve değiştirebilmek gerçek düzeyi daha iyi gösterir.'],
['Bir hata anlatımında ilk yararlı ayrım?',['Beklenen ile gözlenen davranış','Kodun kaç renk olduğu','Editörün lisansı','Dosyanın masaüstünde olup olmadığı'],'Tekrar üretme adımı ve log gibi kanıtlarla sorunu daralt.'],
['Öğreticide gördüğün JWT için nasıl konuşursun?',['Kavramı öğrendiğini, uygulama durumunu ayrıca belirtirsin','Üretim sistemleri yönettim dersin','Her token biçimini bildiğini söylersin','Hiç güvenlik sınırı yok dersin'],'Kavramsal bilgi, öğretici takibi ve bağımsız uygulama birbirinden farklı düzeylerdir.'],
['POST akışını açıklarken hangisi eksiktir?',['Kaydetme çağrısını ve veri etkisini atlamak','Girdiyi söylemek','Doğrulamayı anlatmak','Yanıt kodunu belirtmek'],'DTO’dan entity’ye geçiş ve SaveChanges gibi kalıcılık adımı akışın önemli parçasıdır.'],
['Bilmediğin bir soruda yapıcı yaklaşım?',['Bilmediğini söyleyip bildiğin sınırı ve araştırma yolunu anlatmak','Rastgele teknoloji isimleri söylemek','Başkasının deneyimini üstlenmek','Her soruya kesin cevap uydurmak'],'Açık belirsizlik ve düşünme yöntemi, yanlış uzmanlık iddiasından daha güvenilirdir.'],
['Dersleri bitirmek neyi kanıtlamaz?',['Profesyonel iş deneyimini veya bağımsız proje yetkinliğini','Bir öğrenme rotasını çalıştığını','Konuları gördüğünü','Tekrar için zaman ayırdığını'],'Gerçek uygulama, test ve geri bildirim öğrenmeyi pekiştirir.']
]);
add('sqlserver',[
['UseSqlServer hangi bağımlılığı gerektirir?',['Microsoft.EntityFrameworkCore.SqlServer sağlayıcısını','Sadece CSS paketini','Yalnızca Microsoft Word’ü','Her zaman SQLite provider’ını'],'Sağlayıcıya özgü uzantı ve SQL çevirisi uygun NuGet paketinden gelir.'],
['Bağlantı dizesi neden configuration’dan okunur?',['Ortam değerlerini koddan ve secret’lardan ayırmak için','Bütün parolaları istemciye vermek için','SQL sorgusunu kaldırmak için','Derleyiciyi kapatmak için'],'Geliştirme ve üretim farklı bağlantılar kullanabilir; kod anahtar adıyla okur.'],
['SQL Server ve SQLite geçişinde neyi varsaymamalısın?',['Bütün SQL ve migration davranışlarının aynı olduğunu','İkisinin ilişkisel motorlar olabildiğini','EF provider seçildiğini','Veri modelinin önemli olduğunu'],'Tipler, özellikler ve sağlayıcı migration çıktıları farklı olabilir.'],
['Bağlantı kurulamıyor. İlk yaklaşım?',['Ağ, servis, kimlik ve hedef DB izinlerini sırayla kontrol et','Şifrelemeyi her durumda kapat','Gerçek parolayı forumda paylaş','Entity isimlerini rastgele değiştir'],'Hata sınıfını daraltmak, güvenliği zayıflatan rastgele değişikliklerden kaçınmanı sağlar.'],
['Kullanıcı sunucuya bağlanıyor ama tablo yazamıyor. Olası sorun?',['Veritabanı yetkisi','Butonun yuvarlaklığı','JSON fontu','Git branch adının uzunluğu'],'Sunucuya erişim, kimlik doğrulama ve işlem yetkisi farklı kontrollerdir.'],
['AddDbContext neyi sağlar?',['DbContext’i DI’a uygun yaşam süresiyle kaydeder','Veritabanını her istekte siler','Bütün migration’ları otomatik üretir','Tüm kullanıcıları admin yapar'],'Bağlantı ve provider ayarı options üzerinden verilir; şema yönetimi ayrı adımdır.'],
['Örnek connection string’de KENDI_BAGLANTIN nedir?',['Kullanıcının yerel ayarıyla değiştireceği açıklayıcı yer tutucu','Paylaşılan gerçek bir SQL hesabı','Her makinede çalışan sihirli parola','EF’in varsayılan sunucusu'],'Kılavuz gerçek kimlik bilgisi taşımaz. Gizli değerler paylaşılmamalıdır.'],
['Provider paketlerinin ana sürümleri için iyi yaklaşım?',['EF Core ailesinde uyumlu sürümler kullanmak','Rastgele karışık major sürüm seçmek','Hepsini sürekli preview yapmak','Sürüm dosyasını kaldırmak'],'Sürüm uyumluluğunu resmî sağlayıcı belgesinden kontrol et.']
]);
add('aggregate',[
['COUNT(*) neyi sayar?',['Gruba dahil tüm satırları','Yalnızca null olmayan açıklamaları','Sadece benzersiz kullanıcı adlarını','Her zaman tablo sayısını'],'COUNT(sütun) ise o sütundaki null değerleri saymaz.'],
['WHERE ile HAVING farkı?',['WHERE satırları, HAVING grupları filtreler','İkisi de tablo siler','WHERE sadece sayı sıralar','HAVING mutlaka JOIN yapar'],'Satır filtresi gruplama öncesi, toplama koşulu grup sonucu üzerinde uygulanır.'],
['GROUP BY KullaniciId ne oluşturur?',['Her kullanıcı kimliği için grup','Her görev için yeni veritabanı','Sadece bir sabit satır','Otomatik kullanıcı yetkisi'],'Toplama fonksiyonları her grup üzerinde hesaplanır.'],
['Üç görev, iki kullanıcı varsa COUNT(*) GROUP BY KullaniciId kaç grup döndürür?',['Kayıtlarda yer alan farklı kullanıcı sayısı kadar','Her zaman 3','Her zaman 1','Veritabanı sayısı kadar'],'Sonuç sayısı görevlere bağlı farklı KullaniciId değerlerine göre oluşur.'],
['JOIN sonrası sayı beklenenden büyük. Ne incelenir?',['Birleştirme nedeniyle satır çoğalması ve tane düzeyi','Sadece font boyutu','HTTP header rengi','Runtime kurulum ekranı'],'Bir görev birden fazla alt satırla birleşirse COUNT görev yerine birleşmiş satırları sayabilir.'],
['Toplamı 1000’den büyük kategoriler hangi koşulla seçilebilir?',['HAVING SUM(Tutar) > 1000','WHERE SUM(Tutar) > 1000 tek başına','ORDER SUM > 1000','DELETE SUM(Tutar)'],'Gruplanmış toplam üzerindeki koşul HAVING ile ifade edilir.'],
['Tamamlanan görev sayısı için uygun sorgu?',['SELECT COUNT(*) FROM Gorevler WHERE Tamamlandi=1','SELECT SUM(Baslik) FROM Gorevler','DELETE WHERE COUNT(*)','SELECT * ORDER COUNT'],'Önce tamamlanan satırlar seçilir, sonra sayılır.'],
['SELECT KullaniciId, Baslik, COUNT(*) GROUP BY KullaniciId niçin sorunlu?',['Baslik toplama veya grupla uyumlu değildir','COUNT yıldız kabul etmez','KullaniciId hiçbir zaman seçilemez','GROUP BY sadece string içindir'],'Seçilen toplama dışı alanların grup anlamı açık olmalıdır. SQLite’ın gevşek davranışına güvenerek taşınabilir sonuç varsayma.']
]);
add('transaction',[
['Transaction temel olarak ne sağlar?',['İlişkili veri yazmalarını ortak başarı/geri alma altında toplar','Her HTTP çağrısını şifreler','Bütün sorguları hızlandırma garantisi','İstemci fontunu sabitler'],'Amaç tutarlılıktır; iş yükü ve kilit etkisi ayrıca değerlendirilir.'],
['Commit ne yapar?',['Transaction değişikliklerini kabul eder','Her zaman geri alır','Sadece log rengini değiştirir','DTO’yu null yapar'],'Rollback geri alma, commit başarılı sonlandırmadır.'],
['Rollback hangi etkiyi kendiliğinden geri almaz?',['Dış servise gönderilmiş e-postayı','Aynı transaction içindeki DB eklemesini','Aynı transaction içindeki desteklenen güncellemeyi','DB içindeki henüz commit edilmemiş değişikliği'],'Veritabanı transaction’ı dış sistemlerdeki yan etkileri otomatik kapsamaz.'],
['EF Core tek SaveChanges içinde ne yapabilir?',['Destekleyen sağlayıcıda değişiklikleri transaction içinde yazar','Her entity için mutlaka ayrı sunucu açar','Tüm HTTP çağrılarını aynı transaction’a alır','Her zaman bütün DB’yi kopyalar'],'Birden fazla SaveChanges ve retry stratejisi gibi durumlar ayrıca tasarlanmalıdır.'],
['Uzun ağ çağrısını açık transaction içinde tutmak?',['Kilit ve kaynak süresini artırabilir','Her zaman en hızlı yoldur','DB’yi otomatik read-only yapar','Bütün tutarlılık sorunlarını çözer'],'Transaction kapsamını gerekli veri işlemleriyle sınırlamayı değerlendir.'],
['catch içinde rollback sonrası throw ne sağlar?',['Asıl hatanın çağırana iletilmesini','Başarı yanıtı üretilmesini','Hatayı tamamen yok saymayı','Tüm kayıtları yeniden eklemeyi'],'Geri alma sonrası hatayı sessizce yutmak sorun gözlemini engelleyebilir.'],
['Stok azaltma başarılı, sipariş ekleme başarısız. Aynı transaction’da hedef?',['İkisinin de kalıcı olmaması','Sadece stok azalmasının kalması','Siparişin iki kez yazılması','Her durumda 201 dönmek'],'İşin parçalarının yarım kalmaması temel tutarlılık gereksinimidir.'],
['Transaction kullanmak erişim kontrolünün yerine geçer mi?',['Hayır; izinler ayrıca kontrol edilir','Evet; herkes otomatik yetkilidir','Sadece GET’te geçer','Yalnızca SQL Server’da geçer'],'Tutarlılık, kimlik ve yetki farklı sorumluluklardır.']
]);
add('relations',[
['Navigation property neyi ifade eder?',['Entity’ler arası nesne ilişkisini','HTTP header’ını','Git branch’ini','Parola hash’ini'],'Foreign key veritabanındaki referansı taşır; navigation modelde ilişkiyi kullanmayı kolaylaştırır.'],
['Yalnızca başlık ve kullanıcı adı isteniyor. Uygun sorgu?',['Select ile gereken alanlara projection','Her kullanıcı parolasını da yüklemek','Her zaman tüm ilişkileri Include etmek','Sorgusuz tüm veriyi göndermek'],'Projection veri miktarını ve gereksiz alan açılmasını azaltabilir.'],
['Include her projection için zorunlu mu?',['Hayır; navigation kullanılan Select uygun SQL’e çevrilebilir','Evet; bütün Select’ler önce Include ister','Yalnızca bool varsa','Sadece konsol uygulamasında'],'Sağlayıcı çevirisini ve üretilen sorguyu gözlemle.'],
['N+1 problemi hangi akışta ortaya çıkabilir?',['Listeyi alıp her satır için ek ilişki sorgusu çalıştırmak','Tek bir SELECT çalıştırmak','Basit health yanıtı vermek','Hiç veri okumamak'],'Sorgu sayısı kayıt sayısıyla artar ve gecikme büyüyebilir.'],
['İki yönlü entity ilişkisini doğrudan JSON’a döndürmenin riski?',['Döngüsel referans ve gereksiz/hassas veri','Otomatik migration hatası her zaman','C# derlenememesi zorunlu','Bütün kayıtların silinmesi'],'Response DTO ile hangi alanın dışarı çıkacağını sınırla.'],
['KullaniciId hangi tür sorumluluğu taşır?',['İlişkinin foreign key değerini','Kullanıcının bütün yetki politikasını','JWT imzasını','Veritabanı şifresini'],'FK, kullanıcının bu kaydı görmeye yetkili olduğunu kanıtlamaz.'],
['İlişki eklenince mevcut şema için ne gerekir?',['Migration etkisini planlayıp uygulamak','Sadece uygulama simgesini yenilemek','İstemciyi silmek','GitHub yıldızı eklemek'],'Yeni FK ve sütunlar, eski verinin uyumunu da gerektirebilir.'],
['null! bir navigation başlangıcında neyi garanti etmez?',['Çalışma anında değerin mutlaka dolu olduğunu','Derleyici null uyarısını bastırabildiğini','Kaynak kodda bir ifade olduğunu','Modelle ilgili niyet bildirdiğini'],'Null-forgiving operator runtime doğrulaması yapmaz; model ve yükleme davranışını kontrol et.']
]);
add('controller',[
['API controller için yaygın temel sınıf?',['ControllerBase','DbContext','HttpClient','Migration'],'ControllerBase, view gerektirmeyen HTTP API davranışları sunar.'],
['MapControllers çağrısı ne için gerekir?',['Controller endpoint’lerini route’a eşlemek','DTO’yu veritabanına yazmak','JWT üretmek','SQL bağlantısını şifrelemek'],'Servis kaydı AddControllers ve endpoint eşleme MapControllers farklı adımlardır.'],
['GorevlerController ve [Route("api/[controller]")] sonucu?',['/api/Gorevler tabanı','/api/ControllerBase','/GorevlerController.cs','Sadece /health'],'[controller] sınıf adından Controller son eki çıkarılarak yerleştirilir.'],
['[HttpGet("{id:int}")] ne tanımlar?',['Sayısal route kimlikli GET action’ı','Her Id için kayıt garantisini','SQL primary key’i','POST doğrulamasını'],'Kaynak varlığı action içindeki sorguyla ayrıca kontrol edilir.'],
['[ApiController] ile ilgili doğru ifade?',['API model bağlama/doğrulama davranışları sağlar','Veritabanını otomatik kurar','Kullanıcı login sistemini tamamlar','Tüm metotları async yapar'],'Controller otomatik 400 davranışı ile farklı Minimal API doğrulama ayarlarını karıştırma.'],
['IActionResult ne için yararlıdır?',['Farklı HTTP sonuçlarını ortak dönüş sınırında ifade etmek','Yalnızca SQL sonucu saymak','Derleyici sürümünü seçmek','JSON’u şifrelemek'],'Ok, NotFound ve BadRequest gibi farklı sonuçlar döndürülebilir.'],
['Controller’da DI nasıl sağlanabilir?',['Constructor parametreleriyle','Bütün secret’ları route’a yazarak','Her istekte rastgele new ederek zorunlu','Sadece static global alanlarla'],'Servis kayıtlarıyla birlikte constructor injection kullanılabilir.'],
['Minimal API bilen biri controller’a geçerken hangi bilgi geçerliliğini korur?',['HTTP, DTO, DI ve veri erişimi kavramları','Yalnızca dosya adları','Hiçbiri','Sadece CSS bilgisi'],'Kod örgütlenmesi farklı olsa da platform ve backend kavramları ortaktır.']
]);
add('paging',[
['Sayfa 3, boyut 10 için Skip kaç?',['20','30','10','3'],'(sayfa - 1) * boyut formülü ilk iki sayfanın 20 satırını atlar.','Kod okuma'],
['Skip/Take öncesi neden OrderBy gerekir?',['Tutarlı sayfa sırası için','Tüm kayıtları silmek için','JSON’u doğrulamak için','JWT süresini belirlemek için'],'Benzersiz ve kararlı sıra olmadan sayfa sonuçlarına güvenilmez.'],
['ToListAsync sonrası Skip/Take nerede çalışır?',['Bellekte; tüm veri zaten gelmiş olabilir','Kesin olarak SQL’de','Her zaman ayrı sunucuda','İstemci CSS’inde'],'Sayfalama sınırını veritabanına göndermek için sorguyu erken somutlaştırma.'],
['Sayfa boyutuna üst sınır niçin konur?',['Aşırı veri ve kaynak tüketimini sınırlamak','Daha fazla parola saklamak','Null değerleri silmek','SDK kurulmasını engellemek'],'İstemci tercihi sunucu kaynak politikasının yerine geçmez.'],
['Where(g => !g.Tamamlandi) neyi seçer?',['Tamamlanmamış görevleri','Tamamlanmış görevleri','Sadece null başlıkları','Bütün kullanıcıları'],'! bool değerini tersine çevirir.','Kod okuma'],
['Çok ileri sayfalarda offset yerine hangi yaklaşım değerlendirilebilir?',['Son görülen anahtara dayalı keyset sayfalama','Sıralamayı kaldırma','Tüm tabloyu her defasında gönderme','Her satıra yeni DbContext oluşturma'],'Id > sonId gibi koşul uygun index ve sıralamayla ilerlemeyi sağlayabilir.'],
['Sayfalama yetkilendirme yapar mı?',['Hayır; kullanıcı filtresi ayrıca uygulanır','Evet; sayfa 1 güvenlidir','Sadece 10 kayıt varsa','Id sıralıysa her zaman'],'Önce erişilebilen kayıt kümesini belirle; sonra filtre/sıralama/sayfa uygula.'],
['Math.Clamp(boyut,1,50) ne yapar?',['Değeri 1 ile 50 aralığına sınırlar','Her değeri 50 yapar','Listeyi 1 kayıtla siler','Değeri string’e çevirir'],'Girdi politikasına göre hatalı aralığı reddetmek de bir seçenektir.','Kod okuma']
]);
add('cancellation',[
['CancellationToken temel olarak nedir?',['İşbirlikçi iptal sinyali','İşi zorla sonlandıran thread katili','JWT biçimi','Veritabanı anahtarı'],'Alt işlemin token’ı desteklemesi ve izlemesi gerekir.'],
['Token alındı ama ToListAsync’e geçirilmedi. Ne eksik?',['İptal sinyalinin veri işlemine iletimi','Sorgunun Id alanı','DTO sınıf adı','CSS yüklemesi'],'Token’ı sadece parametre olarak almak alt çağrıyı otomatik iptal etmez.'],
['İstemci bağlantısını iptal etti. Daha önce commit edilmiş kayıt?',['İptal onu otomatik geri almaz','Kesin olarak silinir','Her zaman iki kopya olur','Tarayıcı onu DB’den temizler'],'İptal ve transaction sonucu ayrı değerlendirilir.'],
['Aynı DbContext’te iki sorguyu Task.WhenAll ile paralel başlatmak?',['Eşzamanlı kullanım hatası doğurabilir','Her zaman önerilir','SQL’i iki kat güvenli yapar','DbContext’i otomatik çoğaltır'],'Context thread-safe değildir; ayrı işler için uygun ayrı context/ömür tasarımı gerekir.'],
['İstemci iptali her zaman beklenmedik sunucu hatası mıdır?',['Hayır; beklenen akış olabilir','Evet; her iptal veri kaybıdır','Sadece GET’te imkânsızdır','Her zaman 201 ile dönmelidir'],'Log politikası ve hata sözleşmesi nedenini ayırmalıdır.'],
['await ile .Result arasındaki tercih neden önemlidir?',['Bloklama ve asenkron akışın korunması','Tüm SQL türlerinin değişmesi','DTO’nun kalıtımı','Runtime adının kısalması'],'Asenkron I/O zincirini beklenmedik senkron beklemeyle kırma.'],
['Token hangi durum için faydalıdır?',['Kullanıcı ayrıldığında gereksiz sorgu işini durdurabilmek','API’ye sınırsız izin vermek','Veritabanı parolasını saklamak','Bütün CPU işlerini hızlandırmak'],'Kaynak tüketimini azaltmaya yardımcı olur; destek ve zamanlama önemlidir.'],
['ToListAsync(ct) iptali için hangisi doğrudur?',['Sağlayıcı ve işlemin iptal desteği önemlidir','Her sorgu tam aynı anda durur','Önceden kaydedilen her veri geri alınır','Token boş olsa bile mutlaka iptal eder'],'Cancellation işbirlikçi bir mekanizmadır, kesin zamanlı zorla kesme değildir.']
]);
add('problem',[
['ProblemDetails neyi standartlaştırır?',['HTTP API hata gövdesini','Veritabanı tablo adlarını','C# sınıf kalıtımını','JWT imza anahtarını'],'title/status/detail gibi ortak alanlar istemcinin hatayı yorumlamasını kolaylaştırır.'],
['ProblemDetails kullanınca bütün hatalar 500 mü olur?',['Hayır; uygun HTTP kodu seçilir','Evet; formatın şartıdır','Sadece POST’lar 500 olur','404 artık kullanılamaz'],'Yanıt biçimi ile hatanın semantiği farklıdır.'],
['Boş başlık gibi beklenen girdi hatası için bu uygulamada?',['400','500','201','204'],'Doğrulama hatası başarılı kayıt değildir; sunucunun beklenmedik çökmesi gibi ele alınmaz.'],
['Hata gövdesine hangisi konmamalıdır?',['Gerçek bağlantı dizesi ve stack trace','Kullanıcıya uygun başlık','HTTP durum kodu','Güvenli ilişkilendirme kimliği'],'İç ayrıntılar kontrollü logda saklanır; secret’lar hiçbir yanıtla ifşa edilmez.'],
['HTTP 404, gövdede status=200. Sorun nedir?',['Yanıt sözleşmesinde tutarsızlık','Her zaman doğru standart','JSON’da sayı kullanılamaz','C# derlenmez'],'İstemci hangi durumu esas alacağını net anlamalıdır; kod ve gövde tutarlı olmalı.'],
['AddProblemDetails neyin yerine geçmez?',['İş kuralı doğrulamasının ve erişim kontrolünün','Hata gövdesi hizmetinin','Ortak hata biçimi desteğinin','Hata sunum altyapısının'],'Bir format eklemek uygulama doğruluğunu otomatik sağlamaz.'],
['Trace kimliği ne için yararlı olabilir?',['Kullanıcı raporunu sunucu loguyla ilişkilendirmek','Kullanıcının parolasını temsil etmek','Bütün token’ları açık etmek','SQL yetkisini yükseltmek'],'Teknik ayrıntıları istemciye dökmeden sorunun izini bulmaya yardımcı olur.'],
['Örnek endpoint her Id için 404 üretiyor. Bu neyi kanıtlamaz?',['Gerçek veritabanı araması yapıldığını','HTTP yanıtı dönebildiğini','Örnek hata sözleşmesi üretilebildiğini','Routing’in çalışabildiğini'],'Öğretim örneğinin gösterdiği davranışla gerçek proje özelliğini ayır.']
]);
})();
