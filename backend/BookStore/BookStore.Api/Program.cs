using BookStore.Api.Endpoints;
using BookStore.Api.Extensions;
using BookStore.Identity.Extensions;
using BookStore.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

BooksEndpoints.Map(app);
AuthorsEndpoints.Map(app);
CategoriesEndpoints.Map(app);
app.MapAuthEndpoints();

await app.Services.SeedRolesAndAdminAsync();

app.Run();

