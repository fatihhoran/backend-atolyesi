# Backend Atölyesi — bağımsız kurulum

Bu paket, Türkçe ve İngilizce seçenekli uygulamanın bağımsız statik sürümüdür. Çalışması için ChatGPT, OpenAI hesabı veya bir AI aboneliği gerekmez. LLM laboratuvarı yerel bir eğitim simülasyonudur.

## Ücretsiz GitHub Pages yayını

1. GitHub hesabında **backend-atolyesi** adlı yeni bir **Public** depo oluştur.
2. Bu ZIP’i bilgisayarında aç. İçindeki **backend-atolyesi** klasörünün İÇERİĞİNİ deponun köküne yükle: index.html, sw.js, manifest.json, .nojekyll ve diğer dosya/klasörler birlikte durmalı. Add file → Upload files ile yükleyip commit et. ZIP dosyasını tek parça yüklemek uygulamayı yayımlamaz.
3. Depoda Settings → Pages → Build and deployment → Source: **Deploy from a branch** seç.
4. Branch: **main**, klasör: **/(root)** → Save. İşlem tamamlanınca Pages ekranındaki gerçek **Visit site** bağlantısını aç.
5. Adres genellikle `https://KULLANICI.github.io/backend-atolyesi/` biçimindedir. Bu bir örnek biçimdir; gerçek bağlantıyı GitHub’dan kopyala. İngilizce paylaşım için gerçek bağlantının sonuna `?lang=en` ekleyebilirsin.

Bir özel alan adın varsa Settings → Pages → Custom domain üzerinden bağlayabilirsin; alan adı satın almak bu paketin parçası değildir. GitHub’ın verdiği HTTPS adresiyle başlayabilirsin. Özel alan adı için GitHub’ın DNS/HTTPS adımlarını izle.

## Telefona ekleme

- Android: yayımlanan bağlantıyı Chrome’da aç → ⋮ → Uygulamayı yükle / Ana ekrana ekle. Uygulamadaki kurulum kontrolünde paketin **Hazır** olmasını bekle.
- iPhone: bağlantıyı Safari’de aç → Paylaş → Ana Ekrana Ekle → Ekle.
- Bağlantı LinkedIn içinde açıldıysa telefonun Chrome/Safari tarayıcısında aç seçeneğini kullan.

ZIP’i doğrudan telefonda açmak kurulum değildir. İlk açılış için internet ve yayımlanmış HTTPS bağlantısı gerekir; paket hazırlandıktan sonra yerel ders, test ve laboratuvarlar çevrimdışı kullanılabilir. Dış bağlantılar internet ister. APK/App Store paketi değildir.

## Önceki ilerlemeni taşıma

Eski adreste Ayarlar’dan **Yedeği dışa aktar**, yeni adreste **Yedekten yükle** kullan. Yeni alan adı veya tarayıcı eski kaydı otomatik okuyamaz. Yedeği GitHub’a yükleme; kişisel notlarını içerebilir. Dili değiştirmek aynı adreste notlarını ve ilerlemeni silmez.

## Marka ve paylaşım

Görünen ürün adı **Backend Atölyesi**. Bağımsız adreste ChatGPT alan adı görünmez. İstersen kendi alan adını kullan; kaynak dosyaların tamamı düzenlenebilir. Yeni bir adrese geçince LinkedIn’de yeni canlı bağlantıyı paylaş.

Bu uygulamanın arayüzü HTML/CSS/JavaScript ve PWA özellikleriyle çalışır; SQL laboratuvarı SQLite/WebAssembly kullanır. C# / ASP.NET Core / EF Core ders konularıdır ve indirilebilir Görev API paketi ayrı bir .NET örneğidir. Paylaşımında bu ayrımı koru. Kod örneklerindeki MIT lisans bildirimlerini kaldırma.

Resmî rehberler:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Güncelleme

Değiştirdiğin dosyaları aynı depoya yükle. Daha sonraki kod değişikliklerinde sürümlü dosya adlarını ve sw.js önbellek sürümünü birlikte artır; eski dosyaları yeni uygulamayla karıştırma. Kullanıcılardan tarayıcı verilerini silmelerini isteme; önce yedek almalarını sağla.
