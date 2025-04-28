using BookStore.Api.DTOs.Requests;
using BookStore.Api.Mappings;
using BookStore.Domain.Entities;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints
{
    public static class CategoriesEndpoints
    {
        public static void Map(WebApplication app)
        {
            var group = app.MapGroup("/api/categories");

            group.MapGet("", async (BookStoreDbContext db) =>
            {
                var list = await db.BookCategories.ToListAsync();
                return Results.Ok(list.Select(c => c.ToDto()));
            });

            group.MapGet("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var cat = await db.BookCategories.FindAsync(id);
                return cat is not null
                    ? Results.Ok(cat.ToDto())
                    : Results.NotFound();
            });

            group.MapPost("", async (CreateCategoryDto dto, BookStoreDbContext db) =>
            {
                var cat = dto.ToEntity();
                db.BookCategories.Add(cat);
                await db.SaveChangesAsync();
                return Results.Created($"/api/categories/{cat.Id}", cat.ToDto());
            });

            group.MapPut("/{id}", async (UpdateCategoryDto dto, BookStoreDbContext db) =>
            {
                if (!await db.BookCategories.AnyAsync(c => c.Id == dto.Id))
                    return Results.NotFound();

                var cat = dto.ToEntity();
                db.BookCategories.Attach(cat);
                await db.SaveChangesAsync();
                return Results.Ok(cat.ToDto());
            });

            group.MapDelete("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var deletedRecords = await db.BookCategories.Where(c => c.Id == id).ExecuteDeleteAsync();

                if (deletedRecords.Equals(0)) {
                    return Results.NotFound();
                } else {
                    await db.SaveChangesAsync();
                    return Results.NoContent();
                }
            });
        }
    }
}
