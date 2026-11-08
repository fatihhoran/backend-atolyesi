var gorevler = new List<Gorev>();

while (Console.ReadLine() is { } satir)
{
    if (satir == "cik") break;

    // Önce komut ve argümanı ayır. Komutları birer birer ekle.
    // ekle <başlık>, tamamla <id>, liste
    Console.WriteLine("HATA komut");
}

sealed class Gorev(int id, string baslik)
{
    public int Id { get; } = id;
    public string Baslik { get; } = baslik;
    public bool Tamamlandi { get; private set; }

    public void Tamamla() => Tamamlandi = true;
}
