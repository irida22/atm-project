using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ATM.Infrastructure.Data;
using ATM.Core.Application;
using ATM.API.DTOs;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(Path.Combine(builder.Environment.ContentRootPath, "Config"))
    .AddJsonFile("appsettings.json");

builder.Services.AddCors()
    .AddDbContext<AtmDbContext>(options => 
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")))
    .AddScoped<UserService>();

var app = builder.Build();

app.UseCors(options => options
    .WithOrigins("http://localhost:5173")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapPost("/api/login", async (LoginRequest request, UserService userService) =>
    await userService.ValidateUserAsync(request.Username, request.Password) is var user
        ? Results.Ok(new { userId = user.Id })
        : Results.Unauthorized());

app.Run();
