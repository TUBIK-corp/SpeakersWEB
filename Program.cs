using SpeakersWEB.Models;
using System.Diagnostics;
using System.Net.Sockets;

internal class Program
{

    public static TcpClient client;
    private static void Main(string[] args)
    {
        string filePath = Path.Combine(Environment.CurrentDirectory, "Recognizer\\entry_point.py");
        
        Process process = new Process();
        ProcessStartInfo startInfo = new ProcessStartInfo();
        startInfo.FileName = $"python";
        startInfo.Arguments = $"{filePath} {Path.Combine(Environment.CurrentDirectory, "Recognizer")}";
        startInfo.UseShellExecute = true;
        process.StartInfo = startInfo;
        process.Start();
        Thread.Sleep(5000);
        client = new TcpClient("127.0.0.1", 12345);


        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllersWithViews();
        builder.Services.AddDbContext<BellsContext>();
        //builder.Services.AddTransient<CookieService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();


        app.MapControllerRoute(
            name: "default",
            pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html"); ;

        app.Run();
    }
}

