var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();

var app = builder.Build();
app.UseExceptionHandler();
app.MapGet("/health", () => TypedResults.Ok(new { durum = "ok" }));

// Hafta 2: /api/urunler rotalarını ekle.
// Hafta 3–6 için ayrı bir projede /api/gorevler rotalarını geliştir.

app.Run();

public partial class Program;
