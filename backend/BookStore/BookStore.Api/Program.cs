using BookStore.Api.Endpoints;
using BookStore.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.UseHttpsRedirection();

BooksEndpoints.Map(app);
AuthorsEndpoints.Map(app);
CategoriesEndpoints.Map(app);

app.Run();

