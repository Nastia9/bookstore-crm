using BookStore.Api.DTOs.Requests;
using BookStore.Api.Mappings;
using BookStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Api.Endpoints
{
    public static class AuthorsEndpoints
    {
        public static void Map(WebApplication app)
        {
            var group = app.MapGroup("/api/authors");

            group.MapGet("", async (BookStoreDbContext db) =>
            {
                var list = await db.Authors.ToListAsync();
                return Results.Ok(list.Select(a => a.ToDto()));
            });

            group.MapGet("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var author = await db.Authors.FindAsync(id);
                return author is not null
                    ? Results.Ok(author.ToDto())
                    : Results.NotFound();
            });

            group.MapPost("", async (CreateAuthorDto dto, BookStoreDbContext db) =>
            {
                var author = dto.ToEntity();
                db.Authors.Add(author);
                await db.SaveChangesAsync();
                return Results.Created($"/api/authors/{author.Id}", author.ToDto());
            });

            group.MapPut("/{id}", async (UpdateAuthorDto dto, BookStoreDbContext db) =>
            {
                if (!await db.Authors.AnyAsync(a => a.Id == dto.Id))
                    return Results.NotFound();

                var author = dto.ToEntity();
                db.Authors.Attach(author);
                await db.SaveChangesAsync();
                return Results.Ok(author.ToDto());
            });
            
            group.MapDelete("/{id}", async (Guid id, BookStoreDbContext db) =>
            {
                var deletedRecords = await db.Authors.Where(c => c.Id == id).ExecuteDeleteAsync();

                if (deletedRecords.Equals(0))
                {
                    return Results.NotFound();
                }
                else
                {
                    await db.SaveChangesAsync();
                    return Results.NoContent();
                }
            });
        }
    }
}
