using BookStore.Api.Endpoints;
using BookStore.Api.Extensions;
using BookStore.Identity.Extensions;
using BookStore.Infrastructure.Data;
using BookStore.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policyBuilder =>
    {
        policyBuilder
          .WithOrigins("http://localhost:4200")
          .AllowAnyHeader()                       
          .AllowAnyMethod();
    });
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowAngularClient");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapAuthorEndpoints();
app.MapCategoryEndpoints();
app.MapBookEndpoints();
app.MapOrderEndpoints();
app.MapUserEndpoints();

await app.Services.SeedRolesAndAdminAsync();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<BookStoreDbContext>();
    dbContext.Database.Migrate();
}

app.Run();

