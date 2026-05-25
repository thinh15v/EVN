using DHSX.Web.Application.DTOs;
using DHSX.Web.Application.Interfaces;
using DHSX.Web.Application.Services;
using DHSX.Web.Domain.Entities;
using DHSX.Web.Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins("http://localhost:3000" , "https://evn-munq.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IAuthService, MockAuthService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IStorageService, MinioStorageService>();
builder.Services.AddHttpClient<IEmailService, DHSX.Web.Infrastructure.Services.EmailService>();
builder.Services.AddHttpClient<IExternalDirectoryService, DHSX.Web.Infrastructure.Services.ExternalDirectoryService>();

builder.Services.AddDbContext<OracleDbContext>(options =>
{
    options.UseOracle(
        builder.Configuration.GetConnectionString("DefaultConnection"))
           .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
           .EnableSensitiveDataLogging();
});
builder.Services.AddScoped<IOracleDbContext>(provider => provider.GetRequiredService<OracleDbContext>());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{ 
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.UseCors("AllowNextJs");

app.UseAuthorization();
app.MapControllers();
app.Run();